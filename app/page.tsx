"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar, ModelType } from "@/components/SearchBar";
import { ChatThread } from "@/components/ChatThread";
import { Languages, Keyboard, CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [selectedModel, setSelectedModel] = useState<ModelType>('groq');
  const [isDeepResearch, setIsDeepResearch] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(false);

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        model: selectedModel,
        isDeepResearch,
        isBrowsing
      }
    }),
    onError: (error: any) => {
      console.error('Chat error:', error);
    }
  });

  const flattenedMessages = messages.map(msg => {
    if (msg.role === 'assistant') {
      const content = msg.parts.map(part => {
        if (part.type === 'text') {
          return part.text;
        }
        return '';
      }).join('');
      return { ...msg, content };
    }
    return msg;
  });

  const handleSearch = (query: string) => {
    sendMessage({ role: 'user', parts: [{ type: 'text', text: query }] });
  };

  const handleNewThread = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-foreground font-sans overflow-hidden">
      <Sidebar onNewThread={handleNewThread} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-3xl mx-auto w-full px-4 py-8 pb-32">
            {messages.length > 0 ? (
              <ChatThread messages={flattenedMessages} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center gap-2 mb-8">
                  <h1 className="text-4xl font-serif tracking-tight text-white flex items-center gap-2">
                    perplexity <span className="text-cyan-400 font-sans text-3xl font-medium">pro</span>
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e] to-transparent pt-20 pb-8 px-4 z-20">
          <div className="max-w-3xl mx-auto w-full">
            <SearchBar
              onSearch={handleSearch}
              isLoading={status !== 'ready'}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              isDeepResearch={isDeepResearch}
              onDeepResearchChange={setIsDeepResearch}
              isBrowsing={isBrowsing}
              onBrowsingChange={setIsBrowsing}
            />
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
              <span>Pro tip: Search is powered by Groq & HF</span>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="fixed bottom-4 right-4 flex items-center gap-2 z-50">
          <button className="p-2 rounded-full bg-[#1e1e1e] border border-white/5 text-gray-400 hover:text-white transition-colors">
            <Languages size={16} />
          </button>
          <button className="p-2 rounded-full bg-[#1e1e1e] border border-white/5 text-gray-400 hover:text-white transition-colors">
            <Keyboard size={16} />
          </button>
          <button className="p-2 rounded-full bg-[#1e1e1e] border border-white/5 text-gray-400 hover:text-white transition-colors">
            <CircleHelp size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
