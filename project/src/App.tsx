import { Sidebar } from './components/sidebar/Sidebar';
import { TelemetryPanel } from './components/telemetry/TelemetryPanel';
import { ChatCanvas } from './components/chat/ChatCanvas';
import { useAppStore } from './hooks/useAppStore';
import type { PipelineType } from './types';

function App() {
  const { state, toggleSidebar, setPipelineType, submitPrompt, clearMessages, messagesEndRef } = useAppStore();

  const handlePresetClick = (prompt: string, type: PipelineType) => {
    setPipelineType(type);
    submitPrompt(prompt, type);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-surface-950">
      {/* Sidebar */}
      <Sidebar
        isOpen={state.sidebarOpen}
        onToggle={toggleSidebar}
        pipelineType={state.activePipelineType}
        onPipelineTypeChange={setPipelineType}
        onPresetClick={handlePresetClick}
        onClear={clearMessages}
        solvedCount={state.totalProblemsSolved}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Telemetry Strip */}
        <div className="flex-shrink-0 p-3">
          <TelemetryPanel metrics={state.telemetry} />
        </div>

        {/* Chat Canvas */}
        <div className="flex-1 min-h-0">
          <ChatCanvas
            messages={state.messages}
            isProcessing={state.isProcessing}
            activePipelineType={state.activePipelineType}
            onSubmit={(prompt) => submitPrompt(prompt)}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
