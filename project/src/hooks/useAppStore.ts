import { useState, useCallback, useRef } from 'react';
import type { AppState, ChatMessage, PipelineType, PipelineStage, TelemetryMetric } from '../types';
import { executePipeline, getInitialStages } from '../engines/pipeline';

const initialState: AppState = {
  messages: [],
  sidebarOpen: true,
  activePipelineType: 'coding',
  telemetry: [
    { label: 'Problems Solved', value: 0, trend: 'stable', color: 'accent' },
    { label: 'Code Executions', value: 0, trend: 'stable', color: 'accent' },
    { label: 'Academic Solves', value: 0, trend: 'stable', color: 'success' },
    { label: 'Avg Exec Time', value: '0ms', trend: 'stable', color: 'warning' },
    { label: 'Success Rate', value: '100%', trend: 'stable', color: 'success' },
  ],
  isProcessing: false,
  totalProblemsSolved: 0,
  totalCodeExecutions: 0,
  totalAcademicSolves: 0,
  averageExecutionTimeMs: 0,
  successRate: 100,
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  const toggleSidebar = useCallback(() => {
    setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }));
  }, []);

  const setPipelineType = useCallback((type: PipelineType) => {
    setState((s) => ({ ...s, activePipelineType: type }));
  }, []);

  const submitPrompt = useCallback(async (prompt: string, type?: PipelineType) => {
    const pipelineType = type || state.activePipelineType;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    const assistantId = `msg-${Date.now() + 1}`;
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
      pipelineType,
      pipelineStages: getInitialStages(pipelineType),
      isLoading: true,
    };

    setState((s) => ({
      ...s,
      messages: [...s.messages, userMsg, assistantMsg],
      isProcessing: true,
    }));
    scrollToBottom();

    const onStagesUpdate = (stages: PipelineStage[]) => {
      setState((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === assistantId ? { ...m, pipelineStages: stages } : m
        ),
      }));
    };

    const result = await executePipeline(prompt, pipelineType, onStagesUpdate);

    setState((s) => {
      const totalSolved = s.totalProblemsSolved + 1;
      const codeExecs = s.totalCodeExecutions + (pipelineType === 'coding' ? 1 : 0);
      const acadSolves = s.totalAcademicSolves + (pipelineType === 'academic' ? 1 : 0);
      const execTime = result.codeResult?.totalExecutionTimeMs || 0;
      const newAvg = s.averageExecutionTimeMs === 0
        ? execTime
        : Math.round((s.averageExecutionTimeMs + execTime) / 2);
      const passed = result.codeResult?.overallPassed ?? true;
      const newRate = Math.round(((s.successRate * s.totalProblemsSolved) + (passed ? 100 : 0)) / totalSolved);

      const telemetry: TelemetryMetric[] = [
        { label: 'Problems Solved', value: totalSolved, trend: totalSolved > s.totalProblemsSolved ? 'up' : 'stable', color: 'accent' },
        { label: 'Code Executions', value: codeExecs, trend: codeExecs > s.totalCodeExecutions ? 'up' : 'stable', color: 'accent' },
        { label: 'Academic Solves', value: acadSolves, trend: acadSolves > s.totalAcademicSolves ? 'up' : 'stable', color: 'success' },
        { label: 'Avg Exec Time', value: `${newAvg}ms`, trend: 'stable', color: 'warning' },
        { label: 'Success Rate', value: `${newRate}%`, trend: newRate >= 90 ? 'up' : 'down', color: newRate >= 90 ? 'success' : 'error' },
      ];

      return {
        ...s,
        messages: s.messages.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                isLoading: false,
                content: pipelineType === 'coding' ? 'Code execution pipeline complete.' : 'Academic analysis pipeline complete.',
                codeResult: result.codeResult,
                academicResult: result.academicResult,
              }
            : m
        ),
        isProcessing: false,
        totalProblemsSolved: totalSolved,
        totalCodeExecutions: codeExecs,
        totalAcademicSolves: acadSolves,
        averageExecutionTimeMs: newAvg,
        successRate: newRate,
        telemetry,
      };
    });
    scrollToBottom();
  }, [state.activePipelineType, scrollToBottom]);

  const clearMessages = useCallback(() => {
    setState((s) => ({ ...s, messages: [] }));
  }, []);

  return {
    state,
    toggleSidebar,
    setPipelineType,
    submitPrompt,
    clearMessages,
    messagesEndRef,
  };
}
