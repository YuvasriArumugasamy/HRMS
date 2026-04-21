import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImmigrationProfiles } from '@/modules/immigration/immigrationSlice';
import type { AppDispatch, RootState } from '@/app/store';
import { SlidersHorizontal, ChevronDown, ChevronUp, Clock, Search, CheckCircle, AlertTriangle, MapPin, Eye, FileText, Check, X, Loader2, Plus } from 'lucide-react';
import './ImmigrationProfiles.css';

// Hardcoded profiles removed as they are now fetched from the API

export const ImmigrationProfiles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { immigrationProfiles, isLoading, error } = useSelector((state: RootState) => state.immigration);
  
  const [showFilters, setShowFilters] = useState(true);
  const [compliance, setCompliance] = useState('All');
  const [department, setDepartment] = useState('All');
  const [nationality, setNationality] = useState('All');
  const [quickFilter, setQuickFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchImmigrationProfiles({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Transform API data to local UI structure
  const initialProfiles = (immigrationProfiles || []).map((p: any) => {
    const permitExpiryDate = p.smsData?.residentPermitExpiry ? new Date(p.smsData.residentPermitExpiry) : null;
    let expiryStatus = null;
    if (permitExpiryDate) {
      const diffTime = permitExpiryDate.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) expiryStatus = 'Expired';
      else if (diffDays < 90) expiryStatus = `${diffDays} days left`;
    }

    return {
      id: p._id,
      code: p.empCode,
      name: p.employeeName || 'Unknown Employee', // Needs to be confirmed if backend returns name
      initials: (p.employeeName || 'U E').split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
      avatarColor: 'bg-[#1e3a5f]',
      nationality: p.smsData?.nationality || 'N/A',
      niNumber: p.smsData?.niNumber || 'N/A',
      passport: p.smsData?.passportNumber || 'N/A',
      permitExpiry: permitExpiryDate ? permitExpiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
      expiryStatus,
      jobTitle: p.jobTitle || 'N/A',
      isKey: p.isKeyWorker || false,
      department: p.department || 'General',
      dataIssues: { 
        text: p.conflictStatus === 'RESOLVED' ? 'No issues' : 'Manual verification', 
        type: p.conflictStatus === 'RESOLVED' ? 'success' : 'warning' 
      },
      status: { 
        text: p.conflictStatus === 'RESOLVED' ? 'Clear' : 'Warning', 
        type: p.conflictStatus === 'RESOLVED' ? 'success' : 'warning' 
      },
    };
  });

  const compOptions = ['All', 'Clear', 'Warning', 'Critical'];
  const deptOptions = ['All', 'Care Staff', 'Nurses', 'Admin'];
  const natOptions = ['All', 'British', 'Filipino', 'Polish', 'Indian'];

  const getActiveFilterCount = () => {
    let count = 0;
    if (compliance !== 'All') count++;
    if (department !== 'All') count++;
    if (nationality !== 'All') count++;
    if (quickFilter) count++;
    return count;
  };

  const clearAllFilters = () => {
    setCompliance('All');
    setDepartment('All');
    setNationality('All');
    setQuickFilter(false);
  };

  const filteredProfiles = initialProfiles.filter(profile => {
    if (compliance !== 'All' && profile.status.text !== compliance) return false;
    if (department !== 'All' && profile.department !== department) return false;
    if (nationality !== 'All' && profile.nationality !== nationality) return false;
    if (quickFilter && !profile.expiryStatus?.includes('days left')) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!profile.name.toLowerCase().includes(q) && 
          !profile.code.toLowerCase().includes(q) && 
          !profile.niNumber.toLowerCase().includes(q) && 
          !profile.passport.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const renderFilterButton = (currentValue: string, option: string, setter: (val: string) => void, activeColor: string) => {
    const isActive = currentValue === option;
    if (isActive) {
      return (
        <button 
          key={option} 
          onClick={() => setter(option)} 
          className={`flex items-center space-x-1.5 text-white px-4 py-1.5 rounded-full text-[13px] font-semibold shadow-md transition-all transform active:scale-95 ${activeColor}`}
        >
          <span>{option}</span>
          <Check size={14} strokeWidth={3} />
        </button>
      );
    }
    return (
      <button 
        key={option} 
        onClick={() => setter(option)} 
        className="bg-[#f4f6f8] text-gray-600 px-4 py-1.5 rounded-full text-[13px] font-semibold hover:bg-gray-200 transition-all transform active:scale-95"
      >
        {option}
      </button>
    );
  };

  const navigate = useNavigate();

  const clearCount = filteredProfiles.filter(p => p.status.text === 'Clear').length;
  const issuesCount = filteredProfiles.filter(p => p.status.text !== 'Clear').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#fafbfc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="profiles-header">
          <h1 className="text-2xl font-bold text-[#001f3f]">Immigration Profiles</h1>
          <p className="text-gray-500 mt-1 text-[15px]">Complete immigration employee records with compliance tracking</p>
        </div>
        <button 
          onClick={() => navigate('/immigration-sms-data-entry')}
          className="flex items-center space-x-2 bg-[#1b6b8f] text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-[#13506b] transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Add SMS Data</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] space-y-6 transition-all duration-300">
        <div className="flex items-center space-x-6">
          <div 
            className="flex items-center text-[#1e7498] font-bold text-[15px] space-x-2 cursor-pointer w-fit hover:text-[#13506b] transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-[#1b6b8f] text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
                {getActiveFilterCount()}
              </span>
            )}
            {showFilters ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>
          
          {getActiveFilterCount() > 0 && (
            <button 
              onClick={clearAllFilters}
              className="flex items-center text-red-500 font-bold text-[14px] hover:text-red-600 transition-colors space-x-1"
            >
              <X size={16} strokeWidth={3} />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col md:flex-row gap-x-12 gap-y-6">
              {/* Compliance Status & Department Column */}
              <div className="space-y-6 flex-1">
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">COMPLIANCE STATUS</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {compOptions.map(opt => renderFilterButton(compliance, opt, setCompliance, 'bg-[#1b6b8f]'))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">DEPARTMENT</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {deptOptions.map(opt => renderFilterButton(department, opt, setDepartment, 'bg-[#a327ff]'))}
                  </div>
                </div>
              </div>

              {/* Nationality Column */}
              <div className="space-y-6 flex-1">
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">NATIONALITY</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {natOptions.map(opt => renderFilterButton(nationality, opt, setNationality, 'bg-[#1da1f2]'))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="space-y-3 pt-6 mt-6 border-t border-gray-50">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">QUICK FILTERS</h3>
              <button 
                onClick={() => setQuickFilter(!quickFilter)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-full text-[13px] font-semibold transition-all transform active:scale-95 w-fit ${
                  quickFilter ? 'bg-orange-500 text-white shadow-md' : 'bg-[#f4f6f8] text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Clock size={16} />
                <span>Visa Expiring Soon (90 days)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search and Summary */}
      <div className="flex flex-col md:flex-row gap-5 items-stretch">
        <div className="flex-grow bg-white border border-gray-200 rounded-2xl flex items-center px-5 shadow-sm focus-within:ring-2 focus-within:ring-[#1b6b8f]/20 transition-shadow">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, code, NI number, or passport..." 
            className="w-full py-4 px-4 outline-none text-gray-700 placeholder-gray-400 text-[15px]"
          />
        </div>

        <div className="flex gap-4">
          <div className="summary-card-green bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl px-6 py-3 flex items-center shadow-sm space-x-5 min-w-[150px] transition-all duration-300">
            <div>
              <p className="text-[#16a34a] text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Clear Status</p>
              <p className="text-[#16a34a] text-2xl font-black leading-none">{clearCount}</p>
            </div>
            <div className="bg-[#10b981] text-white p-2.5 rounded-[14px] shadow-sm ml-auto">
              <CheckCircle size={24} strokeWidth={2.5} />
            </div>
          </div>

          <div className="summary-card-orange bg-[#fffbeb] border border-[#fef3c7] rounded-2xl px-6 py-3 flex items-center shadow-sm space-x-6 min-w-[150px] transition-all duration-300">
            <div>
              <p className="text-[#d97706] text-[10px] font-extrabold uppercase tracking-wider mb-0.5">Issues Found</p>
              <p className="text-[#d97706] text-2xl font-black leading-none">{issuesCount}</p>
            </div>
            <div className="bg-[#f59e0b] text-white p-2.5 rounded-[14px] shadow-sm ml-auto">
              <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Strip */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <span className="text-[14px] font-semibold text-[#001f3f] mr-1">Active filters:</span>
          {compliance !== 'All' && (
            <div className="flex items-center space-x-1.5 bg-[#edf4f8] border border-[#c0dceb] text-[#02628a] px-3 py-1 rounded-[6px] text-[13px] font-semibold shadow-sm">
              <span>Status: {compliance}</span>
              <button onClick={() => setCompliance('All')} className="hover:text-red-500 transition-colors flex items-center justify-center">
                <X size={13} strokeWidth={3} />
              </button>
            </div>
          )}
          {department !== 'All' && (
            <div className="flex items-center space-x-1.5 bg-[#edf4f8] border border-[#c0dceb] text-[#02628a] px-3 py-1 rounded-[6px] text-[13px] font-semibold shadow-sm">
              <span>Dept: {department}</span>
              <button onClick={() => setDepartment('All')} className="hover:text-red-500 transition-colors flex items-center justify-center">
                <X size={13} strokeWidth={3} />
              </button>
            </div>
          )}
          {nationality !== 'All' && (
            <div className="flex items-center space-x-1.5 bg-[#edf4f8] border border-[#c0dceb] text-[#02628a] px-3 py-1 rounded-[6px] text-[13px] font-semibold shadow-sm">
              <span>Nationality: {nationality}</span>
              <button onClick={() => setNationality('All')} className="hover:text-red-500 transition-colors flex items-center justify-center">
                <X size={13} strokeWidth={3} />
              </button>
            </div>
          )}
          {quickFilter && (
            <div className="flex items-center space-x-1.5 bg-[#edf4f8] border border-[#c0dceb] text-[#02628a] px-3 py-1 rounded-[6px] text-[13px] font-semibold shadow-sm">
              <span>Expiring Soon</span>
              <button onClick={() => setQuickFilter(false)} className="hover:text-red-500 transition-colors flex items-center justify-center">
                <X size={13} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table Section */}
      <div className="profiles-table-container bg-white rounded-t-xl rounded-b-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#246e8c]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-[13px] font-bold text-white tracking-wide">Code</th>
                <th scope="col" className="px-6 py-4 text-left text-[13px] font-bold text-white tracking-wide">Employee</th>
                <th scope="col" className="px-6 py-4 text-left text-[13px] font-bold text-white tracking-wide">NI Number</th>
                <th scope="col" className="px-6 py-4 text-left text-[13px] font-bold text-white tracking-wide">Passport</th>
                <th scope="col" className="px-6 py-4 text-left text-[13px] font-bold text-white tracking-wide">Permit Expiry</th>
                <th scope="col" className="px-6 py-4 text-left text-[13px] font-bold text-white tracking-wide">Job Title</th>
                <th scope="col" className="px-6 py-4 text-left text-[13px] font-bold text-white tracking-wide">Data Issues</th>
                <th scope="col" className="px-6 py-4 text-left text-[13px] font-bold text-white tracking-wide">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-[13px] font-bold text-white tracking-wide pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading && !initialProfiles.length ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-gray-500">
                    <Loader2 size={32} className="mx-auto animate-spin mb-3" color="#1e3a5f" />
                    <p className="font-semibold">Loading profiles...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-red-500">
                    <AlertTriangle size={32} className="mx-auto mb-3" />
                    <p className="font-semibold">{error}</p>
                    <button onClick={() => dispatch(fetchImmigrationProfiles({ page: 1, limit: 100 }))} className="mt-2 text-sm underline font-bold">Retry</button>
                  </td>
                </tr>
              ) : filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile, idx) => (
                  <tr 
                    key={idx} 
                    className="profile-row-item profile-row-hover hover:bg-gray-50 transition-colors"
                    style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
                  >
                    {/* Code */}
                    <td className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[#1e7498]">{profile.code}</td>
                    
                    {/* Employee */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`profile-avatar-anim w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[13px] shadow-sm ${profile.avatarColor}`}>
                          {profile.initials}
                        </div>
                        <div>
                          <Link to={`/employees/${profile.id}`} className="text-[14px] font-bold text-[#5542f6] hover:underline cursor-pointer">{profile.name}</Link>
                          <div className="flex items-center text-[12px] text-gray-500 mt-0.5 font-medium">
                            <MapPin size={12} className="mr-1 opacity-70" />
                            {profile.nationality}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* NI Number */}
                    <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-600 font-medium">{profile.niNumber}</td>
                    
                    {/* Passport */}
                    <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-600 font-medium">{profile.passport}</td>
                    
                    {/* Permit Expiry */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[14px] text-gray-900 font-medium">{profile.permitExpiry}</div>
                      {profile.expiryStatus && (
                        <div className={`mt-1.5 inline-flex px-2 py-0.5 rounded-[4px] text-[11px] font-bold border ${
                          profile.expiryStatus === 'Expired' ? 'bg-[#ffebec] text-[#d32f2f] border-[#ffcdd2]' : 'bg-[#fff4e5] text-[#d84315] border-[#ffccbc]'
                        }`}>
                          {profile.expiryStatus}
                        </div>
                      )}
                    </td>
                    
                    {/* Job Title */}
                    <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{profile.jobTitle}</span>
                        {profile.isKey && (
                          <span className="inline-flex px-2 py-0.5 bg-[#e3f2fd] text-[#1976d2] border border-[#bbdefb] rounded-[6px] text-[11px] font-bold uppercase tracking-wide">
                            Key
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Data Issues */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-[8px] text-[12px] font-bold ${
                        profile.dataIssues.type === 'success' ? 'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]' :
                        profile.dataIssues.type === 'warning' ? 'bg-[#fff8e1] text-[#f57f17] border border-[#ffecb3]' :
                        'bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]'
                      }`}>
                        {profile.dataIssues.text}
                      </span>
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-[8px] text-[12px] font-bold ${
                        profile.status.type === 'success' ? 'bg-white text-[#2e7d32] border border-[#a5d6a7]' :
                        profile.status.type === 'warning' ? 'bg-[#fff8e1] text-[#f57f17] border border-[#ffecb3]' :
                        'bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]'
                      }`}>
                        {profile.status.text}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link to={`/employees/${profile.id}`} className="inline-flex items-center space-x-1.5 text-[#1e7498] hover:text-[#13506b] font-bold text-[13px] px-2 transition-colors">
                        <Eye size={16} strokeWidth={2.5} />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-gray-500 bg-gray-50">
                    <p className="text-[16px] font-bold text-gray-700">No profiles found</p>
                    <p className="mt-1 text-[14px]">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-[#fafbfc] border-t border-gray-200 px-6 py-4 flex items-center text-[13px] text-gray-500 font-medium">
          <FileText size={16} className="mr-2 text-gray-400" />
          Showing <span className="font-bold text-gray-700 mx-1">{filteredProfiles.length}</span> of <span className="font-bold text-gray-700 mx-1">{initialProfiles.length}</span> immigration profiles
        </div>
      </div>
    </div>
  );
};
