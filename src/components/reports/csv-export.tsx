"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CSVExportButton({ data, filename }: { data: any[], filename: string }) {
  const handleDownload = () => {
    if (data.length === 0) return;

    // Create CSV header
    const headers = Object.keys(data[0]).join(",");
    
    // Create CSV rows
    const rows = data.map(row => 
      Object.values(row)
        .map(val => typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val)
        .join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Button variant="secondary" onClick={handleDownload} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
