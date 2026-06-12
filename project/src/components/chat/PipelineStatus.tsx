import { CheckCircle2, Loader2, Circle, XCircle, ChevronRight } from 'lucide-react';
import type { PipelineStage, PipelineStageStatus } from '../../types';

const statusConfig: Record<PipelineStageStatus, { icon: React.ReactNode; className: string }> = {
  pending: {
    icon: <Circle size={12} />,
    className: 'pipeline-step-pending',
  },
  active: {
    icon: <Loader2 size={12} className="animate-spin" />,
    className: 'pipeline-step-active',
  },
  done: {
    icon: <CheckCircle2 size={12} />,
    className: 'pipeline-step-done',
  },
  error: {
    icon: <XCircle size={12} />,
    className: 'pipeline-step-error',
  },
};

interface PipelineStatusProps {
  stages: PipelineStage[];
  pipelineType: 'coding' | 'academic';
}

export function PipelineStatus({ stages, pipelineType }: PipelineStatusProps) {
  const total = stages.length;
  const done = stages.filter((s) => s.status === 'done').length;

  const progressColor = pipelineType === 'coding' ? 'bg-accent-500' : 'bg-success-500';
  const trackColor = pipelineType === 'coding' ? 'bg-accent-500/10' : 'bg-success-500/10';

  return (
    <div className="glass rounded-xl p-4 animate-slide-up">
      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
            {pipelineType === 'coding' ? 'Coding Sandbox Pipeline' : 'Academic Engine Pipeline'}
          </span>
          <span className="text-xs font-mono text-gray-400">
            [{done}/{total}]
          </span>
        </div>
        <div className={`h-1 rounded-full ${trackColor} overflow-hidden`}>
          <div
            className={`h-full rounded-full ${progressColor} transition-all duration-500 ease-out`}
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex flex-col gap-1.5 animate-stagger">
        {stages.map((stage, i) => {
          const config = statusConfig[stage.status];
          return (
            <div key={stage.id} className="flex items-center gap-2">
              <div className={config.className}>
                {config.icon}
                <span className="font-medium">{stage.label}</span>
              </div>
              {stage.detail && stage.status !== 'pending' && (
                <span className="text-[10px] text-gray-500 font-mono animate-fade-in">
                  {stage.detail}
                </span>
              )}
              {i < stages.length - 1 && stage.status === 'done' && stages[i + 1].status === 'active' && (
                <ChevronRight size={10} className="text-gray-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
