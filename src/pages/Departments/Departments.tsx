import { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Briefcase,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Sparkles,
  Users,
  Edit2,
  Trash2,
  ChevronDown,
  X as XIcon,
  Check
} from 'lucide-react';

interface Designation {
  id: number;
  name: string;
}

interface Department {
  id: number;
  code: string;
  name: string;
  colorClass: string;
  designations: Designation[];
}

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      code: 'DEPT001',
      name: 'Management',
      colorClass: 'bg-[#9333ea]',
      designations: [
        { id: 1, name: 'Director' },
        { id: 2, name: 'Manager' }
      ]
    },
    {
      id: 2,
      code: 'DEPT002',
      name: 'Nurses',
      colorClass: 'bg-[#2563eb]',
      designations: [
        { id: 3, name: 'Junior Nurse' },
        { id: 4, name: 'Senior Nurse' },
        { id: 5, name: 'Staff Nurse' }
      ]
    },
    {
      id: 3,
      code: 'DEPT003',
      name: 'Care Staff',
      colorClass: 'bg-[#059669]',
      designations: [
        { id: 6, name: 'Junior Carer' },
        { id: 7, name: 'Senior Carer' }
      ]
    },
    {
      id: 4,
      code: 'DEPT004',
      name: 'Administration',
      colorClass: 'bg-[#e48425]',
      designations: [
        { id: 8, name: 'Administrator' },
        { id: 9, name: 'Receptionist' }
      ]
    },
    {
      id: 5,
      code: 'DEPT005',
      name: 'Kitchen',
      colorClass: 'bg-[#ea580c]',
      designations: [
        { id: 10, name: 'Head Chef' },
        { id: 11, name: 'Cook' },
        { id: 12, name: 'Kitchen Assistant' }
      ]
    },
    {
      id: 6,
      code: 'DEPT006',
      name: 'Housekeeping',
      colorClass: 'bg-[#e11d48]',
      designations: [
        { id: 13, name: 'Housekeeper' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Custom Filter State
  const [filterType, setFilterType] = useState<'all' | 'with' | 'without'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Department Modal State
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptForm, setDeptForm] = useState({ code: '', name: '' });

  // Inline Designation Editing State
  const [editingDesigId, setEditingDesigId] = useState<number | null>(null);
  const [addingDesigDeptId, setAddingDesigDeptId] = useState<number | null>(null);
  const [desigFormName, setDesigFormName] = useState('');

  // Handle clicking outside filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Department Actions ---
  const openAddDeptModal = () => {
    setEditingDept(null);
    setDeptForm({
      code: `DEPT00${departments.length + 1}`,
      name: ''
    });
    setIsDeptModalOpen(true);
  };

  const openEditDeptModal = (dept: Department) => {
    setEditingDept(dept);
    setDeptForm({ code: dept.code, name: dept.name });
    setIsDeptModalOpen(true);
  };

  const saveDepartment = () => {
    if (!deptForm.name.trim() || !deptForm.code.trim()) return;

    if (editingDept) {
      setDepartments(departments.map(d =>
        d.id === editingDept.id ? { ...d, name: deptForm.name, code: deptForm.code } : d
      ));
    } else {
      const newId = Math.max(...departments.map(d => d.id), 0) + 1;
      const colors = ['bg-[#9333ea]', 'bg-[#2563eb]', 'bg-[#059669]', 'bg-[#e48425]', 'bg-[#ea580c]', 'bg-[#e11d48]'];
      const colorClass = colors[departments.length % colors.length];

      setDepartments([...departments, {
        id: newId,
        code: deptForm.code,
        name: deptForm.name,
        colorClass,
        designations: []
      }]);
    }
    setIsDeptModalOpen(false);
  };

  const deleteDepartment = (deptId: number) => {
    setDepartments(departments.filter(d => d.id !== deptId));
  };


  // --- Designation Actions ---
  const startAddDesig = (deptId: number) => {
    setEditingDesigId(null);
    setAddingDesigDeptId(deptId);
    setDesigFormName('');
  };

  const startEditDesig = (deptId: number, desig: Designation) => {
    setAddingDesigDeptId(null);
    setEditingDesigId(desig.id);
    setDesigFormName(desig.name);
  };

  const cancelDesigForm = () => {
    setAddingDesigDeptId(null);
    setEditingDesigId(null);
    setDesigFormName('');
  };

  const saveDesig = (deptId: number) => {
    if (!desigFormName.trim()) return cancelDesigForm();

    setDepartments(departments.map(dept => {
      if (dept.id === deptId) {
        if (editingDesigId) {
          return {
            ...dept,
            designations: dept.designations.map(d => d.id === editingDesigId ? { ...d, name: desigFormName.trim() } : d)
          };
        } else if (addingDesigDeptId === deptId) {
          const newId = Math.max(...departments.flatMap(d => d.designations.map(des => des.id)), 0) + 1;
          return {
            ...dept,
            designations: [...dept.designations, { id: newId, name: desigFormName.trim() }]
          };
        }
      }
      return dept;
    }));
    cancelDesigForm();
  };

  const deleteDesig = (deptId: number, desigId: number) => {
    setDepartments(departments.map(dept => {
      if (dept.id === deptId) {
        return {
          ...dept,
          designations: dept.designations.filter(d => d.id !== desigId)
        };
      }
      return dept;
    }));
  };


  // --- Derived Data ---
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.designations.some(desig => desig.name.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesFilter = true;
    if (filterType === 'with') {
      matchesFilter = dept.designations.length > 0;
    } else if (filterType === 'without') {
      matchesFilter = dept.designations.length === 0;
    }

    return matchesSearch && matchesFilter;
  });

  const totalDesignationsCount = departments.reduce((acc, dept) => acc + dept.designations.length, 0);
  const avgRoles = departments.length > 0 ? (totalDesignationsCount / departments.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 relative">
      <div className="p-8 max-w-[1400px] mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#26688A] rounded-[20px] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Departments & Designations</h1>
              <div className="flex items-center text-slate-500 font-medium">
                <Sparkles className="w-4 h-4 mr-2 text-[#bead97]" />
                Organize your workforce with smart department management
              </div>
            </div>
          </div>
          <button
            onClick={openAddDeptModal}
            className="bg-[#26688A] hover:bg-[#1f5673] text-white px-6 py-3.5 rounded-xl shadow-md border-0 font-semibold transition-all flex items-center mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Department
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[24px] p-7 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#39789A] rounded-[18px] flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-7 h-7" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
            </div>
            <p className="text-slate-500 font-semibold mb-1 tracking-wide">Total Departments</p>
            <h3 className="text-5xl font-bold text-slate-900 mb-2">{departments.length}</h3>
            <p className="text-slate-500 text-sm font-medium">Active departments</p>
          </div>

          <div className="bg-white rounded-[24px] p-7 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#c0b4a1] rounded-[18px] flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-7 h-7" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
            </div>
            <p className="text-slate-500 font-semibold mb-1 tracking-wide">Total Designations</p>
            <h3 className="text-5xl font-bold text-slate-900 mb-2">{totalDesignationsCount}</h3>
            <p className="text-slate-500 text-sm font-medium">Across all departments</p>
          </div>

          <div className="bg-gradient-to-br from-[#ebfcf4] to-[#f4fdf8] rounded-[24px] p-7 shadow-sm border border-emerald-50 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#05a36e] rounded-[18px] flex items-center justify-center text-white shadow-sm">
                <Users className="w-7 h-7" />
              </div>
              <Sparkles className="w-6 h-6 text-amber-500" strokeWidth={2} />
            </div>
            <p className="text-slate-600 font-semibold mb-1 tracking-wide">Average Roles</p>
            <h3 className="text-5xl font-bold text-slate-900 mb-2">{avgRoles}</h3>
            <p className="text-slate-500 text-sm font-medium">Per department</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-5 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[16px] leading-5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#26688A] focus:border-transparent text-[15px] font-medium shadow-sm transition-all text-slate-700"
              placeholder="Search departments, codes, or designations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-72 relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full h-full bg-white border border-slate-200 rounded-[16px] px-5 py-4 flex items-center justify-between text-slate-700 font-semibold text-[15px] shadow-sm hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                {filterType === 'all' ? 'All Departments' : filterType === 'with' ? 'With Designations' : 'Without Designations'}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Dropdown Filter */}
            {isFilterOpen && (
              <div className="absolute top-full mt-2 w-full bg-[#525659] rounded-xl shadow-xl overflow-hidden z-20 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                <button
                  onClick={() => { setFilterType('all'); setIsFilterOpen(false); }}
                  className="w-full px-3 py-2.5 text-left rounded-lg hover:bg-white/10 flex items-center gap-2 text-white font-medium transition-colors"
                >
                  <span className="w-5 text-white/90">{filterType === 'all' && <Check className="w-4 h-4" strokeWidth={3} />}</span>
                  All Departments
                </button>
                <button
                  onClick={() => { setFilterType('with'); setIsFilterOpen(false); }}
                  className="w-full px-3 py-2.5 text-left rounded-lg hover:bg-white/10 flex items-center gap-2 text-white font-medium transition-colors"
                >
                  <span className="w-5 text-white/90">{filterType === 'with' && <Check className="w-4 h-4" strokeWidth={3} />}</span>
                  With Designations
                </button>
                <button
                  onClick={() => { setFilterType('without'); setIsFilterOpen(false); }}
                  className="w-full px-3 py-2.5 text-left rounded-lg hover:bg-white/10 flex items-center gap-2 text-white font-medium transition-colors"
                >
                  <span className="w-5 text-white/90">{filterType === 'without' && <Check className="w-4 h-4" strokeWidth={3} />}</span>
                  Without Designations
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map(dept => (
            <div key={dept.id} className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
              {/* Card Header Colored */}
              <div className={`${dept.colorClass} p-7 relative overflow-hidden rounded-t-[24px]`}>
                <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-2 translate-y-2 pointer-events-none">
                  <Building2 size={120} strokeWidth={1.5} className="text-white" />
                </div>
                <div className="relative z-10 flex flex-col gap-3">
                  <span className="inline-flex w-max px-3.5 py-1.5 bg-white/20 rounded-full text-white text-xs font-bold tracking-widest border border-white/10 shadow-sm">
                    {dept.code}
                  </span>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight mt-1">{dept.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7 flex-1 flex flex-col bg-white">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 text-slate-500 font-bold tracking-wide text-sm">
                    <Briefcase className="w-5 h-5 text-slate-400" />
                    Designations
                  </div>
                  <span className="bg-[#e4fdf1] text-[#059669] py-1 px-3.5 rounded-full text-sm font-bold border border-[#a7f3d0] shadow-sm">
                    {dept.designations.length}
                  </span>
                </div>

                <div className="space-y-3 mb-5 overflow-y-auto h-[260px] min-h-[260px] max-h-[260px] pr-1 block" style={{ scrollbarWidth: 'thin' }}>
                  {dept.designations.map(desig => (
                    <div key={desig.id}>
                      {editingDesigId === desig.id ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={desigFormName}
                            onChange={(e) => setDesigFormName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveDesig(dept.id)}
                            autoFocus
                            className="flex-1 w-full border-2 border-[#5b8a9b] rounded-xl px-4 py-2.5 outline-none text-slate-700 font-medium"
                          />
                          <button onClick={() => saveDesig(dept.id)} className="bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-xl w-[46px] h-[46px] flex items-center justify-center shrink-0 shadow-sm">
                            <Check className="w-5 h-5 text-white" />
                          </button>
                          <button onClick={cancelDesigForm} className="w-[36px] h-[46px] flex items-center justify-center shrink-0 text-slate-600 hover:text-slate-900 transition-colors">
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="group bg-slate-50/70 text-slate-700 font-semibold px-5 py-3.5 rounded-xl text-[15px] border border-slate-100/80 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all flex items-center justify-between">
                          <span>{desig.name}</span>
                          <div className="hidden group-hover:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditDesig(dept.id, desig)}
                              className="text-[#26688A] hover:bg-[#26688A]/10 p-1.5 rounded-md transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteDesig(dept.id, desig.id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {addingDesigDeptId === dept.id && (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={desigFormName}
                        onChange={(e) => setDesigFormName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveDesig(dept.id)}
                        autoFocus
                        placeholder="New Designation"
                        className="flex-1 w-full border-2 border-[#5b8a9b] rounded-xl px-4 py-2.5 outline-none text-slate-700 font-medium bg-white"
                      />
                      <button onClick={() => saveDesig(dept.id)} className="bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-xl w-[46px] h-[46px] flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-5 h-5 text-white" />
                      </button>
                      <button onClick={cancelDesigForm} className="w-[36px] h-[46px] flex items-center justify-center shrink-0 text-slate-600 hover:text-slate-900 transition-colors">
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                </div>

                <div className="mt-auto pt-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (addingDesigDeptId !== dept.id) {
                        startAddDesig(dept.id);
                      }
                    }}
                    disabled={addingDesigDeptId === dept.id}
                    className="w-full border-2 border-dashed border-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-[16px] flex items-center justify-center gap-2 tracking-wide hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                    Add Designation
                  </button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-center gap-4 bg-white mt-auto">
                <button
                  onClick={() => openEditDeptModal(dept)}
                  className="flex-1 flex items-center justify-center gap-2 text-[#26688A] font-semibold py-2.5 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <div className="w-[1px] h-6 bg-slate-200"></div>
                <button
                  onClick={() => deleteDepartment(dept.id)}
                  className="flex-1 flex items-center justify-center gap-2 text-red-500 font-semibold py-2.5 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Global Footer Summary */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 ml-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 z-40 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgb(34,105,142)]/10 text-[#26688A] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-slate-500 font-medium text-[15px]">
              Showing <span className="text-slate-800 font-bold">{filteredDepartments.length}</span> of <span className="text-slate-800 font-bold">{departments.length}</span> departments
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e8e4dc] text-[#a09482] flex items-center justify-center">
              <Briefcase className="w-4 h-4 ring-1 ring-black/5 rounded" />
            </div>
            <div className="text-slate-500 font-medium text-[15px]">
              <span className="text-slate-800 font-bold">{totalDesignationsCount}</span> total designations
            </div>
          </div>
        </div>
      </div>

      {/* Department Modal */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-8 relative">
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-3 mt-1">
                <div className="w-14 h-14 bg-[#26688A] rounded-[18px] flex items-center justify-center text-white shadow-md">
                  <Building2 className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {editingDept ? 'Edit Department' : 'New Department'}
                </h2>
              </div>
              <p className="text-slate-500 font-medium text-[15px] mb-8">
                {editingDept ? 'Update the department information below.' : 'Enter the new department details below.'}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-[15px] font-bold text-slate-800 mb-2">Department Code *</label>
                  <input
                    type="text"
                    value={deptForm.code}
                    onChange={e => setDeptForm({ ...deptForm, code: e.target.value })}
                    className="w-full border-2 border-[#5b8a9b] rounded-[16px] px-5 py-4 outline-none text-slate-800 font-bold bg-white focus:ring-4 focus:ring-[#5b8a9b]/10 transition-all text-[15px]"
                    placeholder="e.g. DEPT001"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-slate-800 mb-2">Department Name *</label>
                  <input
                    type="text"
                    value={deptForm.name}
                    onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[16px] px-5 py-4 outline-none focus:border-[#5b8a9b] focus:bg-white text-slate-800 font-medium transition-all text-[15px]"
                    placeholder="e.g. Management"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 mt-2">
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="px-7 py-3.5 rounded-[14px] border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 shadow-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveDepartment}
                disabled={!deptForm.name.trim() || !deptForm.code.trim()}
                className="px-7 py-3.5 rounded-[14px] bg-[#26688A] hover:bg-[#1f5673] text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                {editingDept ? 'Update Department' : 'Save Department'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
