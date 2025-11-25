import { Search, Plus, Newspaper, Layers, LineChart, Book, User, Asterisk, Bell, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    onNewThread: () => void;
}

export function Sidebar({ onNewThread }: SidebarProps) {
    return (
        <div className="w-16 md:w-20 h-full bg-background border-r border-white/5 flex flex-col items-center py-6 gap-6 z-50">
            {/* Logo */}
            <div className="mb-2">
                <div className="w-10 h-10 flex items-center justify-center text-white">
                    <Asterisk size={32} className="text-white" />
                </div>
            </div>

            {/* New Thread Button */}
            <button
                onClick={onNewThread}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors mb-2"
            >
                <Plus size={20} />
            </button>

            {/* Navigation */}
            <nav className="flex flex-col gap-6 w-full items-center">
                <NavItem icon={<Search size={24} />} label="Home" active />
                <NavItem icon={<Newspaper size={24} />} label="Discover" />
                <NavItem icon={<Layers size={24} />} label="Spaces" />
                <NavItem icon={<LineChart size={24} />} label="Finance" />
            </nav>

            <div className="flex-1" />

            {/* Bottom Actions */}
            <div className="flex flex-col gap-6 w-full items-center mb-4">
                <NavItem icon={<Bell size={24} />} label="" />

                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <User size={16} />
                    </div>
                    <span className="text-[10px] font-medium text-cyan-400">pro</span>
                </div>

                <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <ArrowUpRight size={18} />
                    </div>
                    <span className="text-[10px]">Upgrade</span>
                </button>
            </div>
        </div>
    );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <button
            className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                active ? "text-white" : "text-gray-400 hover:text-white"
            )}
        >
            {icon}
            {label && <span className="text-[10px] font-medium">{label}</span>}
        </button>
    );
}
