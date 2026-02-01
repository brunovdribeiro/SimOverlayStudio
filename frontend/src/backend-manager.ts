import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import { EventEmitter } from 'events';

export interface BackendStatus {
  running: boolean;
  pid?: number;
  error?: string;
  lastStartTime?: string;
}

export class BackendProcessManager extends EventEmitter {
  private process: ChildProcess | null = null;
  private backendPath: string;
  private status: BackendStatus = { running: false };

  constructor() {
    super();
    // Path to the .NET backend executable
    // In development, we expect the backend to be run separately
    // In production, it should be bundled in the resources folder
    this.backendPath = this.getBackendPath();
  }

  private getBackendPath(): string {
    // For development, use relative path to backend project
    const devPath = path.join(__dirname, '../../backend/SimOverlayStudio.iRacingBridge');
    // For production, backend should be in resources
    const prodPath = path.join(process.resourcesPath, 'backend');
    
    // Check if we're in development mode
    return process.env.NODE_ENV === 'development' ? devPath : prodPath;
  }

  async start(): Promise<boolean> {
    if (this.process) {
      console.log('Backend process already running');
      return true;
    }

    try {
      console.log(`Starting backend process from: ${this.backendPath}`);
      
      // In development, use dotnet run
      // In production, execute the compiled binary
      const isDev = process.env.NODE_ENV === 'development';
      
      if (isDev) {
        // Development: use dotnet run
        this.process = spawn('dotnet', ['run'], {
          cwd: this.backendPath,
          stdio: ['ignore', 'pipe', 'pipe'],
          detached: false,
        });
      } else {
        // Production: execute compiled binary
        const exeName = process.platform === 'win32' 
          ? 'SimOverlayStudio.iRacingBridge.exe'
          : 'SimOverlayStudio.iRacingBridge';
        this.process = spawn(path.join(this.backendPath, exeName), [], {
          cwd: this.backendPath,
          stdio: ['ignore', 'pipe', 'pipe'],
          detached: false,
        });
      }

      this.process.stdout?.on('data', (data) => {
        console.log(`Backend: ${data.toString().trim()}`);
      });

      this.process.stderr?.on('data', (data) => {
        console.error(`Backend Error: ${data.toString().trim()}`);
      });

      this.process.on('error', (error) => {
        console.error('Failed to start backend process:', error);
        this.status = {
          running: false,
          error: error.message,
        };
        this.emit('status-change', this.status);
      });

      this.process.on('exit', (code, signal) => {
        console.log(`Backend process exited with code ${code} and signal ${signal}`);
        this.process = null;
        this.status = {
          running: false,
          error: code ? `Exited with code ${code}` : undefined,
        };
        this.emit('status-change', this.status);
      });

      this.status = {
        running: true,
        pid: this.process.pid,
        lastStartTime: new Date().toISOString(),
      };
      this.emit('status-change', this.status);

      return true;
    } catch (error) {
      console.error('Error starting backend:', error);
      this.status = {
        running: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.emit('status-change', this.status);
      return false;
    }
  }

  async stop(): Promise<boolean> {
    if (!this.process) {
      console.log('Backend process is not running');
      return true;
    }

    try {
      console.log('Stopping backend process...');
      this.process.kill('SIGTERM');
      
      // Give it 5 seconds to shut down gracefully
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          if (this.process) {
            console.log('Force killing backend process');
            this.process.kill('SIGKILL');
          }
          resolve();
        }, 5000);

        this.process?.once('exit', () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      this.process = null;
      this.status = { running: false };
      this.emit('status-change', this.status);
      return true;
    } catch (error) {
      console.error('Error stopping backend:', error);
      return false;
    }
  }

  async restart(): Promise<boolean> {
    await this.stop();
    // Wait a bit before restarting
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await this.start();
  }

  getStatus(): BackendStatus {
    return { ...this.status };
  }

  isRunning(): boolean {
    return this.status.running && this.process !== null;
  }
}
