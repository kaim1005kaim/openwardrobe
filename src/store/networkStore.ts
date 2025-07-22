import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { GenerationJob, JobStatus, NetworkState } from '@/lib/types';

interface NetworkStore extends NetworkState {
  // Actions
  setOnline: (online: boolean) => void;
  enqueue: (job: GenerationJob) => void;
  dequeue: (jobId: string) => void;
  addToRetryQueue: (job: GenerationJob) => void;
  removeFromRetryQueue: (jobId: string) => void;
  updateJobStatus: (jobId: string, status: JobStatus, error?: { code: string; message: string; retryCount?: number }) => void;
  flush: () => Promise<void>;
  retryJob: (jobId: string) => Promise<void>;
  clearQueues: () => void;
  handleJobFailure: (job: GenerationJob, error: Error) => void;
  
  // Computed
  getTotalPendingJobs: () => number;
  getJobById: (jobId: string) => GenerationJob | undefined;
}

const MAX_RETRY_COUNT = 3;
const RETRY_DELAYS = [1000, 3000, 10000]; // 1s, 3s, 10s

export const useNetworkStore = create<NetworkStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        online: typeof navigator !== 'undefined' ? navigator.onLine : true,
        pendingQueue: [],
        retryQueue: [],
        lastPing: Date.now(),

        // Actions
        setOnline: (online) => {
          set({ online, lastPing: Date.now() });
          
          // Auto-flush queues when coming back online
          if (online && get().getTotalPendingJobs() > 0) {
            setTimeout(() => {
              get().flush();
            }, 500);
          }
        },

        enqueue: (job) => {
          set((state) => ({
            pendingQueue: [...state.pendingQueue, { ...job, status: 'queued' }]
          }));

          // Try to send immediately if online
          if (get().online) {
            setTimeout(() => {
              get().flush();
            }, 100);
          }
        },

        dequeue: (jobId) => {
          set((state) => ({
            pendingQueue: state.pendingQueue.filter(job => job.id !== jobId)
          }));
        },

        addToRetryQueue: (job) => {
          const retryCount = (job.error?.retryCount || 0) + 1;
          const updatedJob = {
            ...job,
            status: 'failed' as JobStatus,
            error: {
              ...job.error!,
              retryCount
            }
          };

          set((state) => ({
            retryQueue: [...state.retryQueue.filter(j => j.id !== job.id), updatedJob]
          }));
        },

        removeFromRetryQueue: (jobId) => {
          set((state) => ({
            retryQueue: state.retryQueue.filter(job => job.id !== jobId)
          }));
        },

        updateJobStatus: (jobId, status, error) => {
          set((state) => {
            const updateJob = (job: GenerationJob) => 
              job.id === jobId ? { ...job, status, ...(error && { error }) } : job;

            return {
              pendingQueue: state.pendingQueue.map(updateJob),
              retryQueue: state.retryQueue.map(updateJob)
            };
          });
        },

        flush: async () => {
          const { pendingQueue, online } = get();
          
          if (!online || pendingQueue.length === 0) return;

          console.log(`🔄 Flushing ${pendingQueue.length} pending jobs`);

          for (const job of pendingQueue) {
            try {
              await sendJobToAPI(job);
              get().dequeue(job.id);
              console.log(`✅ Job ${job.id} sent successfully`);
            } catch (error) {
              console.error(`❌ Job ${job.id} failed:`, error);
              get().handleJobFailure(job, error as Error);
            }
          }
        },

        retryJob: async (jobId) => {
          const job = get().retryQueue.find(j => j.id === jobId);
          if (!job) return;

          const retryCount = job.error?.retryCount || 0;
          if (retryCount >= MAX_RETRY_COUNT) {
            console.warn(`⚠️ Job ${jobId} exceeded max retry count`);
            return;
          }

          try {
            // Wait for retry delay
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[retryCount] || 10000));
            
            await sendJobToAPI(job);
            get().removeFromRetryQueue(jobId);
            console.log(`✅ Job ${jobId} retry successful`);
          } catch (error) {
            console.error(`❌ Job ${jobId} retry failed:`, error);
            get().addToRetryQueue(job);
          }
        },

        clearQueues: () => {
          set({ pendingQueue: [], retryQueue: [] });
        },

        handleJobFailure: (job: GenerationJob, error: Error) => {
          const retryCount = (job.error?.retryCount || 0) + 1;
          
          if (retryCount < MAX_RETRY_COUNT) {
            get().addToRetryQueue(job);
          } else {
            // Permanently failed
            get().updateJobStatus(job.id, 'failed', {
              code: 'MAX_RETRIES_EXCEEDED',
              message: 'Maximum retry attempts exceeded',
              retryCount
            });
          }
          
          get().dequeue(job.id);
        },

        // Computed getters
        getTotalPendingJobs: () => {
          const { pendingQueue, retryQueue } = get();
          return pendingQueue.length + retryQueue.length;
        },

        getJobById: (jobId) => {
          const { pendingQueue, retryQueue } = get();
          return [...pendingQueue, ...retryQueue].find(job => job.id === jobId);
        }
      }),
      {
        name: 'openwardrobe-network-store',
        partialize: (state) => ({
          pendingQueue: state.pendingQueue,
          retryQueue: state.retryQueue
        })
      }
    )
  )
);

// Network status monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useNetworkStore.getState().setOnline(true);
  });

  window.addEventListener('offline', () => {
    useNetworkStore.getState().setOnline(false);
  });

  // Periodic connectivity check
  setInterval(() => {
    const isOnline = navigator.onLine;
    const currentOnlineState = useNetworkStore.getState().online;
    
    if (isOnline !== currentOnlineState) {
      useNetworkStore.getState().setOnline(isOnline);
    }
  }, 5000);
}

// API communication helper
async function sendJobToAPI(job: GenerationJob): Promise<void> {
  const response = await fetch('/api/imagine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: job.params.prompt,
      designOptions: job.params.designOptions,
      action: job.params.action || 'generate',
      ref: job.id
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}