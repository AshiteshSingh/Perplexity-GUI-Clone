"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Globe, ChevronDown, Cpu, Search, Paperclip, Mic, Lightbulb, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModelType = 'groq' | 'hf' | 'deepseek' | 'gpt-oss' | 'kimi' | 'qwen3';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
    selectedModel: ModelType;
    onModelChange: (model: ModelType) => void;
    isDeepResearch: boolean;
    onDeepResearchChange: (v: boolean) => void;
    isBrowsing: boolean;
    onBrowsingChange: (v: boolean) => void;
}

export function SearchBar({
    onSearch,
    isLoading,
    selectedModel,
    onModelChange,
    isDeepResearch,
    onDeepResearchChange,
    isBrowsing,
    onBrowsingChange
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showModelMenu, setShowModelMenu] = useState(false);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (query.trim() && !isLoading) {
                onSearch(query);
                setQuery("");
            }
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto relative">
            <div className="relative bg-[#1e1e1e] border border-white/5 rounded-[20px] shadow-lg transition-all p-3">
                <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything. Type @ for mentions."
                    className="w-full bg-transparent text-foreground placeholder-gray-500 px-2 py-2 resize-none focus:outline-none min-h-[50px] max-h-[200px] text-lg"
                    rows={1}
                />

                <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex items-center gap-2">
                        {/* Focus (Active) */}
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-900/30 text-cyan-400 transition-colors hover:bg-cyan-900/50">
                            <Search size={18} />
                        </button>

                        {/* Reasoning */}
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            <Command size={18} />
                        </button>

                        {/* Pro */}
                        <button
                            onClick={() => onDeepResearchChange(!isDeepResearch)}
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                                isDeepResearch ? "text-cyan-400" : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Lightbulb size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Web Toggle */}
                        <button
                            onClick={() => onBrowsingChange(!isBrowsing)}
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors",
                                isBrowsing && "text-cyan-400"
                            )}
                        >
                            <Globe size={18} />
                        </button>

                        {/* Model Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowModelMenu(!showModelMenu)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <Cpu size={18} />
                            </button>
                            {showModelMenu && (
                                <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#252525] border border-white/10 rounded-lg shadow-lg overflow-hidden z-10">
                                    <ModelOption label="Groq (Llama 3)" active={selectedModel === 'groq'} onClick={() => { onModelChange('groq'); setShowModelMenu(false); }} />
                                    <ModelOption label="HF (Qwen 2.5 Coder)" active={selectedModel === 'hf'} onClick={() => { onModelChange('hf'); setShowModelMenu(false); }} />
                                    <ModelOption label="DeepSeek R1" active={selectedModel === 'deepseek'} onClick={() => { onModelChange('deepseek'); setShowModelMenu(false); }} />
                                    <ModelOption label="GPT OSS 120b" active={selectedModel === 'gpt-oss'} onClick={() => { onModelChange('gpt-oss'); setShowModelMenu(false); }} />
                                    <ModelOption label="Kimi k2" active={selectedModel === 'kimi'} onClick={() => { onModelChange('kimi'); setShowModelMenu(false); }} />
                                    <ModelOption label="Qwen 3 32B" active={selectedModel === 'qwen3'} onClick={() => { onModelChange('qwen3'); setShowModelMenu(false); }} />
                                </div>
                            )}
                        </div>

                        {/* Attach (Right - Paperclip) */}
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            <Paperclip size={18} />
                        </button>

                        {/* Voice */}
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            <Mic size={18} />
                        </button>

                        {/* Submit */}
                        <button
                            onClick={() => query.trim() && !isLoading && onSearch(query)}
                            disabled={!query.trim() || isLoading}
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                                query.trim()
                                    ? "bg-cyan-500 text-black hover:opacity-90"
                                    : "bg-cyan-500/50 text-black/50 cursor-not-allowed"
                            )}
                        >
                            <ArrowUp size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModelOption({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 text-foreground flex items-center justify-between"
        >
            <span>{label}</span>
            {active && <div className="w-2 h-2 rounded-full bg-accent" />}
        </button>
    );
}
