import { useState, useEffect, useRef } from 'react';
import { Play, Square, AlertCircle, CheckCircle, Clock, Loader2, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { OrchestratorConfig, Execution, ExecutionTask, ExecutionLog, JsonFile } from '../lib/supabase';

interface ExecutionMonitorProps {
  config: OrchestratorConfig | null;
  onStatusChange: (status: 'active' | 'inactive' | 'processing') => void;
  onStatsUpdate: () => void;
}

export default function ExecutionMonitor({ config, onStatusChange, onStatsUpdate }: ExecutionMonitorProps) {
  const [jsonFiles, setJsonFiles] = useState<JsonFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [execution, setExecution] = useState<Execution | null>(null);
  const [tasks, setTasks] = useState<ExecutionTask[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [logFilter, setLogFilter] = useState<string>('all');
  const [isRunning, setIsRunning] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadJsonFiles();
  }, []);

  useEffect(() => {
    if (execution?.id) {
      loadTasks();
      loadLogs();

      const tasksChannel = supabase
        .channel(`tasks-${execution.id}`)
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'execution_tasks', filter: `execution_id=eq.${execution.id}` },
          () => loadTasks()
        )
        .subscribe();

      const logsChannel = supabase
        .channel(`logs-${execution.id}`)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'execution_logs', filter: `execution_id=eq.${execution.id}` },
          () => loadLogs()
        )
        .subscribe();

      const executionChannel = supabase
        .channel(`execution-${execution.id}`)
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'executions', filter: `id=eq.${execution.id}` },
          (payload) => {
            if (payload.new && typeof payload.new === 'object') {
              setExecution(payload.new as Execution);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(tasksChannel);
        supabase.removeChannel(logsChannel);
        supabase.removeChannel(executionChannel);
      };
    }
  }, [execution?.id]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const loadJsonFiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('json_files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setJsonFiles(data);
  };

  const loadTasks = async () => {
    if (!execution?.id) return;

    const { data } = await supabase
      .from('execution_tasks')
      .select('*')
      .eq('execution_id', execution.id)
      .order('chat_number', { ascending: true });

    if (data) setTasks(data);
  };

  const loadLogs = async () => {
    if (!execution?.id) return;

    const { data } = await supabase
      .from('execution_logs')
      .select('*')
      .eq('execution_id', execution.id)
      .order('created_at', { ascending: true });

    if (data) setLogs(data);
  };

  const startExecution = async () => {
    if (!config || !selectedFile) {
      alert('Please select a configuration and JSON file');
      return;
    }

    setIsRunning(true);
    onStatusChange('processing');

    try {
      const { data: file } = await supabase
        .from('json_files')
        .select('*')
        .eq('id', selectedFile)
        .single();

      if (!file) throw new Error('File not found');

      const pages = Array.isArray(file.content) ? file.content : file.content.pages || [];

      const { data: newExecution, error } = await supabase
        .from('executions')
        .insert({
          config_id: config.id,
          json_file_id: selectedFile,
          status: 'active',
          total_tasks: pages.length,
          completed_tasks: 0,
          error_count: 0,
        })
        .select()
        .single();

      if (error) throw error;

      const taskInserts = pages.map((page: any, index: number) => ({
        execution_id: newExecution.id,
        chat_number: (index % config.chat_count) + 1,
        page_data: page,
        status: 'pending',
      }));

      await supabase.from('execution_tasks').insert(taskInserts);

      await supabase.from('execution_logs').insert({
        execution_id: newExecution.id,
        level: 'info',
        message: `Execution started with ${pages.length} tasks across ${config.chat_count} chats`,
      });

      setExecution(newExecution);
      simulateExecution(newExecution.id, pages.length);
      onStatsUpdate();
    } catch (error) {
      console.error('Error starting execution:', error);
      alert('Failed to start execution');
      setIsRunning(false);
      onStatusChange('inactive');
    }
  };

  const simulateExecution = async (executionId: string, totalTasks: number) => {
    const { data: taskList } = await supabase
      .from('execution_tasks')
      .select('*')
      .eq('execution_id', executionId)
      .eq('status', 'pending');

    if (!taskList || taskList.length === 0) return;

    for (const task of taskList) {
      await supabase.from('execution_tasks').update({
        status: 'processing',
        started_at: new Date().toISOString(),
      }).eq('id', task.id);

      await supabase.from('execution_logs').insert({
        execution_id: executionId,
        level: 'info',
        message: `Processing task on Chat ${task.chat_number}`,
        metadata: { task_id: task.id },
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const isSuccess = Math.random() > 0.1;

      await supabase.from('execution_tasks').update({
        status: isSuccess ? 'completed' : 'error',
        result: isSuccess ? 'Task completed successfully' : 'Simulated error',
        completed_at: new Date().toISOString(),
      }).eq('id', task.id);

      await supabase.from('execution_logs').insert({
        execution_id: executionId,
        level: isSuccess ? 'success' : 'error',
        message: isSuccess
          ? `Task completed on Chat ${task.chat_number}`
          : `Task failed on Chat ${task.chat_number}`,
      });

      const { data: updatedExec } = await supabase
        .from('executions')
        .select('*')
        .eq('id', executionId)
        .single();

      if (updatedExec) {
        await supabase.from('executions').update({
          completed_tasks: updatedExec.completed_tasks + 1,
          error_count: updatedExec.error_count + (isSuccess ? 0 : 1),
        }).eq('id', executionId);
      }
    }

    await supabase.from('executions').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    }).eq('id', executionId);

    await supabase.from('execution_logs').insert({
      execution_id: executionId,
      level: 'success',
      message: 'Execution completed successfully',
    });

    setIsRunning(false);
    onStatusChange('inactive');
  };

  const stopExecution = async () => {
    if (!execution?.id) return;

    await supabase.from('executions').update({
      status: 'stopped',
      completed_at: new Date().toISOString(),
    }).eq('id', execution.id);

    await supabase.from('execution_logs').insert({
      execution_id: execution.id,
      level: 'warning',
      message: 'Execution stopped by user',
    });

    setIsRunning(false);
    onStatusChange('inactive');
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'processing': return 'text-blue-500';
      case 'error': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  const filteredLogs = logs.filter(log =>
    logFilter === 'all' || log.level === logFilter
  );

  const progress = execution ? (execution.completed_tasks / execution.total_tasks) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Execution Monitor</h2>
        {execution && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-400">
              {execution.completed_tasks} / {execution.total_tasks} tasks
            </div>
            {isRunning ? (
              <button
                onClick={stopExecution}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            ) : null}
          </div>
        )}
      </div>

      {!execution && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select JSON File
            </label>
            <select
              value={selectedFile || ''}
              onChange={(e) => setSelectedFile(e.target.value || null)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a JSON file...</option>
              {jsonFiles.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.filename} ({file.size} bytes)
                </option>
              ))}
            </select>
          </div>

          {!config && (
            <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-amber-300 font-medium">No Configuration Selected</div>
                <div className="text-amber-400/80 text-sm mt-1">
                  Please configure your orchestrator settings before starting an execution.
                </div>
              </div>
            </div>
          )}

          <button
            onClick={startExecution}
            disabled={!config || !selectedFile || isRunning}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Execution
          </button>
        </div>
      )}

      {execution && (
        <>
          <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isRunning ? (
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                ) : execution.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : execution.status === 'error' ? (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                ) : (
                  <Clock className="w-6 h-6 text-slate-500" />
                )}
                <div>
                  <div className="text-lg font-medium text-white capitalize">{execution.status}</div>
                  <div className="text-sm text-slate-400">
                    Started {new Date(execution.started_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
                <div className="text-sm text-slate-400">Complete</div>
              </div>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-slate-400 text-sm">Total Tasks</div>
                <div className="text-white text-xl font-bold">{execution.total_tasks}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-slate-400 text-sm">Completed</div>
                <div className="text-green-400 text-xl font-bold">{execution.completed_tasks}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-slate-400 text-sm">Errors</div>
                <div className="text-red-400 text-xl font-bold">{execution.error_count}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Tasks</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                        task.status === 'error' ? 'bg-red-500' :
                        'bg-slate-500'
                      }`} />
                      <div>
                        <div className="text-white text-sm font-medium">Task {index + 1}</div>
                        <div className="text-slate-400 text-xs">Chat {task.chat_number}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium capitalize ${getTaskStatusColor(task.status)}`}>
                      {task.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Logs</h3>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  >
                    <option value="all">All</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-xs">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex gap-2 p-2 bg-slate-800/30 rounded">
                    <span className="text-slate-500">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                    <span className={`font-medium uppercase ${getLogLevelColor(log.level)}`}>
                      [{log.level}]
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
