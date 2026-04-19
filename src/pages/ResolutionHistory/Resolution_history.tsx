import {
  History,
  Download,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Users,
  Search,
  ChevronDown,
  ShieldAlert,
  Phone,
  Briefcase,
  DollarSign,
  User,
  ArrowRight,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import RHFDatePicker from "@/components/form/RHFDatePicker";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

// cardHover was unused

const mockResolutionData = [
  {
    id: "1",
    employeeName: "Sarah Johnson",
    employeeInitials: "SJ",
    badge: "AB987654B",
    changesCount: 4,
    changes: [
      {
        id: "c1",
        field: "Passport Number",
        category: "compliance",
        severity: "Critical",
        oldValue: "P12345679",
        newValue: "P12345678",
        description: "Corrected typo in passport number.",
        updatedBy: "Jessica Martinez",
        timeAgo: "20h ago",
        sourceBadge: "SMS",
        sourceFlow: "(HRMS → SMS)",
        icon: <ShieldAlert size={18} className="text-red-500" />,
        iconBg: "bg-red-50",
      },
      {
        id: "c2",
        field: "Date of Birth",
        category: "personal",
        severity: "Critical",
        oldValue: "1990-05-14",
        newValue: "1990-05-15",
        description: "Corrected DOB after passport verification.",
        updatedBy: "Jessica Martinez",
        timeAgo: "20h ago",
        sourceBadge: "SMS",
        sourceFlow: "(HRMS → SMS)",
        icon: <User size={18} className="text-red-500" />,
        iconBg: "bg-red-50",
      },
    ],
  },
  {
    id: "2",
    employeeName: "James Wilson",
    employeeInitials: "JW",
    badge: "KL901234K",
    changesCount: 2,
    changes: [
      {
        id: "c3",
        field: "Address",
        category: "contact",
        severity: "Warning",
        oldValue: "989 Cedar Ln, Chicago, IL 60601",
        newValue: "987 Cedar Ln, Chicago, IL 60601",
        description: "Address corrected after employee verification.",
        updatedBy: "Jessica Martinez",
        timeAgo: "4d ago",
        sourceBadge: "SMS",
        sourceFlow: "(HRMS → SMS)",
        icon: <Phone size={18} className="text-orange-500" />,
        iconBg: "bg-orange-50",
      },
      {
        id: "c4",
        field: "Job Title",
        category: "employment",
        severity: "Info",
        oldValue: "Software Engineer",
        newValue: "Senior Software Engineer",
        description: "Promotion effective date applied.",
        updatedBy: "Admin User",
        timeAgo: "27 Mar 2026 at 15:30",
        sourceBadge: "HRMS",
        sourceFlow: "(SMS → HRMS)",
        icon: <Briefcase size={18} className="text-blue-500" />,
        iconBg: "bg-blue-50",
      },
    ],
  },
  {
    id: "3",
    employeeName: "Emily Rodriguez",
    employeeInitials: "ER",
    badge: "EF123456E",
    changesCount: 1,
    changes: [
      {
        id: "c5",
        field: "Department",
        category: "employment",
        severity: "Info",
        oldValue: "Design Team",
        newValue: "Design",
        description: "Department name standardization.",
        updatedBy: "Admin User",
        timeAgo: "5d ago",
        sourceBadge: "HRMS",
        sourceFlow: "(SMS → HRMS)",
        icon: <Briefcase size={18} className="text-blue-500" />,
        iconBg: "bg-blue-50",
      },
    ],
  },
  {
    id: "4",
    employeeName: "David Kim",
    employeeInitials: "DK",
    badge: "GH789012G",
    changesCount: 3,
    changes: [
      {
        id: "c6",
        field: "Salary",
        category: "payroll",
        severity: "Critical",
        oldValue: "$142,000",
        newValue: "$140,000",
        description: "HRMS value was correct. SMS system updated.",
        updatedBy: "Admin User",
        timeAgo: "4d ago",
        sourceBadge: "HRMS",
        sourceFlow: "(SMS → HRMS)",
        icon: <DollarSign size={18} className="text-red-500" />,
        iconBg: "bg-red-50",
      },
      {
        id: "c7",
        field: "Email",
        category: "contact",
        severity: "Warning",
        oldValue: "davidkim@company.com",
        newValue: "david.kim@company.com",
        description: "Standardized email format.",
        updatedBy: "Jessica Martinez",
        timeAgo: "4d ago",
        sourceBadge: "SMS",
        sourceFlow: "(HRMS → SMS)",
        icon: <Phone size={18} className="text-orange-500" />,
        iconBg: "bg-orange-50",
      },
      {
        id: "c8",
        field: "NMC Expiry Date",
        category: "compliance",
        severity: "Critical",
        oldValue: "2026-04-30",
        newValue: "2026-05-01",
        description: "Updated from renewed NMC certificate.",
        updatedBy: "Jessica Martinez",
        timeAgo: "25 Mar 2026 at 16:45",
        sourceBadge: "SMS",
        sourceFlow: "(HRMS → SMS)",
        icon: <ShieldAlert size={18} className="text-red-500" />,
        iconBg: "bg-red-50",
      },
    ],
  },
  {
    id: "5",
    employeeName: "Michael Chen",
    employeeInitials: "MC",
    badge: "CD456789C",
    changesCount: 3,
    changes: [
      {
        id: "c9",
        field: "Phone",
        category: "contact",
        severity: "Warning",
        oldValue: "+1 (555) 234 5679",
        newValue: "+1 (555) 234-5678",
        description: "Updated contact number after employee confirmation.",
        updatedBy: "Admin User",
        timeAgo: "2d ago",
        sourceBadge: "SMS",
        sourceFlow: "(HRMS → SMS)",
        icon: <Phone size={18} className="text-orange-500" />,
        iconBg: "bg-orange-50",
      },
      {
        id: "c10",
        field: "Visa Expiry Date",
        category: "compliance",
        severity: "Critical",
        oldValue: "2027-12-30",
        newValue: "2027-12-31",
        description: "Corrected visa expiry date from official documents.",
        updatedBy: "Jessica Martinez",
        timeAgo: "2d ago",
        sourceBadge: "SMS",
        sourceFlow: "(HRMS → SMS)",
        icon: <ShieldAlert size={18} className="text-red-500" />,
        iconBg: "bg-red-50",
      },
    ],
  },
];

const SeverityBadge = ({ severity }: { severity: string }) => {
  let styles = "";
  switch (severity) {
    case "Critical":
      styles = "text-red-600 border-red-200 bg-red-50";
      break;
    case "Warning":
      styles = "text-orange-600 border-orange-200 bg-orange-50";
      break;
    case "Info":
      styles = "text-blue-600 border-blue-200 bg-blue-50";
      break;
    default:
      styles = "text-gray-600 border-gray-200 bg-gray-50";
  }
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles}`}
    >
      {severity}
    </span>
  );
};

const CategoryBadge = ({ category }: { category: string }) => {
  let styles = "text-blue-600 border-blue-200 bg-blue-50 bg-opacity-50";
  if (category === "compliance") {
    styles = "text-rose-600 border-rose-200 bg-rose-50";
  } else if (category === "contact") {
    styles = "text-indigo-600 border-indigo-200 bg-indigo-50";
  } else if (category === "employment") {
    styles = "text-purple-600 border-purple-200 bg-purple-50";
  } else if (category === "payroll") {
    styles = "text-emerald-600 border-emerald-200 bg-emerald-50";
  }

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles}`}
    >
      {category}
    </span>
  );
};

const SystemBadge = ({ text }: { text: string }) => {
  let styles = "text-blue-600 bg-blue-100 border-blue-200";
  if (text === "SMS") {
    styles = "text-emerald-600 bg-emerald-100 border-emerald-200";
  }
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-bold border ${styles}`}
    >
      {text}
    </span>
  );
};

const FilterDropdown = ({ 
  options, 
  selected, 
  onSelect 
}: { 
  options: string[], 
  selected: string, 
  onSelect: (val: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchTerm("");
        }}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap min-w-[140px] justify-between"
      >
        {selected}
        <ChevronDown size={16} className="text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-1.5 w-48 bg-[#4b4b4b] rounded-xl shadow-xl border border-gray-600 overflow-hidden z-50 flex flex-col max-h-80"
             style={{ left: "auto", right: "auto" }}>
          <div className="p-2 border-b border-gray-600">
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-8 pr-3 py-1.5 bg-[#3b3b3b] border border-gray-500 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#1f5f8b] transition-colors"
                autoFocus
              />
            </div>
          </div>
          <div className="py-1.5 flex flex-col overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selected === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => { onSelect(opt); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-sm font-medium flex items-center gap-2
                      ${isSelected ? "text-white bg-[#1f5f8b]" : "text-gray-200"}
                      hover:bg-[#347aa9] hover:text-white transition-colors`}
                  >
                    <div className="w-4 shrink-0 flex justify-center">
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                    {opt}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-xs text-gray-400 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ResolutionHistory() {
  const [category, setCategory] = useState("All Categories");
  const [severity, setSeverity] = useState("All Severity");
  
  const methods = useForm({
    defaultValues: {
      date: "",
      time: ""
    }
  });
  const time = methods.watch("time");

  const filteredData = mockResolutionData
    .map((emp) => {
      const filteredChanges = emp.changes.filter((change) => {
        const matchesCategory =
          category === "All Categories" ||
          change.category.toLowerCase() === category.toLowerCase();

        const matchesSeverity =
          severity === "All Severity" || change.severity === severity;

        let matchesTime = true;
        if (time === "Today") {
          matchesTime =
            change.timeAgo.includes("h ago") ||
            change.timeAgo.includes("m ago");
        } else if (time === "This Week") {
          matchesTime =
            change.timeAgo.includes("h ago") ||
            change.timeAgo.includes("m ago") ||
            change.timeAgo.includes("d ago");
        }

        return matchesCategory && matchesSeverity && matchesTime;
      });

      return {
        ...emp,
        changes: filteredChanges,
        changesCount: filteredChanges.length,
      };
    })
    .filter((emp) => emp.changesCount > 0);

  const totalFilteredChanges = filteredData.reduce(
    (acc, emp) => acc + emp.changesCount,
    0
  );

  return (
    <div className="flex-1 p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#1f5f8b] p-2 rounded-xl text-white shadow-sm flex items-center justify-center">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Resolution History
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Complete audit trail of resolved changes
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Metrics Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 text-red-500 rounded-lg">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Critical</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">6</p>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">This Week</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">11</p>
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Employees</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1f5f8b]/20 focus:border-[#1f5f8b] transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-3 pb-1 sm:pb-0">
          <FilterDropdown
            options={["All Categories", "Compliance", "Personal", "Employment", "Payroll", "Contact"]}
            selected={category}
            onSelect={setCategory}
          />
          <FilterDropdown
            options={["All Severity", "Critical", "Warning", "Info"]}
            selected={severity}
            onSelect={setSeverity}
          />
          <FormProvider {...methods}>
            <div className="flex flex-wrap sm:flex-nowrap items-start gap-2 h-10 mt-[-6px]">
              <div className="w-[150px]">
                <RHFDatePicker name="date" placeholder="Select Date" />
              </div>
            </div>
          </FormProvider>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Resolution Timeline
          </h2>
          <span className="px-3 py-1 bg-blue-50 text-[#1f5f8b] rounded-full text-xs font-semibold border border-blue-100">
            {totalFilteredChanges} {totalFilteredChanges === 1 ? 'Change' : 'Changes'}
          </span>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredData.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200"
              >
                No changes found matching the selected filters.
              </motion.div>
            ) : (
              filteredData.map((emp) => (
                <motion.div
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="border border-gray-200 rounded-2xl overflow-hidden hover:border-[#1f5f8b]/30 transition-colors shadow-sm"
                >
                  {/* Employee Header */}
                  <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-xl bg-[#1f5f8b] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                        {emp.employeeInitials}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
                        <h3 className="font-bold text-gray-900 leading-tight">
                          {emp.employeeName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 sm:mt-0 text-sm">
                          <span className="px-2 py-0.5 bg-blue-50 text-[#1f5f8b] font-medium border border-blue-100 rounded-md text-xs">
                            {emp.badge}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 font-medium text-xs">
                            {emp.changesCount} changes
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm shrink-0 ml-4 hidden sm:block active:scale-95">
                      View
                    </button>
                  </div>

                  {/* Changes List */}
                  <div className="p-5 space-y-6">
                    <AnimatePresence>
                      {emp.changes.map((change, index) => (
                        <motion.div 
                          key={change.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex gap-4">
                            {/* Icon */}
                            <div className="mt-1 shrink-0">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${change.iconBg} text-current shadow-sm`}
                              >
                                {change.icon}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Title Row */}
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="font-bold text-gray-900 text-sm">
                                  {change.field}
                                </span>
                                <CategoryBadge category={change.category} />
                                <SeverityBadge severity={change.severity} />
                              </div>

                              {/* Value Change Row */}
                              <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-3">
                                <div className="flex-1 bg-red-50/50 border border-red-100 rounded-lg p-2.5 min-w-0 relative">
                                  <span className="text-red-500/80 line-through text-sm font-mono truncate block">
                                    {change.oldValue}
                                  </span>
                                </div>
                                <div className="flex items-center justify-center lg:px-1 shrink-0">
                                  <ArrowRight size={16} className="text-gray-400" />
                                </div>
                                <div className="flex-1 bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 min-w-0">
                                  <span className="text-emerald-700 text-sm font-mono truncate block">
                                    {change.newValue}
                                  </span>
                                </div>
                              </div>

                              {/* Description block */}
                              <div className="mb-3">
                                <div className="bg-blue-50/40 rounded-lg p-3 text-sm text-[#1f5f8b] border border-blue-100/50">
                                  {change.description}
                                </div>
                              </div>

                              {/* Footer info */}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                  <User size={14} />
                                  <span>{change.updatedBy}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock size={14} />
                                  <span>{change.timeAgo}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <SystemBadge text={change.sourceBadge} />
                                  <span className="text-gray-400">
                                    {change.sourceFlow}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Divider except for last item */}
                          {index < emp.changes.length - 1 && (
                            <div className="h-px bg-gray-100 mt-6" />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
