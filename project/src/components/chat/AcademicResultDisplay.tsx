import { Calculator, CheckCircle2, Sigma, BookOpen } from 'lucide-react';
import type { AcademicResult } from '../../types';

interface AcademicResultDisplayProps {
  result: AcademicResult;
}

export function AcademicResultDisplay({ result }: AcademicResultDisplayProps) {
  return (
    <div className="glass rounded-xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Calculator size={14} className="text-success-400" />
          <span className="text-xs font-semibold text-gray-200">Academic Analysis</span>
        </div>
        <div className="flex items-center gap-1 text-success-400">
          <CheckCircle2 size={12} />
          <span className="text-[10px] font-semibold uppercase">Verified</span>
        </div>
      </div>

      {/* Formula Routing */}
      <div className="px-4 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sigma size={11} className="text-accent-400" />
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Formula Route</p>
        </div>
        <p className="text-xs text-accent-400 font-medium">{result.formulaRouting}</p>
      </div>

      {/* Symbolic Steps */}
      <div className="px-4 py-3 border-b border-white/[0.04]">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-medium">
          Symbolic Computation Steps
        </p>
        <div className="flex flex-col gap-2">
          {result.symbolicSteps.map((step, i) => (
            <div key={step.id} className="glass-subtle rounded-lg p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-success-500/15 text-success-400 text-[10px] font-semibold">
                  {i + 1}
                </span>
                <span className="text-xs font-medium text-gray-200">{step.label}</span>
              </div>
              {step.latex && (
                <div className="ml-7 text-[11px] text-gray-400 font-mono bg-surface-950/60 rounded px-2 py-1 mb-1">
                  {step.latex}
                </div>
              )}
              {step.value && (
                <p className="ml-7 text-xs text-gray-300 leading-relaxed">{step.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verified Answer */}
      <div className="px-4 py-3 border-b border-white/[0.04]">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-medium">Verified Answer</p>
        <div className="glass-subtle rounded-lg p-3 glow-success">
          <p className="text-sm text-success-400 font-semibold">{result.verifiedAnswer}</p>
        </div>
      </div>

      {/* Explanation Steps */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen size={11} className="text-accent-400" />
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
            Step-by-Step Explanation
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          {result.explanationSteps.map((exp, i) => (
            <div
              key={i}
              className="text-xs text-gray-300 leading-relaxed pl-4 border-l-2 border-accent-500/20 py-0.5"
            >
              {exp}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
