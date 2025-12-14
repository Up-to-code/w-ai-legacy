import { Plus } from "lucide-react";

const projects = [
    { name: "Develop API Endpoints", date: "Nov 26, 2024", icon: "blue" },
    { name: "Onboarding Flow", date: "Nov 28, 2024", icon: "teal" },
    { name: "Build Dashboard", date: "Nov 30, 2024", icon: "green" },
    { name: "Optimize Page Load", date: "Dec 5, 2024", icon: "orange" },
    { name: "Cross-Browser Testing", date: "Dec 6, 2024", icon: "purple" }
]

export function ProjectList() {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Project</h3>
                <button className="flex items-center gap-1 text-xs font-semibold border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    <Plus className="w-3 h-3" /> New
                </button>
            </div>
            
            <div className="space-y-6">
                {projects.map((project, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full ${
                             project.icon === 'blue' ? 'bg-blue-500' :
                             project.icon === 'teal' ? 'bg-teal-500' :
                             project.icon === 'green' ? 'bg-green-500' :
                             project.icon === 'orange' ? 'bg-orange-500' :
                             'bg-purple-500'
                        }`} />
                        {/* Actually image has specific icons, I'll simplify with svgs if needed but dot is fine or custom shape */}
                         <div className="flex-1">
                             <h4 className="text-sm font-semibold text-gray-900">{project.name}</h4>
                             <p className="text-xs text-gray-400">Due date: {project.date}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
