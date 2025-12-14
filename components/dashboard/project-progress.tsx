"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Completed", value: 41 },
  { name: "Remaining", value: 59 },
];
const COLORS = ["#105D3B", "#e5e7eb"];

export function ProjectProgress() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col">
      <h3 className="font-bold text-lg mb-4">Project Progress</h3>
      
      <div className="relative h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              <Cell key="cell-0" fill={COLORS[0]} />
              <Cell key="cell-1" fill={COLORS[1]} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 text-center">
            <h4 className="text-4xl font-bold text-foreground">41%</h4>
            <p className="text-xs text-muted-foreground">Project Ended</p>
        </div>
      </div>
      
       <div className="flex justify-center gap-4 mt-[-20px] pb-4">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#105D3B]"></span>
                <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-[#105D3B]"></span>
                <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
             <div className="flex items-center gap-2">
                 {/* This matches the hatched pattern in the chart */}
                <span className="w-3 h-3 rounded-full bg-gray-300 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1)_100%)] bg-[length:4px_4px]"></span>
                <span className="text-xs text-muted-foreground">Pending</span>
            </div>
       </div>
    </div>
  );
}
