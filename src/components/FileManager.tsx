import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, FileJson, Eye, ChevronRight, ChevronDown, Calendar, HardDrive, CheckSquare, Square, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { JsonFile } from '../lib/supabase';

interface FileManagerProps {
  onStatsUpdate: () => void;
}

export default function FileManager({ onStatsUpdate }: FileManagerProps) {
  const [files, setFiles] = useState<JsonFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<JsonFile | null>(null);
  const [previewExpanded, setPreviewExpanded] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('json_files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFiles(data);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      alert('Please upload a JSON file');
      return;
    }

    try {
      const text = await file.text();
      const content = JSON.parse(text);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('json_files').insert({
        user_id: user.id,
        filename: file.name,
        content,
        size: file.size,
      });

      if (error) throw error;

      await loadFiles();
      onStatsUpdate();
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please ensure it is valid JSON.');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    const { error } = await supabase.from('json_files').delete().eq('id', fileId);

    if (!error) {
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      await loadFiles();
      onStatsUpdate();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const toggleExpand = (key: string) => {
    setPreviewExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const selectAllFiles = () => {
    setSelectedFiles(new Set(files.map(f => f.id)));
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  const handleProcessSelected = () => {
    if (selectedFiles.size === 0) {
      alert('Por favor selecciona al menos un archivo JSON para procesar');
      return;
    }
    
    const selectedFilesList = files.filter(f => selectedFiles.has(f.id));
    console.log('Archivos seleccionados para procesar:', selectedFilesList);
    // Aquí puedes agregar la lógica para procesar los archivos seleccionados
    alert(`Se procesarán ${selectedFilesList.length} archivo(s) JSON seleccionado(s)`);
  };

  const renderJsonPreview = (data: any, depth = 0, parentKey = ''): JSX.Element => {
    if (depth > 3) return <span className="text-slate-500">...</span>;

    if (Array.isArray(data)) {
      const key = `${parentKey}-array`;
      const isExpanded = previewExpanded[key];

      return (
        <div className="ml-4">
          <button
            onClick={() => toggleExpand(key)}
            className="text-slate-400 hover:text-slate-300 flex items-center gap-1"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <span className="text-blue-400">[</span>
            <span className="text-slate-500">{data.length} items</span>
            <span className="text-blue-400">]</span>
          </button>
          {isExpanded && (
            <div className="ml-4 border-l border-slate-700 pl-2">
              {data.slice(0, 10).map((item, i) => (
                <div key={i} className="my-1">
                  <span className="text-slate-500">{i}:</span> {renderJsonPreview(item, depth + 1, `${key}-${i}`)}
                </div>
              ))}
              {data.length > 10 && (
                <div className="text-slate-500 italic">... {data.length - 10} more items</div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (typeof data === 'object' && data !== null) {
      const entries = Object.entries(data);
      const key = `${parentKey}-object`;
      const isExpanded = previewExpanded[key];

      return (
        <div className="ml-4">
          <button
            onClick={() => toggleExpand(key)}
            className="text-slate-400 hover:text-slate-300 flex items-center gap-1"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <span className="text-blue-400">{'{'}</span>
            <span className="text-slate-500">{entries.length} properties</span>
            <span className="text-blue-400">{'}'}</span>
          </button>
          {isExpanded && (
            <div className="ml-4 border-l border-slate-700 pl-2">
              {entries.slice(0, 10).map(([k, v]) => (
                <div key={k} className="my-1">
                  <span className="text-green-400">"{k}"</span>
                  <span className="text-slate-500">: </span>
                  {renderJsonPreview(v, depth + 1, `${key}-${k}`)}
                </div>
              ))}
              {entries.length > 10 && (
                <div className="text-slate-500 italic">... {entries.length - 10} more properties</div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (typeof data === 'string') {
      return <span className="text-amber-400">"{data.length > 50 ? data.substring(0, 50) + '...' : data}"</span>;
    }

    if (typeof data === 'number') {
      return <span className="text-purple-400">{data}</span>;
    }

    if (typeof data === 'boolean') {
      return <span className="text-blue-400">{data.toString()}</span>;
    }

    if (data === null) {
      return <span className="text-slate-500">null</span>;
    }

    return <span className="text-slate-400">{String(data)}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestor de Archivos JSON</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Subir JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-600 bg-slate-900/30'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-500'}`} />
        <div className="text-white font-medium mb-2">
          {isDragging ? 'Suelta tu archivo JSON aquí' : 'Arrastra y suelta tu archivo JSON aquí'}
        </div>
        <div className="text-slate-400 text-sm">o haz clic en el botón Subir JSON de arriba</div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-blue-400" />
              Archivos JSON Disponibles
            </h3>
            {files.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllFiles}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Seleccionar todos
                </button>
                <span className="text-slate-400">|</span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Limpiar selección
                </button>
              </div>
            )}
          </div>
          
          {selectedFiles.size > 0 && (
            <div className="mb-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-300 text-sm">
                  {selectedFiles.size} archivo(s) seleccionado(s)
                </span>
                <button
                  onClick={handleProcessSelected}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Procesar Seleccionados
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {files.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No hay archivos JSON subidos aún
              </div>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className={`group flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedFile?.id === file.id
                      ? 'bg-blue-600/20 border border-blue-500'
                      : selectedFiles.has(file.id)
                      ? 'bg-green-600/20 border border-green-500'
                      : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFileSelection(file.id);
                      }}
                      className="flex-shrink-0 p-1 hover:bg-slate-700 rounded transition-colors"
                      title={selectedFiles.has(file.id) ? "Deseleccionar" : "Seleccionar"}
                    >
                      {selectedFiles.has(file.id) ? (
                        <CheckSquare className="w-5 h-5 text-green-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <FileJson className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div 
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="text-white font-medium truncate">{file.filename}</div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {(file.size / 1024).toFixed(2)} KB
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(file.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                      }}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
                      title="Vista previa"
                    >
                      <Eye className="w-4 h-4 text-slate-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-400" />
            Vista Previa
          </h3>
          {selectedFile ? (
            <div className="bg-slate-950 rounded-lg p-4 max-h-[500px] overflow-auto">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700">
                <div>
                  <div className="text-white font-medium">{selectedFile.filename}</div>
                  <div className="text-sm text-slate-400 mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB • {new Date(selectedFile.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="font-mono text-sm">
                {renderJsonPreview(selectedFile.content)}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-slate-500">
              Selecciona un archivo para ver su contenido
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
