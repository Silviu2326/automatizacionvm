import { useState, useEffect } from 'react';
import { Save, Trash2, Plus, Monitor } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { OrchestratorConfig, ChatTemplate } from '../lib/supabase';

interface ConfigurationPanelProps {
  onConfigChange: (config: OrchestratorConfig | null) => void;
  onStatsUpdate: () => void;
}

export default function ConfigurationPanel({ onConfigChange, onStatsUpdate }: ConfigurationPanelProps) {
  const [configs, setConfigs] = useState<OrchestratorConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [chatCount, setChatCount] = useState(2);
  const [waitTime, setWaitTime] = useState(30);
  const [templates, setTemplates] = useState<Record<number, string>>({});
  const [coordinates, setCoordinates] = useState<Array<{ x: number; y: number }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  useEffect(() => {
    if (selectedConfig) {
      loadConfigDetails(selectedConfig);
    } else {
      resetForm();
    }
  }, [selectedConfig]);

  useEffect(() => {
    const newCoords = Array.from({ length: chatCount }, (_, i) => ({
      x: 100 + (i % 3) * 400,
      y: 100 + Math.floor(i / 3) * 300,
    }));
    setCoordinates(newCoords);
  }, [chatCount]);

  const loadConfigs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('orchestrator_configs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setConfigs(data);
    }
  };

  const loadConfigDetails = async (configId: string) => {
    const { data: config } = await supabase
      .from('orchestrator_configs')
      .select('*')
      .eq('id', configId)
      .single();

    const { data: templateData } = await supabase
      .from('chat_templates')
      .select('*')
      .eq('config_id', configId);

    if (config) {
      setName(config.name);
      setChatCount(config.chat_count);
      setWaitTime(config.wait_time);
      setCoordinates(config.coordinates || []);
      onConfigChange(config);
    }

    if (templateData) {
      const templatesMap: Record<number, string> = {};
      templateData.forEach((t) => {
        templatesMap[t.chat_number] = t.template;
      });
      setTemplates(templatesMap);
    }
  };

  const resetForm = () => {
    setName('');
    setChatCount(2);
    setWaitTime(30);
    setTemplates({});
    setCoordinates([]);
    onConfigChange(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a configuration name');
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      let configId = selectedConfig;

      if (selectedConfig) {
        await supabase
          .from('orchestrator_configs')
          .update({
            name,
            chat_count: chatCount,
            wait_time: waitTime,
            coordinates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedConfig);
      } else {
        const { data, error } = await supabase
          .from('orchestrator_configs')
          .insert({
            user_id: user.id,
            name,
            chat_count: chatCount,
            wait_time: waitTime,
            coordinates,
          })
          .select()
          .single();

        if (error) throw error;
        configId = data.id;
        setSelectedConfig(configId);
      }

      await supabase.from('chat_templates').delete().eq('config_id', configId);

      const templateInserts = Object.entries(templates).map(([chatNum, template]) => ({
        config_id: configId,
        chat_number: parseInt(chatNum),
        template,
      }));

      if (templateInserts.length > 0) {
        await supabase.from('chat_templates').insert(templateInserts);
      }

      await loadConfigs();
      onStatsUpdate();
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedConfig) return;
    if (!confirm('Are you sure you want to delete this configuration?')) return;

    await supabase.from('orchestrator_configs').delete().eq('id', selectedConfig);
    setSelectedConfig(null);
    await loadConfigs();
    onStatsUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Configuration</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedConfig(null)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
          {selectedConfig && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      {configs.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Configuration
          </label>
          <select
            value={selectedConfig || ''}
            onChange={(e) => setSelectedConfig(e.target.value || null)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Create New Configuration</option>
            {configs.map((config) => (
              <option key={config.id} value={config.id}>
                {config.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Configuration Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter configuration name"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Wait Time (seconds)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={waitTime}
              onChange={(e) => setWaitTime(parseInt(e.target.value) || 30)}
              min="5"
              max="300"
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setWaitTime(15)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm"
            >
              15s
            </button>
            <button
              onClick={() => setWaitTime(30)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm"
            >
              30s
            </button>
            <button
              onClick={() => setWaitTime(60)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm"
            >
              60s
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Number of Chats: {chatCount}
        </label>
        <input
          type="range"
          value={chatCount}
          onChange={(e) => setChatCount(parseInt(e.target.value))}
          min="1"
          max="6"
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          <Monitor className="w-4 h-4 inline mr-2" />
          Chat Window Positions
        </label>
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 h-64 relative overflow-hidden">
          {coordinates.map((coord, i) => (
            <div
              key={i}
              className="absolute w-16 h-12 bg-blue-500/30 border-2 border-blue-500 rounded flex items-center justify-center text-white text-xs font-bold cursor-move hover:bg-blue-500/50 transition-colors"
              style={{ left: coord.x / 4, top: coord.y / 4 }}
            >
              Chat {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Prompt Templates
        </label>
        <div className="space-y-3">
          {Array.from({ length: chatCount }, (_, i) => i + 1).map((chatNum) => (
            <div key={chatNum} className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Chat {chatNum} Template
              </label>
              <textarea
                value={templates[chatNum] || ''}
                onChange={(e) => setTemplates({ ...templates, [chatNum]: e.target.value })}
                placeholder={`Enter prompt template for Chat ${chatNum}...`}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Configuration'}
      </button>
    </div>
  );
}
