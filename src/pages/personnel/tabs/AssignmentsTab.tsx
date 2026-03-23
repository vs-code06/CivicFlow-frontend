import React from 'react';
import { PageTransition } from '../../../components/ui/page-transition';
import { Inbox } from 'lucide-react';
import { TaskAcceptance } from '../components/TaskAcceptance';

interface AssignmentsTabProps {
    taskStatus: 'pending' | 'accepted' | 'active' | 'completed';
    pendingTask: any;
    onAcceptTask: () => void;
}

export function AssignmentsTab({ taskStatus, pendingTask, onAcceptTask }: AssignmentsTabProps) {
    // 1. If Pending -> Show the Mission Briefing (TaskAcceptance)
    if (taskStatus === 'pending' && pendingTask) {
        return <TaskAcceptance onAccept={onAcceptTask} task={pendingTask} />;
    }

    // 2. If already Accepted/Active -> Show "No new messages" empty state
    return (
        <PageTransition className="flex items-center justify-center h-[60vh]">
            <div className="text-center p-12 bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <div className="h-20 w-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                    <Inbox className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-civic-dark dark:text-white mb-2">No New Assignments</h2>
                <p className="text-gray-400 dark:text-gray-500 max-w-xs mx-auto">You're all caught up! Check back later for new duty rosters.</p>

                {(taskStatus === 'active' || taskStatus === 'accepted') && (
                    <div className="mt-8">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-lg">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                            You have an active route
                        </span>
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
