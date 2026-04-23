import { ApplicationStatusLog } from "@/types";
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  Briefcase, 
  Calendar, 
  MessageSquare,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface StatusTimelineProps {
  logs: ApplicationStatusLog[];
  currentStatus: string;
}

const statusConfig: Record<string, { icon: any, color: string, label: string }> = {
  pending: { icon: Clock, color: "text-amber-600 dark:text-amber-400", label: "Application Submitted" },
  reviewed: { icon: Search, color: "text-sky-600 dark:text-sky-400", label: "Under Review" },
  interview: { icon: Briefcase, color: "text-indigo-600 dark:text-indigo-400", label: "Interview Scheduled" },
  accepted: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", label: "Accepted" },
  rejected: { icon: XCircle, color: "text-rose-600 dark:text-rose-400", label: "Closed" },
};

export default function StatusTimeline({ logs, currentStatus }: StatusTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!logs || logs.length === 0) return null;

  // The logs are already ordered 'desc' from backend, but for timeline we might want 'asc' or just handle it
  const displayLogs = isExpanded ? [...logs].reverse() : [logs[0]];

  return (
    <div className="mt-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-border dark:border-slate-800/50 pb-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          Application Progress
        </h4>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
        >
          {isExpanded ? (
            <>Hide History <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>View History ({logs.length}) <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800 before:rounded-full">
        {displayLogs.map((log, index) => {
          const config = statusConfig[log.status] || { icon: AlertCircle, color: "text-slate-400", label: log.status };
          const Icon = config.icon;
          const isLatest = index === (isExpanded ? displayLogs.length - 1 : 0);

          return (
            <div key={log.id} className={`relative group animate-in slide-in-from-left-4 duration-500 delay-${isExpanded ? index * 100 : 0}`}>
              {/* Connector Dot */}
              <div className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full border-4 border-background dark:border-slate-950 flex items-center justify-center z-10 transition-all duration-500 ${
                isLatest ? "bg-primary shadow-[0_0_15px_rgba(99,102,241,0.4)]" : "bg-card dark:bg-slate-800"
              }`}>
                {isLatest ? (
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" />
                )}
              </div>

              <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                isLatest 
                  ? "bg-card dark:bg-slate-900/50 border-primary/20 dark:border-indigo-500/20 shadow-xl" 
                  : "bg-background/50 dark:bg-slate-950/30 border-border dark:border-slate-800/50 opacity-60 hover:opacity-100"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className={`text-sm font-black uppercase tracking-wider ${isLatest ? "text-foreground dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                      {config.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {log.notes && (
                  <div className="flex items-start gap-3 bg-background dark:bg-slate-950/50 p-3 rounded-xl border border-border dark:border-slate-800/50">
                    <MessageSquare className="w-3.5 h-3.5 text-primary dark:text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic font-medium">
                      {log.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
