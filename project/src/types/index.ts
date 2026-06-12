export type PipelineType = 'coding' | 'academic';

export type PipelineStageStatus = 'pending' | 'active' | 'done' | 'error';

export interface PipelineStage {
  id: string;
  label: string;
  status: PipelineStageStatus;
  detail?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  executionTimeMs?: number;
  error?: string;
}

export interface CodeRequirement {
  id: string;
  label: string;
  value: string;
}

export interface CodeExecutionResult {
  requirements: CodeRequirement[];
  testCases: TestCase[];
  finalCode: string;
  language: 'python' | 'cpp';
  selfCorrectionAttempts: number;
  overallPassed: boolean;
  totalExecutionTimeMs: number;
}

export interface AcademicStep {
  id: string;
  label: string;
  latex?: string;
  value?: string;
}

export interface AcademicResult {
  formulaRouting: string;
  symbolicSteps: AcademicStep[];
  verifiedAnswer: string;
  explanationSteps: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  pipelineType?: PipelineType;
  pipelineStages?: PipelineStage[];
  codeResult?: CodeExecutionResult;
  academicResult?: AcademicResult;
  isLoading?: boolean;
}

export interface TelemetryMetric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

export interface PresetProblem {
  id: string;
  title: string;
  type: PipelineType;
  description: string;
  prompt: string;
}

export interface AppState {
  messages: ChatMessage[];
  sidebarOpen: boolean;
  activePipelineType: PipelineType;
  telemetry: TelemetryMetric[];
  isProcessing: boolean;
  totalProblemsSolved: number;
  totalCodeExecutions: number;
  totalAcademicSolves: number;
  averageExecutionTimeMs: number;
  successRate: number;
}
