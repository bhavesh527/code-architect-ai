import type { CodeRequirement, TestCase, CodeExecutionResult } from '../types';

const REQUIREMENT_TEMPLATES: Record<string, CodeRequirement[]> = {
  subarray: [
    { id: 'tc', label: 'Time Complexity', value: 'O(N)' },
    { id: 'sc', label: 'Space Complexity', value: 'O(1)' },
    { id: 'lib', label: 'Std Library', value: 'No external deps' },
    { id: 'edge', label: 'Edge Cases', value: 'Empty array, all-negative, zero-crossing' },
  ],
  sorting: [
    { id: 'tc', label: 'Time Complexity', value: 'O(N log N)' },
    { id: 'sc', label: 'Space Complexity', value: 'O(N)' },
    { id: 'stable', label: 'Stability', value: 'Stable sort required' },
  ],
  general: [
    { id: 'tc', label: 'Time Complexity', value: 'O(N)' },
    { id: 'sc', label: 'Space Complexity', value: 'O(N)' },
    { id: 'lib', label: 'Std Library', value: 'Standard libs only' },
  ],
};

function inferRequirements(prompt: string): CodeRequirement[] {
  const lower = prompt.toLowerCase();
  if (lower.includes('subarray') || lower.includes('subarray') || lower.includes('maximum sum') || lower.includes('kadane')) {
    return REQUIREMENT_TEMPLATES.subarray;
  }
  if (lower.includes('sort') || lower.includes('ranking') || lower.includes('order')) {
    return REQUIREMENT_TEMPLATES.sorting;
  }
  return REQUIREMENT_TEMPLATES.general;
}

function generateTestCases(prompt: string): TestCase[] {
  const lower = prompt.toLowerCase();

  if (lower.includes('subarray') || lower.includes('maximum sum') || lower.includes('kadane')) {
    return [
      { id: 'tc1', input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expectedOutput: '6' },
      { id: 'tc2', input: '[-1, -2, -3, -4]', expectedOutput: '-1' },
      { id: 'tc3', input: '[]', expectedOutput: '0 (or None)' },
      { id: 'tc4', input: '[0, 0, 0, 0]', expectedOutput: '0' },
      { id: 'tc5', input: '[5, -9, 6, -2, 3]', expectedOutput: '7' },
    ];
  }

  if (lower.includes('sort')) {
    return [
      { id: 'tc1', input: '[3, 1, 4, 1, 5, 9]', expectedOutput: '[1, 1, 3, 4, 5, 9]' },
      { id: 'tc2', input: '[]', expectedOutput: '[]' },
      { id: 'tc3', input: '[1]', expectedOutput: '[1]' },
      { id: 'tc4', input: '[5, -3, 0, 2, -1]', expectedOutput: '[-3, -1, 0, 2, 5]' },
    ];
  }

  return [
    { id: 'tc1', input: '[1, 2, 3]', expectedOutput: '6' },
    { id: 'tc2', input: '[]', expectedOutput: '0' },
    { id: 'tc3', input: '[-1, -2]', expectedOutput: '-3' },
  ];
}

function generateSolutionCode(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('subarray') || lower.includes('maximum sum') || lower.includes('kadane')) {
    return `def max_subarray(nums):
    if not nums:
        return 0
    max_sum = current = nums[0]
    for num in nums[1:]:
        current = max(num, current + num)
        max_sum = max(max_sum, current)
    return max_sum`;
  }

  if (lower.includes('two sum') || lower.includes('pair sum')) {
    return `def two_sum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in lookup:
            return [lookup[complement], i]
        lookup[num] = i
    return []`;
  }

  return `def solve(data):
    # General solver
    return sum(data)`;
}

function simulateExecution(testCases: TestCase[], solutionCode: string): TestCase[] {
  return testCases.map((tc) => {
    const timeMs = Math.floor(Math.random() * 45) + 5;
    const passed = Math.random() > 0.15;

    if (passed) {
      return {
        ...tc,
        actualOutput: tc.expectedOutput,
        passed: true,
        executionTimeMs: timeMs,
      };
    }

    const corruptedOutput = tc.expectedOutput
      ? String(parseInt(tc.expectedOutput) + Math.floor(Math.random() * 3) - 1)
      : 'undefined';

    return {
      ...tc,
      actualOutput: corruptedOutput,
      passed: false,
      executionTimeMs: timeMs,
      error: `AssertionError: expected ${tc.expectedOutput}, got ${corruptedOutput}`,
    };
  });
}

function selfCorrect(testCases: TestCase[], originalCode: string): {
  correctedCode: string;
  finalTestCases: TestCase[];
  attempts: number;
} {
  let currentCode = originalCode;
  let currentTests = [...testCases];
  let attempts = 0;

  const failedTests = currentTests.filter((t) => !t.passed);
  if (failedTests.length > 0) {
    attempts = 1;
    currentCode = currentCode.replace(
      'def max_subarray',
      '# Self-correction: fixed edge case handling\ndef max_subarray'
    );
    currentTests = currentTests.map((tc) => ({
      ...tc,
      actualOutput: tc.expectedOutput,
      passed: true,
      executionTimeMs: Math.floor(Math.random() * 30) + 8,
      error: undefined,
    }));
  }

  return { correctedCode: currentCode, finalTestCases: currentTests, attempts };
}

export function runSandboxPipeline(prompt: string, language: 'python' | 'cpp' = 'python'): CodeExecutionResult {
  const requirements = inferRequirements(prompt);
  const testCases = generateTestCases(prompt);
  const solutionCode = generateSolutionCode(prompt);

  const executedTests = simulateExecution(testCases, solutionCode);
  const { correctedCode, finalTestCases, attempts } = selfCorrect(executedTests, solutionCode);

  const totalTime = finalTestCases.reduce((sum, tc) => sum + (tc.executionTimeMs || 0), 0);
  const allPassed = finalTestCases.every((tc) => tc.passed);

  return {
    requirements,
    testCases: finalTestCases,
    finalCode: correctedCode,
    language,
    selfCorrectionAttempts: attempts,
    overallPassed: allPassed,
    totalExecutionTimeMs: totalTime,
  };
}
