import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { getProjectByKey } from "@/lib/actions/projects";
import { getProjectTimeReport } from "@/lib/actions/worklogs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatMinutes } from "@/lib/time";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  BACKLOG: "bg-gray-100 text-gray-600",
  TODO: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  REVIEW: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100 text-green-700",
};

export default async function ProjectTimePage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const project = await getProjectByKey(key);
  if (!project) return notFound();

  const report = await getProjectTimeReport(project.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/projects/${key}`}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
            {key}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{project.name} — Time Report</h1>
            <p className="text-sm text-gray-500">{project.team.name}</p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="text-xs font-medium text-gray-500">Total Time Logged</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600">
            {formatMinutes(report.totalMinutes)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-gray-500">Issues Tracked</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {report.issueBreakdown.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-gray-500">Contributors</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {report.memberBreakdown.length}
          </p>
        </Card>
      </div>

      {/* Team member breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Time by Team Member</CardTitle>
        </CardHeader>
        {report.memberBreakdown.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">No time logged yet</p>
        ) : (
          <div className="space-y-3">
            {report.memberBreakdown
              .sort((a, b) => b.totalMinutes - a.totalMinutes)
              .map((member) => {
                const pct =
                  report.totalMinutes > 0
                    ? Math.round((member.totalMinutes / report.totalMinutes) * 100)
                    : 0;
                return (
                  <div key={member.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">{member.name}</span>
                      <span className="text-gray-500">{formatMinutes(member.totalMinutes)} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </Card>

      {/* Issue breakdown */}
      <Card className="p-0 overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <CardHeader>
            <CardTitle>Time by Issue</CardTitle>
            <span className="text-xs text-gray-400">Estimated vs Actual</span>
          </CardHeader>
        </div>
        {report.issueBreakdown.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-400">No time logged yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-t border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">Issue</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Estimated</th>
                <th className="px-4 py-3 text-right">Logged</th>
                <th className="px-4 py-3 text-right">Difference</th>
                <th className="px-4 py-3 w-32">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {report.issueBreakdown
                .sort((a, b) => b.loggedMinutes - a.loggedMinutes)
                .map((issue) => {
                  const est = issue.estimateMinutes || 0;
                  const diff = est > 0 ? issue.loggedMinutes - est : 0;
                  const pct = est > 0 ? Math.min(100, Math.round((issue.loggedMinutes / est) * 100)) : 0;
                  const isOver = diff > 0;
                  const statusLabel = issue.status.replace("_", " ");
                  return (
                    <tr key={issue.issueKey}>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-gray-400">{issue.issueKey}</span>
                        <span className="ml-2 text-gray-900">{issue.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[issue.status] || ""}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {est > 0 ? formatMinutes(est) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {formatMinutes(issue.loggedMinutes)}
                      </td>
                      <td className={`px-4 py-3 text-right text-xs font-medium ${isOver ? "text-red-600" : diff < 0 ? "text-green-600" : "text-gray-400"}`}>
                        {est > 0 ? (isOver ? `+${formatMinutes(diff)}` : diff < 0 ? `-${formatMinutes(Math.abs(diff))}` : "On track") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {est > 0 ? (
                          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${isOver ? "bg-red-500" : pct > 80 ? "bg-yellow-500" : "bg-indigo-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">No estimate</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
