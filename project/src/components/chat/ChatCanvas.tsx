import { Send, User, Bot } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { ChatMessage, PipelineType } from '../../types';
import { PipelineStatus } from './PipelineStatus';
import { CodeResultDisplay } from './CodeResultDisplay';
import { AcademicResultDisplay } from './AcademicResultDisplay';

interface ChatCanvasProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  activePipelineType: PipelineType;
  onSubmit: (prompt: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
          isUser
            ? 'bg-accent-500/15 text-accent-400'
            : 'bg-success-500/15 text-success-400'
        }`}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>

      {/* Content */}
      <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? 'items-end' : ''}`}>
        {/* Text */}
        <div
          className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-accent-500/10 border border-accent-500/20 text-gray-200'
              : 'glass-subtle text-gray-300'
          }`}
        >
          {message.content}
        </div>

        {/* Pipeline status (during loading) */}
        {message.pipelineStages && message.isLoading && message.pipelineType && (
          <PipelineStatus stages={message.pipelineStages} pipelineType={message.pipelineType} />
        )}

        {/* Code result */}
        {message.codeResult && !message.isLoading && (
          <CodeResultDisplay result={message.codeResult} />
        )}

        {/* Academic result */}
        {message.academicResult && !message.isLoading && (
          <AcademicResultDisplay result={message.academicResult} />
        )}
      </div>
    </div>
  );
}

export function ChatCanvas({ messages, isProcessing, activePipelineType, onSubmit, messagesEndRef }: ChatCanvasProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSubmit(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-4 glow-accent">
              <Bot size={28} className="text-accent-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-200 mb-1">ComputeLab</h2>
            <p className="text-xs text-gray-500 max-w-md leading-relaxed">
              Submit a coding problem or academic question. The pipeline will isolate requirements,
              generate test cases, execute in a sandbox, and verify results before presenting the solution.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-[10px] text-gray-600 font-mono bg-surface-800/60 px-2 py-1 rounded">
                Mode: {activePipelineType === 'coding' ? 'Coding Sandbox' : 'Academic Engine'}
              </span>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/[0.06]">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 glass rounded-xl flex items-center px-3 py-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isProcessing
                  ? 'Pipeline running...'
                  : activePipelineType === 'coding'
                  ? 'Describe a coding problem...'
                  : 'Ask an academic / engineering question...'
              }
              disabled={isProcessing}
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="p-2.5 rounded-xl bg-accent-500/20 text-accent-400 border border-accent-500/30 hover:bg-accent-500/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
