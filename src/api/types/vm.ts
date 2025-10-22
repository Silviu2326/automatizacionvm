/**
 * Tipos para gestión de máquinas virtuales
 */

export interface VirtualMachine {
  id: string;
  name: string;
  host: string;
  port: number;
  status: 'online' | 'offline' | 'error';
  lastSeen: Date;
  processes: ProcessInstance[];
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface ProcessInstance {
  id: string;
  vmId: string;
  name: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  progress: number;
  logs: LogEntry[];
  config: ProcessConfig;
}

export interface ProcessConfig {
  chatCount: number;
  waitTime: number;
  coordinates: Record<string, { x: number; y: number }>;
  templates: Record<string, string>;
  selectedFiles: string[];
  dataFlowMode: 'json-to-notion' | 'notion-to-module' | 'module-to-backend';
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  processId: string;
  vmId: string;
}

export interface VMManager {
  vms: VirtualMachine[];
  addVM(vm: Omit<VirtualMachine, 'id' | 'processes' | 'lastSeen'>): VirtualMachine;
  removeVM(vmId: string): boolean;
  getVM(vmId: string): VirtualMachine | null;
  updateVMStatus(vmId: string, status: VirtualMachine['status']): boolean;
  startProcess(vmId: string, config: ProcessConfig): ProcessInstance;
  stopProcess(vmId: string, processId: string): boolean;
  pauseProcess(vmId: string, processId: string): boolean;
  resumeProcess(vmId: string, processId: string): boolean;
}



