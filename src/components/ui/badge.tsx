import { IssueStatus, Priority } from "@/types";

const statusColors: Record<IssueStatus, string> = {
  BACKLOG: "bg-gray-100 text-gray-600",
  TODO: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  REVIEW: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100 text-green-700",
};

const priorityColors: Record<Priority, string> = {
  CRITICAL: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-gray-100 text-gray-600",
};

interface BadgeProps {
  children: string;
  className?: string;
}

function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  const label = status.replace("_", " ");
  return <Badge className={statusColors[status]}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge className={priorityColors[priority]}>{priority}</Badge>;
}
