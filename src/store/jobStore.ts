import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { GenerationJob, JobStatus, GenerationParams, GeneratedImage } from '@/lib/types';

interface JobStore {
  // State
  jobs: GenerationJob[];
  activeJobId: string | null;
  
  // Actions
  createJob: (params: GenerationParams) => string;
  updateJobStatus: (jobId: string, status: JobStatus, progress?: number) => void;
  updateJobProgress: (jobId: string, progress: number) => void;
  completeJob: (jobId: string, images: GeneratedImage[]) => void;
  failJob: (jobId: string, error: { code: string; message: string }) => void;
  cancelJob: (jobId: string) => void;
  highlightJob: (jobId: string, highlight: boolean) => void;
  clearHighlights: () => void;
  removeJob: (jobId: string) => void;
  clearCompletedJobs: () => void;
  
  // Computed
  getJobById: (jobId: string) => GenerationJob | undefined;
  getActiveJob: () => GenerationJob | undefined;
  getPendingJobs: () => GenerationJob[];
  getCompletedJobs: () => GenerationJob[];
  getFailedJobs: () => GenerationJob[];
  getHighlightedJobs: () => GenerationJob[];
  
  // State Machine Helpers
  canTransition: (from: JobStatus, to: JobStatus) => boolean;
  getNextValidStates: (currentStatus: JobStatus) => JobStatus[];
}

// Valid state transitions
const STATE_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  'idle': ['submitting'],
  'submitting': ['queued', 'failed', 'canceled'],
  'queued': ['generating', 'failed', 'canceled'],
  'generating': ['complete', 'failed', 'canceled'],
  'complete': ['canceled'], // Allow canceling for variations/upscales
  'failed': ['submitting', 'canceled'], // Allow retry
  'canceled': ['submitting'] // Allow restart
};

export const useJobStore = create<JobStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        jobs: [],
        activeJobId: null,

        // Actions
        createJob: (params: GenerationParams) => {
          const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const newJob: GenerationJob = {
            id: jobId,
            createdAt: Date.now(),
            params,
            status: 'idle',
            progress: 0,
            isHighlighted: false
          };

          set((state) => ({
            jobs: [newJob, ...state.jobs],
            activeJobId: jobId
          }));

          return jobId;
        },

        updateJobStatus: (jobId: string, status: JobStatus, progress?: number) => {
          set((state) => {
            const jobIndex = state.jobs.findIndex(job => job.id === jobId);
            if (jobIndex === -1) return state;

            const currentJob = state.jobs[jobIndex];
            
            // Validate state transition
            if (!get().canTransition(currentJob.status, status)) {
              console.warn(`Invalid state transition: ${currentJob.status} -> ${status} for job ${jobId}`);
              return state;
            }

            const updatedJob = {
              ...currentJob,
              status,
              progress: progress !== undefined ? progress : currentJob.progress
            };

            const newJobs = [...state.jobs];
            newJobs[jobIndex] = updatedJob;

            return {
              jobs: newJobs,
              activeJobId: status === 'complete' || status === 'failed' || status === 'canceled' 
                ? null 
                : state.activeJobId
            };
          });
        },

        updateJobProgress: (jobId: string, progress: number) => {
          set((state) => {
            const jobIndex = state.jobs.findIndex(job => job.id === jobId);
            if (jobIndex === -1) return state;

            const updatedJob = {
              ...state.jobs[jobIndex],
              progress: Math.max(0, Math.min(1, progress))
            };

            const newJobs = [...state.jobs];
            newJobs[jobIndex] = updatedJob;

            return { jobs: newJobs };
          });
        },

        completeJob: (jobId: string, images: GeneratedImage[]) => {
          set((state) => {
            const jobIndex = state.jobs.findIndex(job => job.id === jobId);
            if (jobIndex === -1) return state;

            const updatedJob: GenerationJob = {
              ...state.jobs[jobIndex],
              status: 'complete',
              progress: 1,
              images,
              isHighlighted: true, // Highlight new completions
              error: undefined // Clear any previous errors
            };

            const newJobs = [...state.jobs];
            newJobs[jobIndex] = updatedJob;

            return {
              jobs: newJobs,
              activeJobId: null
            };
          });
        },

        failJob: (jobId: string, error: { code: string; message: string }) => {
          set((state) => {
            const jobIndex = state.jobs.findIndex(job => job.id === jobId);
            if (jobIndex === -1) return state;

            const updatedJob: GenerationJob = {
              ...state.jobs[jobIndex],
              status: 'failed',
              error
            };

            const newJobs = [...state.jobs];
            newJobs[jobIndex] = updatedJob;

            return {
              jobs: newJobs,
              activeJobId: null
            };
          });
        },

        cancelJob: (jobId: string) => {
          get().updateJobStatus(jobId, 'canceled');
        },

        highlightJob: (jobId: string, highlight: boolean) => {
          set((state) => {
            const jobIndex = state.jobs.findIndex(job => job.id === jobId);
            if (jobIndex === -1) return state;

            const updatedJob = {
              ...state.jobs[jobIndex],
              isHighlighted: highlight
            };

            const newJobs = [...state.jobs];
            newJobs[jobIndex] = updatedJob;

            return { jobs: newJobs };
          });
        },

        clearHighlights: () => {
          set((state) => ({
            jobs: state.jobs.map(job => ({ ...job, isHighlighted: false }))
          }));
        },

        removeJob: (jobId: string) => {
          set((state) => ({
            jobs: state.jobs.filter(job => job.id !== jobId),
            activeJobId: state.activeJobId === jobId ? null : state.activeJobId
          }));
        },

        clearCompletedJobs: () => {
          set((state) => ({
            jobs: state.jobs.filter(job => job.status !== 'complete')
          }));
        },

        // Computed getters
        getJobById: (jobId: string) => {
          return get().jobs.find(job => job.id === jobId);
        },

        getActiveJob: () => {
          const { activeJobId, jobs } = get();
          return activeJobId ? jobs.find(job => job.id === activeJobId) : undefined;
        },

        getPendingJobs: () => {
          return get().jobs.filter(job => 
            ['submitting', 'queued', 'generating'].includes(job.status)
          );
        },

        getCompletedJobs: () => {
          return get().jobs.filter(job => job.status === 'complete');
        },

        getFailedJobs: () => {
          return get().jobs.filter(job => job.status === 'failed');
        },

        getHighlightedJobs: () => {
          return get().jobs.filter(job => job.isHighlighted);
        },

        // State machine helpers
        canTransition: (from: JobStatus, to: JobStatus) => {
          return STATE_TRANSITIONS[from]?.includes(to) || false;
        },

        getNextValidStates: (currentStatus: JobStatus) => {
          return STATE_TRANSITIONS[currentStatus] || [];
        }
      }),
      {
        name: 'openwardrobe-job-store',
        partialize: (state) => ({
          jobs: state.jobs.filter(job => 
            // Only persist completed jobs and recent failed jobs
            job.status === 'complete' || 
            (job.status === 'failed' && Date.now() - job.createdAt < 24 * 60 * 60 * 1000)
          )
        })
      }
    )
  )
);

// Auto-clear highlights after 5 seconds
if (typeof window !== 'undefined') {
  useJobStore.subscribe(
    (state) => state.jobs.filter(job => job.isHighlighted),
    (highlightedJobs) => {
      if (highlightedJobs.length > 0) {
        setTimeout(() => {
          useJobStore.getState().clearHighlights();
        }, 5000);
      }
    }
  );
}

// Job lifecycle hooks with analytics integration
export const useJobLifecycle = () => {
  const store = useJobStore();

  const startGeneration = async (params: GenerationParams) => {
    const jobId = store.createJob(params);
    const startTime = Date.now();
    
    try {
      // Track generation request with analytics
      if (typeof window !== 'undefined') {
        const { useAnalytics } = await import('@/hooks/useAnalytics');
        const { trackGenerationRequest } = useAnalytics();
        trackGenerationRequest(params, jobId);
      }
      
      store.updateJobStatus(jobId, 'submitting');
      
      // Send to API
      const response = await fetch('/api/imagine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          ref: jobId
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      store.updateJobStatus(jobId, 'queued');
      return jobId;
      
    } catch (error) {
      // Track error with analytics
      if (typeof window !== 'undefined') {
        const { useAnalytics } = await import('@/hooks/useAnalytics');
        const { trackGenerationError } = useAnalytics();
        trackGenerationError(jobId, {
          code: 'SUBMISSION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      
      store.failJob(jobId, {
        code: 'SUBMISSION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  };

  return {
    startGeneration,
    updateProgress: store.updateJobProgress,
    completeJob: (jobId: string, images: GeneratedImage[]) => {
      const job = store.getJobById(jobId);
      const duration = job ? Date.now() - job.createdAt : undefined;
      
      // Track completion with analytics
      if (typeof window !== 'undefined') {
        import('@/hooks/useAnalytics').then(({ useAnalytics }) => {
          const { trackGenerationComplete } = useAnalytics();
          trackGenerationComplete(jobId, images.length, duration);
        });
      }
      
      store.completeJob(jobId, images);
    },
    failJob: (jobId: string, error: { code: string; message: string }) => {
      // Track error with analytics
      if (typeof window !== 'undefined') {
        import('@/hooks/useAnalytics').then(({ useAnalytics }) => {
          const { trackGenerationError } = useAnalytics();
          trackGenerationError(jobId, error);
        });
      }
      
      store.failJob(jobId, error);
    },
    cancelJob: store.cancelJob
  };
};