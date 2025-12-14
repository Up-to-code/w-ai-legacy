import { Video } from "lucide-react";

export function Reminders() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg mb-4">Reminders</h3>
        <h4 className="font-semibold text-lg leading-tight mb-2">Meeting with Arc Company</h4>
        <p className="text-sm text-gray-500 mb-6">Time: 02.00 pm - 04.00 pm</p>
      </div>
      
      <button className="w-full bg-[#105D3B] hover:bg-[#0d4f32] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors">
        <Video className="w-5 h-5" />
        Start Meeting
      </button>
    </div>
  );
}

const teamMembers = [
    { name: "Alexandra Deff", role: "Github Project Repository", status: "Completed", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra" },
    { name: "Edwin Adenike", role: "Integrate User Authentication System", status: "In Progress", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Edwin" },
    { name: "Isaac Oluwatemilorun", role: "Develop Search and Filter Functionality", status: "Pending", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isaac" },
    { name: "David Oshodi", role: "Responsive Layout for Homepage", status: "In Progress", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
];

export function TeamCollaboration() {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 col-span-2">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Team Collaboration</h3>
                 <button className="text-xs font-semibold border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    + Add Member
                 </button>
            </div>
            
            <div className="space-y-6">
                {teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full bg-gray-100" />
                             <div>
                                 <p className="text-sm font-bold text-gray-900">{member.name}</p>
                                 <p className="text-xs text-gray-500">Working on <span className="text-gray-700 font-medium">{member.role}</span></p>
                             </div>
                        </div>
                        
                        <span className={`text-[10px] px-2 py-1 rounded-md font-medium ${
                            member.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            member.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {member.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
