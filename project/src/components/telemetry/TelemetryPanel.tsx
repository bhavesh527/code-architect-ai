import { TrendingUp, TrendingDown, Minus, Activity, Zap, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import type { TelemetryMetric } from '../../types';

const iconMap: Record<string, React.ReactNode> = {
  accent: <Zap size={13} className="text-accent-400" />,
  success: <CheckCircle size={13} className="text-success-400" />,
  warning: <Clock size={13} className="text-warning-400" />,
  error: <Activity size={13} className="text-error-400" />,
};

const trendIcon = (trend?: string) => {
  if (trend === 'up') return <TrendingUp size={10} className="text-success-400" />;
  if (trend === 'down') return <TrendingDown size={10} className="text-error-400" />;
  return <Minus size={10} className="text-gray-500" />;
};

interface TelemetryPanelProps {
  metrics: TelemetryMetric[];
}

export function TelemetryPanel({ metrics }: TelemetryPanelProps) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={14} className="text-accent-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Live Telemetry</h3>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="glass-subtle rounded-lg p-2.5 flex flex-col gap-1 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              {iconMap[metric.color || 'accent']}
              {trendIcon(metric.trend)}
            </div>
            <span className="text-[10px] text-gray-500 truncate">{metric.label}</span>
            <span className="text-sm font-semibold text-gray-200 font-mono">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
