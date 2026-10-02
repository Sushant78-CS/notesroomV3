import { ArrowRight, FileText } from "lucide-react";

import { recentNotes } from "../../data/homeData";

export default function RecentNotes() {
    return (
        <section>
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Recent Notes
                </h2>

                <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                    View all
                    <ArrowRight size={14} />
                </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                {recentNotes.map((note, index) => (
                    <button
                        key={note.id}
                        type="button"
                        className={`flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/70 ${index !== recentNotes.length - 1
                            ? "border-b border-slate-100 dark:border-slate-800"
                            : ""
                            }`}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
                            <FileText size={19} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                {note.title}
                            </h3>

                            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                {note.subject} · {note.semester}
                            </p>
                        </div>

                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {note.type}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}