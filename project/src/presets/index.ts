import type { PresetProblem } from '../types';

export const presets: PresetProblem[] = [
  {
    id: 'coding-subarray',
    title: 'Maximum Subarray',
    type: 'coding',
    description: 'Find the contiguous subarray with the largest sum. Handles all-negative arrays and zero-crossing edge cases.',
    prompt: 'Write a Python function to find the maximum sum of a contiguous subarray. The array may contain negative values and zeros. Use Kadane\'s algorithm with O(N) time and O(1) space. Handle edge cases: empty array, all-negative values, zero-crossing boundaries.',
  },
  {
    id: 'academic-mosfet',
    title: 'MOSFET C_gd Saturation',
    type: 'academic',
    description: 'Calculate the gate-to-drain capacitance (C_gd) of a MOSFET in the saturation region, correctly accounting for channel pinch-off.',
    prompt: 'Calculate the gate-to-drain capacitance (C_gd) of an NMOS transistor operating in the saturation region. Given: oxide thickness t_ox = 5nm, channel width W = 10um, gate-drain overlap length L_overlap = 0.1um, epsilon_ox = 3.45e-11 F/m. Show why the channel pinch-off in saturation means C_gd is only the overlap capacitance, not the full channel capacitance.',
  },
  {
    id: 'coding-twosum',
    title: 'Two Sum',
    type: 'coding',
    description: 'Classic hash-map based two sum with O(N) time.',
    prompt: 'Write a Python function two_sum(nums, target) that returns indices of two numbers that add up to the target. Use O(N) time with a hash map. Handle duplicate values and no-solution case.',
  },
  {
    id: 'academic-rlc',
    title: 'RLC Resonance',
    type: 'academic',
    description: 'Compute impedance and resonant frequency of an RLC series circuit.',
    prompt: 'Analyze a series RLC circuit with R=10 Ohm, L=10mH, C=10uF. Calculate the resonant frequency, impedance at 1kHz, and quality factor. Show all symbolic derivations.',
  },
];
