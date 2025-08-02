import React from "react";
export function StatCard({ title, value, change, trend, icon }: { title: string; value: string; change: string; trend: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-base text-muted-foreground font-medium">{title}</div>
      <div className="text-sm mt-2">{change} ({trend})</div>
    </div>
  );
}
export default StatCard; 