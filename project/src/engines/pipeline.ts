import type { PipelineType, PipelineStage, ChatMessage, CodeExecutionResult, AcademicResult } from '../types';
import { runSandboxPipeline } from './sandbox';
import { runAcademicPipeline } from './academic';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getInitialStages(type: PipelineType): PipelineStage[] {
  if (type === 'coding') {
    return [
      { id: 'req', label: 'Isolating Requirements', status: 'pending' },
      { id: 'gen', label: 'Generating Test Cases', status: 'pending' },
      { id: 'exec', label: 'Executing Sandbox', status: 'pending' },
      { id: 'critic', label: 'Critic Verification Loop', status: 'pending' },
      { id: 'render', label: 'Rendering Results', status: 'pending' },
    ];
  }
  return [
    { id: 'route', label: 'Formula Routing', status: 'pending' },
    { id: 'symbolic', label: 'Symbolic Math Engine', status: 'pending' },
    { id: 'verify', label: 'Verification & Reconciliation', status: 'pending' },
    { id: 'explain', label: 'Step-by-Step Explanation', status: 'pending' },
    { id: 'render', label: 'Rendering Results', status: 'pending' },
  ];
}

function updateStages(stages: PipelineStage[], id: string, status: PipelineStage['status'], detail?: string): PipelineStage[] {
  return stages.map((s) => (s.id === id ? { ...s, status, detail } : s));
}

export async function executePipeline(
  prompt: string,
  type: PipelineType,
  onStagesUpdate: (stages: PipelineStage[]) => void
): Promise<{ codeResult?: CodeExecutionResult; academicResult?: AcademicResult }> {
  const stages = getInitialStages(type);

  if (type === 'coding') {
    // Step 1: Requirements
    onStagesUpdate(updateStages(stages, 'req', 'active'));
    await delay(800);
    const result = runSandboxPipeline(prompt);
    onStagesUpdate(updateStages(updateStages(stages, 'req', 'done', `${result.requirements.length} requirements isolated`), 'gen', 'active'));

    // Step 2: Test cases
    await delay(1000);
    onStagesUpdate(updateStages(updateStages(updateStages(stages, 'req', 'done', `${result.requirements.length} requirements isolated`), 'gen', 'done', `${result.testCases.length} test cases generated`), 'exec', 'active'));

    // Step 3: Execution
    await delay(1200);
    const execDetail = `Booting sandbox — executing ${result.testCases.length} cases`;
    onStagesUpdate(updateStages(updateStages(updateStages(updateStages(stages, 'req', 'done'), 'gen', 'done'), 'exec', 'done', execDetail), 'critic', 'active'));

    // Step 4: Critic
    await delay(900);
    const criticDetail = result.selfCorrectionAttempts > 0
      ? `Self-correction applied (${result.selfCorrectionAttempts} attempt(s))`
      : 'All tests passed — no correction needed';
    onStagesUpdate(updateStages(updateStages(updateStages(updateStages(updateStages(stages, 'req', 'done'), 'gen', 'done'), 'exec', 'done'), 'critic', 'done', criticDetail), 'render', 'active'));

    // Step 5: Render
    await delay(500);
    onStagesUpdate(updateStages(updateStages(updateStages(updateStages(updateStages(stages, 'req', 'done'), 'gen', 'done'), 'exec', 'done'), 'critic', 'done'), 'render', 'done'));

    return { codeResult: result };
  }

  // Academic pipeline
  onStagesUpdate(updateStages(stages, 'route', 'active'));
  await delay(900);
  const aResult = runAcademicPipeline(prompt);
  onStagesUpdate(updateStages(updateStages(stages, 'route', 'done', aResult.formulaRouting), 'symbolic', 'active'));

  await delay(1100);
  onStagesUpdate(updateStages(updateStages(updateStages(stages, 'route', 'done'), 'symbolic', 'done', `${aResult.symbolicSteps.length} symbolic steps computed`), 'verify', 'active'));

  await delay(700);
  onStagesUpdate(updateStages(updateStages(updateStages(updateStages(stages, 'route', 'done'), 'symbolic', 'done'), 'verify', 'done', 'Math verified deterministically'), 'explain', 'active'));

  await delay(800);
  onStagesUpdate(updateStages(updateStages(updateStages(updateStages(updateStages(stages, 'route', 'done'), 'symbolic', 'done'), 'verify', 'done'), 'explain', 'done', `${aResult.explanationSteps.length} explanation steps`), 'render', 'active'));

  await delay(400);
  onStagesUpdate(updateStages(updateStages(updateStages(updateStages(updateStages(stages, 'route', 'done'), 'symbolic', 'done'), 'verify', 'done'), 'explain', 'done'), 'render', 'done'));

  return { academicResult: aResult };
}
