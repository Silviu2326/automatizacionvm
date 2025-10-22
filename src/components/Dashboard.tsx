import { useState, useEffect } from 'react';
import { Settings, Play, FileText, Activity, Pause, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ConfigurationPanel from './ConfigurationPanel';
import ExecutionMonitor from './ExecutionMonitor';
import FileManager from './FileManager';
import type { OrchestratorConfig, Execution } from '../lib/supabase';

type View = 'config' | 'execution' | 'files';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<View>('config');
  const [systemStatus, setSystemStatus] = useState<'active' | 'inactive' | 'processing'>('inactive');
  const [currentConfig, setCurrentConfig] = useState<OrchestratorConfig | null>(null);
  const [activeExecution, setActiveExecution] = useState<Execution | null>(null);
  const [stats, setStats] = useState({ configs: 0, executions: 0, files: 0 });

  useEffect(() => {
    loadStats();

    const channel = supabase
      .channel('executions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'executions' }, (payload) => {
        if (payload.new && typeof payload.new === 'object') {
          const execution = payload.new as Execution;
          if (execution.status === 'active') {
            setSystemStatus('processing');
            setActiveExecution(execution);
          } else if (execution.status === 'completed' || execution.status === 'stopped' || execution.status === 'error') {
            setSystemStatus('inactive');
            if (activeExecution?.id === execution.id) {
              setActiveExecution(execution);
            }
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeExecution?.id]);

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [configs, executions, files] = await Promise.all([
      supabase.from('orchestrator_configs').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('executions').select('id', { count: 'exact', head: true }),
      supabase.from('json_files').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);

    setStats({
      configs: configs.count || 0,
      executions: executions.count || 0,
      files: files.count || 0,
    });
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'active': return 'text-green-500';
      case 'processing': return 'text-amber-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'active': return '⬤';
      case 'processing': return '◐';
      default: return '○';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Prompt Orchestrator
              </h1>
              <p className="text-slate-400">Automate multi-chat prompt execution workflows</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${getStatusColor()}`}>{getStatusIcon()}</span>
                  <div>
                    <div className="text-xs text-slate-400">System Status</div>
                    <div className="text-sm font-medium text-white capitalize">{systemStatus}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Configurations</div>
                  <div className="text-2xl font-bold text-white">{stats.configs}</div>
                </div>
                <Settings className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Executions</div>
                  <div className="text-2xl font-bold text-white">{stats.executions}</div>
                </div>
                <Activity className="w-8 h-8 text-green-400 opacity-50" />
              </div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-sm mb-1">JSON Files</div>
                  <div className="text-2xl font-bold text-white">{stats.files}</div>
                </div>
                <FileText className="w-8 h-8 text-amber-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveView('config')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === 'config'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            Configure
          </button>
          <button
            onClick={() => setActiveView('execution')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === 'execution'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {systemStatus === 'processing' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            Execute
          </button>
          <button
            onClick={() => setActiveView('files')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === 'files'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            Files
          </button>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
          {activeView === 'config' && (
            <ConfigurationPanel
              onConfigChange={setCurrentConfig}
              onStatsUpdate={loadStats}
            />
          )}
          {activeView === 'execution' && (
            <ExecutionMonitor
              config={currentConfig}
              onStatusChange={setSystemStatus}
              onStatsUpdate={loadStats}
            />
          )}
          {activeView === 'files' && (
            <FileManager onStatsUpdate={loadStats} />
          )}
        </div>
      </div>
    </div>
  );
}
