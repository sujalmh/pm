import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportsData } from "@/lib/actions/reports";
import { SprintMetricsChart } from "@/components/reports/metrics-charts";
import { CSVExportButton } from "@/components/reports/csv-export";
import Image from "next/image";

export const dynamic = "force-dynamic";

function formatMinutes(m: number) {
  const h = Math.floor(m / 60);
  const mins = m % 60;
  if (h === 0) return `${mins}m`;
  if (mins === 0) return `${h}h`;
  return `${h}h ${mins}m`;
}

export default async function ReportsPage() {
  const data = await getReportsData();

  if (!data) {
    return <div className="p-6">Data not found</div>;
  }

  const { workloadSummary, metricsChartData, projectStatusData } = data;

  // Prepare CSV Data
  const csvData = workloadSummary.map(w => ({
    "Name": w.name,
    "Open Tasks": w.openTasks,
    "Estimated Time": formatMinutes(w.estimatedMinutes),
    "Logged Time": formatMinutes(w.loggedMinutes),
    "Difference (Logged - Estimated)": formatMinutes(w.loggedMinutes - w.estimatedMinutes)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">Analyze team workload and sprint metrics</p>
        </div>
        <CSVExportButton data={csvData} filename="workload-summary.csv" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Sprint / Time Metrics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Global Issue Status</CardTitle>
            <span className="text-xs text-gray-400">Distribution across all projects</span>
          </CardHeader>
          <div className="p-4 flex justify-center items-center h-64">
             {metricsChartData.length > 0 ? (
               <SprintMetricsChart data={metricsChartData} />
             ) : (
               <p className="text-sm text-gray-500">No issue data available.</p>
             )}
          </div>
        </Card>

        {/* Project Tasks by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Breakdown</CardTitle>
            <span className="text-xs text-gray-400">Active tasks per project</span>
          </CardHeader>
          <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
            {projectStatusData.length === 0 ? (
              <p className="text-sm text-gray-500">No projects available.</p>
            ) : (
              projectStatusData.map(project => (
                <div key={project.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-900">{project.name}</span>
                    <span className="text-xs text-gray-500">
                      {project.TODO + project.IN_PROGRESS + project.REVIEW + project.DONE} total
                    </span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden text-xs text-white">
                    {project.TODO > 0 && <div className="bg-blue-500" style={{ flex: project.TODO }} title={`TODO: ${project.TODO}`} />}
                    {project.IN_PROGRESS > 0 && <div className="bg-yellow-500" style={{ flex: project.IN_PROGRESS }} title={`IN PROGRESS: ${project.IN_PROGRESS}`} />}
                    {project.REVIEW > 0 && <div className="bg-purple-500" style={{ flex: project.REVIEW }} title={`REVIEW: ${project.REVIEW}`} />}
                    {project.DONE > 0 && <div className="bg-green-500" style={{ flex: project.DONE }} title={`DONE: ${project.DONE}`} />}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Workload Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workload Summary per Team Member</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3 text-center">Open Tasks</th>
                <th className="px-4 py-3 text-right">Estimated</th>
                <th className="px-4 py-3 text-right">Logged</th>
                <th className="px-4 py-3 w-48">Time Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workloadSummary.map((user) => {
                const pct = user.estimatedMinutes > 0 
                  ? Math.min(100, Math.round((user.loggedMinutes / user.estimatedMinutes) * 100)) 
                  : 0;
                const isOver = user.loggedMinutes > user.estimatedMinutes;
                
                return (
                  <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <Image src={user.avatar} alt={user.name} width={24} height={24} className="rounded-full" />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-900">{user.openTasks}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{user.estimatedMinutes > 0 ? formatMinutes(user.estimatedMinutes) : "—"}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{user.loggedMinutes > 0 ? formatMinutes(user.loggedMinutes) : "0m"}</td>
                    <td className="px-4 py-3">
                      {user.estimatedMinutes > 0 ? (
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${isOver ? "bg-red-500" : pct > 80 ? "bg-yellow-500" : "bg-indigo-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300 uppercase">No estimates</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {workloadSummary.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No team members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
