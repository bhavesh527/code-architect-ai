import { ChevronLeft, ChevronRight, Code2, Calculator, Trash2, Cpu, FlaskConical } from 'lucide-react';
import type { PipelineType } from '../../types';
import { presets } from '../../presets';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  pipelineType: PipelineType;
  onPipelineTypeChange: (type: PipelineType) => void;
  onPresetClick: (prompt: string, type: PipelineType) => void;
  onClear: () => void;
  solvedCount: number;
}

export function Sidebar({
  isOpen,
  onToggle,
  pipelineType,
  onPipelineTypeChange,
  onPresetClick,
  onClear,
  solvedCount,
}: SidebarProps) {
  return (
    <aside
      className={`glass-strong flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-14'
      } h-full border-r border-white/[0.06]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
        {isOpen && (
          <div className="flex items-center gap-2 animate-fade-in">
            <Cpu size={18} className="text-accent-400" />
            <span className="font-semibold text-sm text-gradient-accent">ComputeLab</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg glass-subtle glass-hover text-gray-400 hover:text-white"
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Pipeline Selector */}
      {isOpen && (
        <div className="p-3 border-b border-white/[0.06] animate-fade-in">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-medium">Pipeline Mode</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onPipelineTypeChange('coding')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                pipelineType === 'coding'
                  ? 'bg-accent-500/15 text-accent-400 border border-accent-500/30 glow-accent'
                  : 'glass-subtle glass-hover text-gray-400'
              }`}
            >
              <Code2 size={14} />
              Coding Sandbox
            </button>
            <button
              onClick={() => onPipelineTypeChange('academic')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                pipelineType === 'academic'
                  ? 'bg-success-500/15 text-success-400 border border-success-500/30 glow-success'
                  : 'glass-subtle glass-hover text-gray-400'
              }`}
            >
              <Calculator size={14} />
              Academic Engine
            </button>
          </div>
        </div>
      )}

      {/* Minimized icons */}
      {!isOpen && (
        <div className="flex flex-col items-center gap-2 p-2 border-b border-white/[0.06]">
          <button
            onClick={() => onPipelineTypeChange('coding')}
            className={`p-2 rounded-lg transition-all ${
              pipelineType === 'coding' ? 'bg-accent-500/15 text-accent-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Code2 size={16} />
          </button>
          <button
            onClick={() => onPipelineTypeChange('academic')}
            className={`p-2 rounded-lg transition-all ${
              pipelineType === 'academic' ? 'bg-success-500/15 text-success-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Calculator size={16} />
          </button>
        </div>
      )}

      {/* Presets */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-3 animate-fade-in">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-medium">
            <FlaskConical size={10} className="inline mr-1" />
            Preset Problems
          </p>
          <div className="flex flex-col gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onPresetClick(preset.prompt, preset.type)}
                className="text-left glass-subtle glass-hover rounded-lg p-2.5 group transition-all duration-200"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {preset.type === 'coding' ? (
                    <Code2 size={11} className="text-accent-400" />
                  ) : (
                    <Calculator size={11} className="text-success-400" />
                  )}
                  <span className="text-xs font-medium text-gray-200 group-hover:text-white transition-colors">
                    {preset.title}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {isOpen && (
        <div className="p-3 border-t border-white/[0.06] animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-500">
              Solved: <span className="text-accent-400 font-medium">{solvedCount}</span>
            </span>
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-error-400 transition-colors"
            >
              <Trash2 size={10} />
              Clear
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
