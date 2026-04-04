{/* <div className="flex items-center bg-neutral-100/80 border border-neutral-200/60 rounded-xl p-1 gap-1 shadow-inner shrink-0">
    {(["All", "Active", "Inactive"] as const).map((f) => (
        <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${filter === f
                ? "text-white shadow-md scale-[1.02]"
                : "text-neutral-500 hover:text-neutral-700 hover:bg-white/60"
                }`}
            style={
                filter === f
                    ? { background: "linear-gradient(135deg, #014063 0%, #0177b5 100%)" }
                    : {}
            }
        >
            {f}
        </button>
    ))}
</div> */}


// function StatCard({
//     icon,
//     value,
//     label,
//     valueClass,
//     iconClass,
// }: {
//     icon: React.ReactNode;
//     value: number;
//     label: string;
//     valueClass: string;
//     iconClass: string;
// }) {
//     return (
//         <div className="bg-background-card rounded-2xl shadow-sm border border-neutral-300/40 flex flex-col overflow-hidden relative">
//             {/* Top half – icon left, value right */}
//             <div className="flex items-center justify-between px-6 pt-6 pb-4 gap-4">
//                 <div className={`p-3 rounded-xl bg-neutral-100/80 ${iconClass}`}>
//                     {icon}
//                 </div>
//                 <div className="text-right">
//                     <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
//                     <p className="text-sm text-subtitle mt-0.5">{label}</p>
//                 </div>
//             </div>

//             <div className="relative h-14 overflow-hidden">
//                 <svg
//                     viewBox="0 0 400 56"
//                     xmlns="http://www.w3.org/2000/svg"
//                     preserveAspectRatio="none"
//                     className="absolute inset-0 w-full h-full"
//                 >
//                     <defs>
//                         <linearGradient id={`wave-grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
//                             <stop offset="0%" stopColor="#014063" stopOpacity="0.12" />
//                             <stop offset="50%" stopColor="#0177b5" stopOpacity="0.18" />
//                             <stop offset="100%" stopColor="#014063" stopOpacity="0.08" />
//                         </linearGradient>
//                     </defs>
//                     <path
//                         d="M0,28 C60,8 120,48 200,28 C280,8 340,48 400,28 L400,56 L0,56 Z"
//                         fill={`url(#wave-grad-${label})`}
//                         opacity="0.6"
//                     />
//                     <path
//                         d="M0,36 C80,16 160,52 240,32 C320,12 370,44 400,30 L400,56 L0,56 Z"
//                         fill={`url(#wave-grad-${label})`}
//                         opacity="1"
//                     />
//                 </svg>
//             </div>
//         </div>
//     );
// }