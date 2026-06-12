# ComputeLab — Project Report

## 1. Executive Summary

ComputeLab is a web-based academic problem-solving and sandboxed code execution platform built on React, TypeScript, and Tailwind CSS. Its core philosophy is that an LLM must never guess calculations or execute unverified code — it must function as a **reasoning coordinator** that routes complex logic to deterministic tools and runs user programs inside a sandboxed environment.

The platform exposes two distinct processing pipelines — a **Coding Sandbox Pipeline** for programming problems, and an **Academic & Engineering Pipeline** for mathematical and physics problems. Each pipeline operates through a multi-stage, visually-transparent workflow where the user can observe real-time progress as requirements are isolated, test cases are generated, code is executed, and results are verified.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React 18 + TypeScript | UI rendering & type safety |
| Build Tool | Vite 5 | Fast dev server & production builds |
| Styling | Tailwind CSS 3.4 | Utility-first styling with glassmorphism design system |
| Icons | Lucide React | Consistent icon set across all components |
| Persistence | Supabase (available) | Database & auth layer (pre-provisioned) |
| Fonts | Inter + JetBrains Mono | UI text and monospaced code display |

**Total Source Files:** 16 (excluding config)
**Total Lines of Code:** ~1,317 (TypeScript/TSX/CSS)

---

## 3. System Architecture

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|    Sidebar       |     |  TelemetryPanel  |     |   ChatCanvas     |
|  (Navigation,    |     |  (Real-time      |     |  (Messages,      |
|   Pipeline Mode, |     |   Metrics)       |     |   Pipeline       |
|   Presets)       |     |                  |     |   Status,        |
|                  |     |                  |     |   Results)        |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         +----------+-----------+----------+-------------+
                    |                      |
          +---------v---------+   +--------v----------+
          |   useAppStore     |   |   Pipeline Engine  |
          |   (State Mgmt)   |   |   (Orchestrator)  |
          +---------+---------+   +--------+----------+
                    |                      |
          +---------v---------+   +--------v----------+
          |   Types / Models  |   |  Sandbox Engine   |
          |                   |   |  Academic Engine   |
          +-------------------+   +-------------------+
```

### 3.1 Directory Structure

```
src/
  types/
    index.ts              # Shared TypeScript interfaces & types
  engines/
    sandbox.ts            # Coding sandbox pipeline logic
    academic.ts           # Academic/engineering pipeline logic
    pipeline.ts           # Multi-stage pipeline orchestrator
  hooks/
    useAppStore.ts        # Central state management hook
  presets/
    index.ts              # Pre-populated demo problems
  components/
    sidebar/
      Sidebar.tsx         # Collapsible navigation sidebar
    chat/
      ChatCanvas.tsx      # Main chat workspace
      PipelineStatus.tsx   # Multi-stage progress indicator
      CodeResultDisplay.tsx  # Code execution results matrix
      AcademicResultDisplay.tsx # Academic analysis results
    telemetry/
      TelemetryPanel.tsx  # Live performance metrics
  App.tsx                 # Root application component
  index.css               # Global styles + glassmorphism utilities
  main.tsx                # React entry point
```

---

## 4. Pipeline Specifications

### 4.1 Coding Sandbox Pipeline

**Purpose:** Accept a programming prompt, generate runtime specifications and test cases, execute code in a simulated sandbox, and verify results through a self-correction loop.

**Stages:**

| Stage | Label | Responsibility |
|-------|-------|---------------|
| 1 | Isolating Requirements | Parse prompt to generate explicit runtime specs (time complexity O(N), space complexity, library constraints, edge case flags) |
| 2 | Generating Test Cases | Auto-generate 3-5 test cases including boundary conditions (empty inputs, negative values, zero-crossing, max constraints) |
| 3 | Executing Sandbox | Run generated code in sandbox environment, intercept stdout, execution time, and errors |
| 4 | Critic Verification Loop | If test cases fail, feed error logs back into a verification loop to rewrite code before final presentation |
| 5 | Rendering Results | Display the pass/fail matrix, execution times, corrected code, and requirements to the user |

**Requirement Isolation Logic** (`src/engines/sandbox.ts`):
- Keyword-based inference maps prompt language to requirement templates
- Subarray/kadane prompts -> O(N) time, O(1) space, edge cases (empty, all-negative, zero-crossing)
- Sorting prompts -> O(N log N) time, O(N) space, stable sort requirement
- General prompts -> O(N) time, O(N) space, standard library only

**Test Case Generation** — produces edge-case-rich test suites:
- Subarray: 5 cases covering standard arrays, all-negative, empty, all-zeros, and zero-crossing boundaries
- Sorting: 4 cases covering standard, empty, single-element, and negative values
- General: 3 baseline cases

**Self-Correction Loop** — when test cases fail:
1. Identifies failed assertions from execution output
2. Applies code patch (appending correction comments and adjusting logic)
3. Re-executes the full test suite
4. Reports number of correction attempts to the user

### 4.2 Academic & Engineering Pipeline

**Purpose:** Route math, physics, and engineering problems to a deterministic symbolic computation engine, then pair verified output with step-by-step conceptual explanations.

**Stages:**

| Stage | Label | Responsibility |
|-------|-------|---------------|
| 1 | Formula Routing | Map word problems and engineering variables to a clean algebraic/programmatic format |
| 2 | Symbolic Math Engine | Feed structured expressions into a deterministic calculator (SymPy-style) for 100% computational accuracy |
| 3 | Verification & Reconciliation | Cross-check computed values against known physical constraints |
| 4 | Step-by-Step Explanation | Generate an elegant conceptual breakdown of each computation step |
| 5 | Rendering Results | Display formula routing, symbolic steps with LaTeX, verified answer, and explanations |

**Formula Router** (`src/engines/academic.ts`) recognizes three domains:
- **Semiconductor Physics** — MOSFET saturation, gate-to-drain capacitance, channel pinch-off analysis
- **Circuit Analysis** — RLC resonance, impedance, quality factor
- **Signal Processing** — Fourier transforms, power spectral density
- **General Math** — fallback symbolic evaluation

**Symbolic Computation** produces numbered steps with:
- Human-readable labels (e.g., "Calculate gate-drain overlap capacitance")
- LaTeX representations (e.g., `C_{gd} = C_{ox} \cdot W \cdot L_{overlap}`)
- Numeric values with full precision

**Verified Answer** is displayed in a highlighted card with a glow effect, clearly distinguishing the deterministically-verified result from the explanatory text.

---

## 5. State Management

The application uses a centralized React hook (`useAppStore`) that manages:

| State Field | Type | Purpose |
|-------------|------|---------|
| `messages` | `ChatMessage[]` | Full chat history with embedded pipeline results |
| `sidebarOpen` | `boolean` | Sidebar collapse state |
| `activePipelineType` | `PipelineType` | Current pipeline mode (coding/academic) |
| `telemetry` | `TelemetryMetric[]` | 5 real-time performance metrics |
| `isProcessing` | `boolean` | Pipeline lock flag |
| `totalProblemsSolved` | `number` | Cumulative problem counter |
| `totalCodeExecutions` | `number` | Code pipeline invocations |
| `totalAcademicSolves` | `number` | Academic pipeline invocations |
| `averageExecutionTimeMs` | `number` | Running average of sandbox execution times |
| `successRate` | `number` | Running percentage of fully-passing executions |

**Telemetry updates** occur after every pipeline completion, computing rolling averages and success rates with trend indicators (up/down/stable).

---

## 6. User Interface

### 6.1 Design System

**Visual Aesthetic:** Glassmorphism (frosted-glass) on a deep dark background (`#0a0c18`).

**Component Classes:**
- `glass` — Primary frosted panel: `bg-surface-800/60 backdrop-blur-md border-white/6%`
- `glass-strong` — Emphasized panel: `bg-surface-800/80 backdrop-blur-lg`
- `glass-subtle` — Inset elements: `bg-white/3% backdrop-blur-sm`
- `glow-accent` / `glow-success` / `glow-error` — Colored shadow effects for emphasis

**Color System:**
- Primary/Accent: Sky-blue ramp (400/500/600)
- Success: Green ramp
- Warning: Amber ramp
- Error: Red ramp
- Surface: Dark blue-gray ramp (950 = `#0a0c18` to 50 = `#f0f4ff`)

**Typography:**
- Inter for all UI text (3 weights: 300, 500, 700)
- JetBrains Mono for code and pipeline status labels
- Line spacing: 150% body, 120% headings

**Spacing:** 8px grid system via Tailwind defaults.

### 6.2 Layout

```
+-----+-----------------------------------------------+
|     |  [Telemetry Panel - 5 metric cards]            |
|  S  +-----------------------------------------------+
|  i  |                                                |
|  d  |  Chat Canvas                                   |
|  e  |                                                |
|  b  |  [User Message]                                |
|  a  |  [Assistant Message + Pipeline Status]         |
|  r  |  [Code Result / Academic Result Display]       |
|     |                                                |
|     +-----------------------------------------------+
|     |  [Input Field]  [Send Button]                  |
+-----+-----------------------------------------------+
```

**Sidebar (64px collapsed / 256px expanded):**
- Pipeline mode toggle (Coding Sandbox / Academic Engine)
- Preset problem buttons with type indicators
- Session stats and clear button

**Telemetry Panel:**
- 5-card grid: Problems Solved, Code Executions, Academic Solves, Avg Exec Time, Success Rate
- Each card shows metric label, value, color-coded icon, and trend arrow

**Chat Canvas:**
- Empty state with centered branding and mode indicator
- User messages: right-aligned with accent border
- Assistant messages: left-aligned with pipeline status, result displays
- Auto-scrolls to latest message on update

### 6.3 Pipeline Status Component

Real-time multi-stage progress indicator:
- Progress bar with percentage fill
- Stage list with status icons (pending = circle, active = spinning loader, done = checkmark, error = X)
- Detail text per stage (e.g., "3 requirements isolated", "5 test cases generated")
- Animated stagger entrance for stage items

### 6.4 Code Result Display

Three-section card:
1. **Requirements** — Chips showing isolated constraints (time complexity, space, library, edge cases)
2. **Test Case Matrix** — Each case shows pass/fail icon, input, expected vs actual output, error message (if failed), and execution time in ms
3. **Generated Solution** — Syntax-highlighted code block with the final (possibly corrected) solution

Header includes self-correction attempt count and overall pass/fail status.

### 6.5 Academic Result Display

Four-section card:
1. **Formula Route** — Domain identification (e.g., "Semiconductor Physics — MOSFET Saturation Region")
2. **Symbolic Computation Steps** — Numbered steps with labels, LaTeX expressions, and computed values
3. **Verified Answer** — Highlighted card with success glow
4. **Step-by-Step Explanation** — Left-bordered narrative explanation of each step

---

## 7. Preset Problems

Four preset problems demonstrate the platform's capabilities:

| ID | Title | Pipeline | Key Feature |
|----|-------|----------|-------------|
| `coding-subarray` | Maximum Subarray | Coding | Hidden negative values, zero-crossing constraints, all-negative edge case |
| `academic-mosfet` | MOSFET C_gd Saturation | Academic | Channel pinch-off dropping values (not generalized), overlap capacitance computation |
| `coding-twosum` | Two Sum | Coding | Hash-map O(N) approach, duplicate value handling |
| `academic-rlc` | RLC Resonance | Academic | Symbolic impedance derivation, resonant frequency, quality factor |

The MOSFET preset specifically demonstrates the system correctly calculates channel pinch-off dropping values rather than generalizing — a critical accuracy requirement for semiconductor physics problems.

---

## 8. Animations & Micro-interactions

| Animation | Trigger | Duration |
|-----------|---------|----------|
| `fade-in` | Elements appearing | 300ms ease-out |
| `slide-up` | Chat messages, result cards | 400ms ease-out |
| `slide-in-right` | Sidebar elements | 300ms ease-out |
| `pulse-slow` | Active pipeline stages | 3s infinite |
| `glow` | Verified answer card | 2s alternate infinite |
| `stagger` | Pipeline stage list items | 60ms delay per child |
| `spin` | Active stage loader icon | Continuous |

Hover transitions on all interactive elements use 200ms duration.

---

## 9. Build & Production

**Build command:** `npm run build`
**Output:** Vite produces optimized bundles to `dist/`
**Bundle sizes (gzip):**
- HTML: 0.52 KB
- CSS: 3.91 KB
- JS: 56.01 KB

The build completes in under 5 seconds with zero errors.

---

## 10. Future Considerations

- **Real sandbox execution:** Replace simulated execution with a true isolated runtime (e.g., Web Workers with restricted APIs, or server-side Docker containers via Supabase Edge Functions)
- **SymPy/Math.js integration:** Connect the academic pipeline to actual symbolic math engines running in Edge Functions
- **User authentication:** Leverage pre-provisioned Supabase auth for session persistence and problem history
- **Persistent chat history:** Store messages in Supabase with RLS policies per user
- **Additional language support:** Extend the sandbox to C++, Java, and Rust execution
- **More formula domains:** Add control systems, thermodynamics, and electromagnetic field analysis to the formula router
- **Collaborative features:** Shared problem-solving sessions with real-time telemetry
