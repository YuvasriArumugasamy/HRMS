import { useState, useEffect } from 'react';
import { Upload, FileDown, RefreshCw, Search, AlertTriangle, Clock, Users, Check, X, Shield, Loader2 } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplianceConflicts, resolveConflict } from '@/modules/immigration/immigrationSlice';
import type { AppDispatch, RootState } from '@/app/store';
import RHFSearchableSelect from '@/components/form/RHFSearchableSelect';
import RHFDatePicker from '@/components/form/RHFDatePicker';
import './ImmigrationCompliance.css';

interface ComplianceIssue {
  field: string;
  severity: 'Critical' | 'Warning';
  smsValue: string;
  hrmsValue: string;
  lastChecked: string;
}

interface EmployeeCompliance {
  id: number;
  name: string;
  initials: string;
  avatarBg: string;
  niNumber: string;
  overallSeverity: 'Critical' | 'Warning';
  issues: ComplianceIssue[];
}

// Hardcoded data removed as it's now fetched from API

const filterOptions = ['All Status', 'Critical Only', 'Warning Only'];

export const ImmigrationCompliance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { complianceConflicts, isLoading, error } = useSelector((state: RootState) => state.immigration);
  const [searchQuery, setSearchQuery] = useState('');
  
  const methods = useForm({
    defaultValues: {
      filterValue: 'All Status',
      resolutionDate: new Date()
    }
  });

  const { watch } = methods;
  const filterValue = watch('filterValue');

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | string | null>(null);
  const [resolveModal, setResolveModal] = useState<{ employee: EmployeeCompliance; issue: ComplianceIssue } | null>(null);
  const [selectedSource, setSelectedSource] = useState<'sms' | 'hrms'>('sms');

  useEffect(() => {
    dispatch(fetchComplianceConflicts({ pagination: false }));
  }, [dispatch]);

  // Transform API data to internal format
  const employeeData: EmployeeCompliance[] = (complianceConflicts || []).map((conflict: any, index: number) => {
    const issues: ComplianceIssue[] = Object.keys(conflict.differences).map(field => ({
      field,
      severity: 'Critical', // Default to Critical or derive from field if possible
      smsValue: String(conflict.differences[field].ashtonCentral),
      hrmsValue: String(conflict.differences[field].hrmsUat),
      lastChecked: new Date().toLocaleDateString()
    }));

    return {
      id: conflict.empCode || index, // Use empCode as ID if possible
      name: conflict.name,
      initials: conflict.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
      avatarBg: '#1e3a5f',
      niNumber: conflict.empCode,
      overallSeverity: 'Critical',
      issues
    };
  });

  // Stats
  const allIssues = employeeData.flatMap(e => e.issues);
  const criticalCount = allIssues.filter(i => i.severity === 'Critical').length;
  const warningCount = allIssues.filter(i => i.severity === 'Warning').length;
  const affectedCount = employeeData.length;

  // Filter employees AND their individual issues
  const searchedEmployees = employeeData.filter(emp => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return emp.name.toLowerCase().includes(q) ||
      emp.niNumber.toLowerCase().includes(q) ||
      emp.issues.some(i =>
        i.field.toLowerCase().includes(q) ||
        i.smsValue.toLowerCase().includes(q) ||
        i.hrmsValue.toLowerCase().includes(q)
      );
  });

  const filteredEmployees = searchedEmployees
    .map(emp => {
      let filteredIssues = emp.issues;
      if (filterValue === 'Critical Only') {
        filteredIssues = emp.issues.filter(i => i.severity === 'Critical');
      } else if (filterValue === 'Warning Only') {
        filteredIssues = emp.issues.filter(i => i.severity === 'Warning');
      }
      return { ...emp, issues: filteredIssues };
    })
    .filter(emp => emp.issues.length > 0);

  const handleResolve = (employee: EmployeeCompliance, issue: ComplianceIssue) => {
    setResolveModal({ employee, issue });
    setSelectedSource('sms');
  };

  return (
    <div className="ic-page">
      <FormProvider {...methods}>
        {/* ========== HEADER ========== */}
        <div className="ic-header">
          <div className="ic-header-left">
            <div className="ic-header-icon">
              <Shield size={24} color="#dc2626" />
            </div>
            <div>
              <h1 className="ic-header-title">Immigration<br />Compliance</h1>
              <p className="ic-header-subtitle">Data discrepancies between SMS and HRMS systems</p>
            </div>
          </div>
          <div className="ic-header-actions">
            <button className="ic-btn-outline">
              <Upload size={15} /> Import
            </button>
            <button className="ic-btn-outline">
              <FileDown size={15} /> Export
            </button>
            <button className="ic-btn-sync" onClick={() => dispatch(fetchComplianceConflicts({ pagination: false }))} disabled={isLoading}>
              {isLoading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} className="ic-sync-icon" />} Sync Data
            </button>
          </div>
        </div>

        {/* ========== STAT CARDS ========== */}
        <div className="ic-stats-grid">
          <div className="ic-stat-card ic-stat-card--critical">
            <div className="ic-stat-icon ic-stat-icon--critical">
              <AlertTriangle size={18} color="#ef4444" />
            </div>
            <p className="ic-stat-label">Critical Issues</p>
            <p className="ic-stat-value ic-stat-value--critical">{criticalCount}</p>
          </div>

          <div className="ic-stat-card ic-stat-card--warning">
            <div className="ic-stat-icon ic-stat-icon--warning">
              <Clock size={18} color="#f59e0b" />
            </div>
            <p className="ic-stat-label">Warnings</p>
            <p className="ic-stat-value ic-stat-value--warning">{warningCount}</p>
          </div>

          <div className="ic-stat-card ic-stat-card--info">
            <div className="ic-stat-icon ic-stat-icon--info">
              <Users size={18} color="#3b82f6" />
            </div>
            <p className="ic-stat-label">Affected Employees</p>
            <p className="ic-stat-value ic-stat-value--info">{affectedCount}</p>
          </div>
        </div>

        {/* ========== SEARCH & FILTER ========== */}
        <div className="ic-toolbar">
          <div className="ic-search-box">
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees, codes, or fields..."
              className="ic-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="ic-search-clear">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="ic-filter-wrapper-rhf">
            <RHFSearchableSelect
              name="filterValue"
              placeholder="Filter by status"
              options={filterOptions.map(opt => ({ label: opt, value: opt }))}
              className="ic-rhf-select"
              searchable={true}
            />
          </div>
        </div>

        {/* ========== COMPLIANCE ISSUES ========== */}
        <div className="ic-issues-container">
          {isLoading && !employeeData.length ? (
            <div className="ic-loading-state">
              <Loader2 size={32} className="animate-spin" color="#1e3a5f" />
              <p>Fetching compliance data...</p>
            </div>
          ) : error ? (
            <div className="ic-error-state">
              <AlertTriangle size={32} color="#dc2626" />
              <p>{error}</p>
              <button onClick={() => dispatch(fetchComplianceConflicts({ pagination: false }))} className="ic-retry-btn">Retry</button>
            </div>
          ) : (
            <>
              {/* Section Header */}
              <div className="ic-issues-header">
                <h2 className="ic-issues-title">Compliance Issues</h2>
                <span className="ic-employees-badge">
                  {filteredEmployees.length} Employees
                </span>
              </div>

              {/* Employee Cards */}
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className={`ic-employee-card ${selectedEmployeeId === employee.id ? 'ic-employee-card--selected' : ''}`}
                  onClick={() => setSelectedEmployeeId(employee.id)}
                >
              {/* Employee Header */}
              <div className={`ic-employee-header ic-employee-header--${employee.overallSeverity.toLowerCase()}`}>
                <div className="ic-employee-info">
                  <div className="ic-avatar" style={{ backgroundColor: employee.avatarBg }}>
                    {employee.initials}
                  </div>
                  <div>
                    <h3 className="ic-employee-name">{employee.name}</h3>
                    <div className="ic-employee-meta">
                      <span className="ic-ni-badge">{employee.niNumber}</span>
                      <span className="ic-issue-count">• {employee.issues.length} issue{employee.issues.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <span className={`ic-severity-badge ic-severity-badge--${employee.overallSeverity.toLowerCase()}`}>
                  {employee.overallSeverity}
                </span>
              </div>

              {/* Issues List */}
              <div className="ic-issues-list">
                {employee.issues.map((issue, issueIdx) => (
                  <div key={issueIdx} className="ic-issue-card">
                    {/* Issue Title */}
                    <div className="ic-issue-title-row">
                      <div className="ic-title-left">
                        <span className={`ic-severity-dot ic-severity-dot--${issue.severity.toLowerCase()}`} />
                        <span className="ic-issue-field-name">{issue.field}</span>
                        <span className={`ic-issue-severity-tag ic-issue-severity-tag--${issue.severity.toLowerCase()}`}>
                          {issue.severity}
                        </span>
                      </div>
                    </div>

                    {/* SMS vs HRMS */}
                    <div className="ic-comparison-grid">
                      <div className="ic-comparison-box ic-comparison-box--sms">
                        <p className="ic-comparison-label ic-comparison-label--sms">SMS System</p>
                        <p className="ic-comparison-value ic-comparison-value--sms">{issue.smsValue}</p>
                      </div>
                      <div className="ic-comparison-box ic-comparison-box--hrms">
                        <p className="ic-comparison-label ic-comparison-label--hrms">HRMS System</p>
                        <p className="ic-comparison-value ic-comparison-value--hrms">{issue.hrmsValue}</p>
                      </div>
                    </div>


                    {/* Footer */}
                    <div className="ic-issue-footer">
                      <span className="ic-last-checked">
                        Last checked: {issue.lastChecked}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleResolve(employee, issue); }}
                        className="ic-resolve-btn"
                      >
                        <Check size={14} strokeWidth={3} /> Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

              {/* Empty State */}
              {!isLoading && filteredEmployees.length === 0 && (
                <div className="ic-empty">
                  <div className="ic-empty-icon">
                    <Search size={24} color="#9ca3af" />
                  </div>
                  <p className="ic-empty-title">No compliance issues found</p>
                  <p className="ic-empty-subtitle">Try adjusting your search or filters.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ========== RESOLVE MODAL ========== */}
        {resolveModal && (
          <div className="ic-modal-overlay">
            <div className="ic-modal-backdrop" onClick={() => setResolveModal(null)} />

            <div className="ic-modal-card">
              <button onClick={() => setResolveModal(null)} className="ic-modal-close">
                <X size={18} />
              </button>

              <div className="ic-modal-body">
                <h2 className="ic-modal-title">Resolve Compliance Issue</h2>
                <p className="ic-modal-subtitle">
                  Choose which system's value to apply for {resolveModal.employee.name}
                </p>

                {/* Employee Info */}
                <div className="ic-modal-employee-info">
                  <div className="ic-modal-avatar" style={{ backgroundColor: resolveModal.employee.avatarBg }}>
                    {resolveModal.employee.initials}
                  </div>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{resolveModal.employee.name}</span>
                    <span className="ic-ni-badge" style={{ marginLeft: 8 }}>{resolveModal.employee.niNumber}</span>
                  </div>
                </div>

                <p className="ic-modal-field-label">
                  Field: <span className="ic-modal-field-value">{resolveModal.issue.field}</span>
                </p>

                {/* Select Value */}
                <h3 className="ic-select-heading">Select Correct Value</h3>
                <div className="ic-value-options">
                  <button
                    onClick={() => setSelectedSource('sms')}
                    className={`ic-value-option ${selectedSource === 'sms' ? 'ic-value-option--selected' : ''}`}
                  >
                    <div>
                      <p className="ic-value-source">SMS System Value</p>
                      <p className="ic-value-display">{resolveModal.issue.smsValue}</p>
                    </div>
                    {selectedSource === 'sms' && (
                      <div className="ic-check-circle">
                        <Check size={14} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedSource('hrms')}
                    className={`ic-value-option ${selectedSource === 'hrms' ? 'ic-value-option--selected' : ''}`}
                  >
                    <div>
                      <p className="ic-value-source">HRMS System Value</p>
                      <p className="ic-value-display">{resolveModal.issue.hrmsValue}</p>
                    </div>
                    {selectedSource === 'hrms' && (
                      <div className="ic-check-circle">
                        <Check size={14} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                </div>

                {/* Resolution Date */}
                <div style={{ marginTop: '24px', marginBottom: '10px' }}>
                  <RHFDatePicker
                    name="resolutionDate"
                    label="Resolution Date"
                    placeholder="Select resolution date"
                  />
                </div>

                {/* Actions */}
                <div className="ic-modal-actions">
                  <button onClick={() => setResolveModal(null)} className="ic-modal-cancel">
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (resolveModal) {
                        const value = selectedSource === 'sms' ? resolveModal.issue.smsValue : resolveModal.issue.hrmsValue;
                        dispatch(resolveConflict({ 
                          empCode: resolveModal.employee.niNumber, 
                          field: resolveModal.issue.field, 
                          value 
                        }));
                        setResolveModal(null);
                      }
                    }} 
                    className="ic-modal-confirm"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Check size={16} strokeWidth={3} className="mr-2" />} 
                    Confirm Resolution
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </FormProvider>
    </div>
  );
};
