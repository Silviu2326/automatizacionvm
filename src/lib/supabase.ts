import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface OrchestratorConfig {
  id: string;
  user_id: string;
  name: string;
  chat_count: number;
  wait_time: number;
  coordinates: Array<{ x: number; y: number }>;
  created_at: string;
  updated_at: string;
}

export interface ChatTemplate {
  id: string;
  config_id: string;
  chat_number: number;
  template: string;
  created_at: string;
}

export interface JsonFile {
  id: string;
  user_id: string;
  filename: string;
  content: any;
  size: number;
  created_at: string;
}

export interface Execution {
  id: string;
  config_id: string;
  json_file_id: string;
  status: 'pending' | 'active' | 'completed' | 'error' | 'stopped';
  total_tasks: number;
  completed_tasks: number;
  error_count: number;
  started_at: string;
  completed_at: string | null;
}

export interface ExecutionTask {
  id: string;
  execution_id: string;
  chat_number: number;
  page_data: any;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface ExecutionLog {
  id: string;
  execution_id: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  metadata: any;
  created_at: string;
}
