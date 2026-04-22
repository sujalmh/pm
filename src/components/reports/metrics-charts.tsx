"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = {
  BACKLOG: "#9CA3AF", // gray-400
  TODO: "#3B82F6", // blue-500
  "IN PROGRESS": "#EAB308", // yellow-500
  REVIEW: "#A855F7", // purple-500
  DONE: "#22C55E" // green-500
};

export function SprintMetricsChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#CBD5E1"} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
