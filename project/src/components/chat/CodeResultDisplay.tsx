import { CheckCircle2, XCircle, Clock, FileCode, AlertTriangle, RotateCcw } from 'lucide-react';
import type { CodeExecutionResult } from '../../types';

interface CodeResultDisplayProps {
  result: CodeExecutionResult;
}

export function CodeResultDisplay({ result }: CodeResultDisplayProps) {
  return (
    <div className="glass rounded-xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <FileCode size={14} className="text-accent-400" />
          <span className="text-xs font-semibold text-gray-200">
            Execution Results — {result.language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {result.selfCorrectionAttempts > 0 && (
            <div className="flex items-center gap-1 text-warning-400">
              <RotateCcw size={11} />
              <span className="text-[10px] font-mono">{result.selfCorrectionAttempts} correction(s)</span>
            </div>
          )}
          <div className={`flex items-center gap-1 ${result.overallPassed ? 'text-success-400' : 'text-error-400'}`}>
            {result.overallPassed ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
            <span className="text-[10px] font-semibold uppercase">
              {result.overallPassed ? 'All Passed' : 'Has Failures'}
            </span>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="px-4 py-3 border-b border-white/[0.04]">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-medium">Requirements Isolated</p>
        <div className="flex flex-wrap gap-1.5">
          {result.requirements.map((req) => (
            <span key={req.id} className="glass-subtle rounded-md px-2 py-0.5 text-[10px] font-mono">
              <span className="text-gray-500">{req.label}:</span>{' '}
              <span className="text-accent-400">{req.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Test Case Matrix */}
      <div className="px-4 py-3 border-b border-white/[0.04]">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-medium">
          Test Case Matrix ({result.testCases.length} cases, {result.totalExecutionTimeMs}ms total)
        </p>
        <div className="flex flex-col gap-1.5">
          {result.testCases.map((tc) => (
            <div
              key={tc.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-mono transition-colors ${
                tc.passed
                  ? 'bg-success-500/5 border border-success-500/10'
                  : 'bg-error-500/5 border border-error-500/10'
              }`}
            >
              <span className="flex-shrink-0">
                {tc.passed ? (
                  <CheckCircle2 size={12} className="text-success-400" />
                ) : (
                  <XCircle size={12} className="text-error-400" />
                )}
              </span>
              <span className="text-gray-400 truncate max-w-[180px]" title={tc.input}>
                Input: {tc.input}
              </span>
              <span className="text-gray-500">|</span>
              <span className={`${tc.passed ? 'text-success-400' : 'text-error-400'}`}>
                {tc.actualOutput}
              </span>
              {!tc.passed && tc.error && (
                <span className="text-error-400/70 text-[10px] truncate max-w-[200px]" title={tc.error}>
                  ({tc.error})
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-gray-500 text-[10px] flex-shrink-0">
                <Clock size={9} />
                {tc.executionTimeMs}ms
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Code */}
      <div className="px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-medium">Generated Solution</p>
        <pre className="bg-surface-950/80 rounded-lg p-3 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed">
          <code>{result.finalCode}</code>
        </pre>
      </div>
    </div>
  );
}
