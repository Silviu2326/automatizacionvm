/*
  # Prompt Orchestrator Database Schema

  ## Overview
  Complete database schema for the Prompt Orchestrator system that manages multiple chat configurations,
  executions, tasks, and file uploads.

  ## New Tables

  ### 1. orchestrator_configs
  Stores chat orchestrator configurations
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Owner of the configuration
  - `name` (text) - Configuration name
  - `chat_count` (integer) - Number of chats (1-6)
  - `wait_time` (integer) - Wait time in seconds
  - `coordinates` (jsonb) - Chat window coordinates
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. chat_templates
  Stores prompt templates for each chat
  - `id` (uuid, primary key) - Unique identifier
  - `config_id` (uuid, foreign key) - Links to orchestrator_configs
  - `chat_number` (integer) - Chat index (1-6)
  - `template` (text) - Prompt template content
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. json_files
  Stores uploaded JSON files with data
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - File owner
  - `filename` (text) - Original filename
  - `content` (jsonb) - JSON file content
  - `size` (integer) - File size in bytes
  - `created_at` (timestamptz) - Upload timestamp

  ### 4. executions
  Tracks execution runs
  - `id` (uuid, primary key) - Unique identifier
  - `config_id` (uuid, foreign key) - Configuration used
  - `json_file_id` (uuid, foreign key) - JSON file used
  - `status` (text) - active/completed/error/stopped
  - `total_tasks` (integer) - Total number of tasks
  - `completed_tasks` (integer) - Completed task count
  - `error_count` (integer) - Number of errors
  - `started_at` (timestamptz) - Start timestamp
  - `completed_at` (timestamptz, nullable) - Completion timestamp

  ### 5. execution_tasks
  Individual tasks within an execution
  - `id` (uuid, primary key) - Unique identifier
  - `execution_id` (uuid, foreign key) - Parent execution
  - `chat_number` (integer) - Chat handling this task
  - `page_data` (jsonb) - Page/task data from JSON
  - `status` (text) - pending/processing/completed/error
  - `result` (text, nullable) - Task result or error message
  - `started_at` (timestamptz, nullable) - Task start time
  - `completed_at` (timestamptz, nullable) - Task completion time

  ### 6. execution_logs
  Real-time log entries for executions
  - `id` (uuid, primary key) - Unique identifier
  - `execution_id` (uuid, foreign key) - Parent execution
  - `level` (text) - info/warning/error/success
  - `message` (text) - Log message content
  - `metadata` (jsonb, nullable) - Additional context
  - `created_at` (timestamptz) - Log timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own configurations, files, and executions
  - Authenticated users required for all operations

  ## Indexes
  - Performance indexes on foreign keys and status fields
  - Timestamp indexes for sorting and filtering
*/

-- Create orchestrator_configs table
CREATE TABLE IF NOT EXISTS orchestrator_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  chat_count integer NOT NULL DEFAULT 2 CHECK (chat_count >= 1 AND chat_count <= 6),
  wait_time integer NOT NULL DEFAULT 30 CHECK (wait_time >= 5 AND wait_time <= 300),
  coordinates jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orchestrator_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own configs"
  ON orchestrator_configs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configs"
  ON orchestrator_configs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configs"
  ON orchestrator_configs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own configs"
  ON orchestrator_configs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create chat_templates table
CREATE TABLE IF NOT EXISTS chat_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid NOT NULL REFERENCES orchestrator_configs(id) ON DELETE CASCADE,
  chat_number integer NOT NULL CHECK (chat_number >= 1 AND chat_number <= 6),
  template text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(config_id, chat_number)
);

ALTER TABLE chat_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view templates for own configs"
  ON chat_templates FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orchestrator_configs
    WHERE orchestrator_configs.id = chat_templates.config_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert templates for own configs"
  ON chat_templates FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orchestrator_configs
    WHERE orchestrator_configs.id = chat_templates.config_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update templates for own configs"
  ON chat_templates FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orchestrator_configs
    WHERE orchestrator_configs.id = chat_templates.config_id
    AND orchestrator_configs.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM orchestrator_configs
    WHERE orchestrator_configs.id = chat_templates.config_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete templates for own configs"
  ON chat_templates FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orchestrator_configs
    WHERE orchestrator_configs.id = chat_templates.config_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

-- Create json_files table
CREATE TABLE IF NOT EXISTS json_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  filename text NOT NULL,
  content jsonb NOT NULL,
  size integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE json_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own files"
  ON json_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files"
  ON json_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
  ON json_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create executions table
CREATE TABLE IF NOT EXISTS executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid NOT NULL REFERENCES orchestrator_configs(id) ON DELETE CASCADE,
  json_file_id uuid NOT NULL REFERENCES json_files(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'error', 'stopped')),
  total_tasks integer NOT NULL DEFAULT 0,
  completed_tasks integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view executions for own configs"
  ON executions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orchestrator_configs
    WHERE orchestrator_configs.id = executions.config_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert executions for own configs"
  ON executions FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orchestrator_configs
    WHERE orchestrator_configs.id = executions.config_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update executions for own configs"
  ON executions FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orchestrator_configs
    WHERE orchestrator_configs.id = executions.config_id
    AND orchestrator_configs.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM orchestrator_configs
    WHERE orchestrator_configs.id = executions.config_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

-- Create execution_tasks table
CREATE TABLE IF NOT EXISTS execution_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id uuid NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  chat_number integer NOT NULL,
  page_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  result text,
  started_at timestamptz,
  completed_at timestamptz
);

ALTER TABLE execution_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks for own executions"
  ON execution_tasks FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM executions
    JOIN orchestrator_configs ON orchestrator_configs.id = executions.config_id
    WHERE executions.id = execution_tasks.execution_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert tasks for own executions"
  ON execution_tasks FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM executions
    JOIN orchestrator_configs ON orchestrator_configs.id = executions.config_id
    WHERE executions.id = execution_tasks.execution_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update tasks for own executions"
  ON execution_tasks FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM executions
    JOIN orchestrator_configs ON orchestrator_configs.id = executions.config_id
    WHERE executions.id = execution_tasks.execution_id
    AND orchestrator_configs.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM executions
    JOIN orchestrator_configs ON orchestrator_configs.id = executions.config_id
    WHERE executions.id = execution_tasks.execution_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

-- Create execution_logs table
CREATE TABLE IF NOT EXISTS execution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id uuid NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  level text NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warning', 'error', 'success')),
  message text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs for own executions"
  ON execution_logs FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM executions
    JOIN orchestrator_configs ON orchestrator_configs.id = executions.config_id
    WHERE executions.id = execution_logs.execution_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert logs for own executions"
  ON execution_logs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM executions
    JOIN orchestrator_configs ON orchestrator_configs.id = executions.config_id
    WHERE executions.id = execution_logs.execution_id
    AND orchestrator_configs.user_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orchestrator_configs_user_id ON orchestrator_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_templates_config_id ON chat_templates(config_id);
CREATE INDEX IF NOT EXISTS idx_json_files_user_id ON json_files(user_id);
CREATE INDEX IF NOT EXISTS idx_executions_config_id ON executions(config_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON executions(status);
CREATE INDEX IF NOT EXISTS idx_execution_tasks_execution_id ON execution_tasks(execution_id);
CREATE INDEX IF NOT EXISTS idx_execution_tasks_status ON execution_tasks(status);
CREATE INDEX IF NOT EXISTS idx_execution_logs_execution_id ON execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_created_at ON execution_logs(created_at DESC);