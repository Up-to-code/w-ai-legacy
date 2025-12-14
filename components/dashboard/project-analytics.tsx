"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "S", value: 40 },
  { name: "M", value: 70 },
  { name: "T", value: 50 },
  { name: "W", value: 90 },
  { name: "T", value: 60 },
  { name: "F", value: 50 },
  { name: "S", value: 65 },
];

export function ProjectAnalytics() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Project Analytics</h3>
        <button className="text-gray-400 hover:text-gray-600">
            {/* simple menu dots or similar */}
            <span className="text-xl leading-none">...</span>
        </button>
      </div>
      
      <div className="flex-1 min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={36}>
             {/* Pattern defs for the hatched bars */}
             <defs>
              <pattern id="stripe" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#9CA3AF" strokeWidth="1" />
              </pattern>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              dy={10}
            />
            <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[20, 20, 20, 20]}>
              {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={index % 2 === 1 ? '#105D3B' : index === 2 ? '#5faeb6' : 'url(#stripe)'} 
                    stroke={index % 2 === 0 && index !== 2 ? '#9CA3AF' : 'none'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
