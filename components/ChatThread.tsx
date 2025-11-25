import { UIMessage as Message } from "ai";
import ReactMarkdown from "react-markdown";
import { User, Bot, Layers, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatThreadProps {
    messages: any[];
}

export function ChatThread({ messages }: ChatThreadProps) {
    if (messages.length === 0) return null;

    return (
        <div className="flex flex-col gap-8 pb-32">
            {messages.map((message, index) => (
                <div key={message.id} className="flex flex-col gap-4">
                    {/* User Message */}
                    {message.role === "user" && (
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <User size={16} className="text-gray-300" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-medium text-foreground">{message.content}</h3>
                            </div>
                        </div>
                    )}

                    {/* Assistant Message */}
                    {message.role === "assistant" && (
                        <div className="flex flex-col gap-4">
                            {/* Sources (Mocked for now) */}
                            <div className="flex flex-col gap-2 ml-12">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    <Layers size={14} />
                                    <span>Sources</span>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="min-w-[150px] h-20 bg-sidebar border border-white/5 rounded-lg p-3 flex flex-col justify-between hover:bg-white/5 cursor-pointer transition-colors">
                                            <div className="text-xs text-gray-400 truncate">Source Title {i}</div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <FileText size={10} />
                                                <span>example.com</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Answer */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                                    <Bot size={18} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                        <span>Answer</span>
                                    </div>
                                    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-sidebar max-w-none">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
