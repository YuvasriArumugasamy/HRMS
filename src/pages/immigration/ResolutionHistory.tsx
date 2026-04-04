import React from 'react';
import './ResolutionHistory.css';
import { 
  History, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock3, 
  Users, 
  Search,
} from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import RHFSearchableSelect from '../../components/form/RHFSearchableSelect';

const ResolutionHistory: React.FC = () => {
  const methods = useForm({
    defaultValues: {
      search: '',
      category: 'all',
      severity: 'all',
      timeframe: 'all'
    }
  });

  const stats = [
    { label: 'Total', value: '12', icon: <CheckCircle2 size={24} color="#3b82f6" />, bg: '#eff6ff', iconBg: '#dbeafe' },
    { label: 'Critical', value: '6', icon: <AlertCircle size={24} color="#ef4444" />, bg: '#fef2f2', iconBg: '#fee2e2' },
    { label: 'This Week', value: '10', icon: <Clock3 size={24} color="#10b981" />, bg: '#ecfdf5', iconBg: '#d1fae5' },
    { label: 'Employees', value: '5', icon: <Users size={24} color="#3b82f6" />, bg: '#eff6ff', iconBg: '#dbeafe' }
  ];

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Passport', value: 'passport' },
    { label: 'Visa', value: 'visa' },
    { label: 'Address', value: 'address' }
  ];

  const severities = [
    { label: 'All Severity', value: 'all' },
    { label: 'Critical', value: 'critical' },
    { label: 'Warning', value: 'warning' }
  ];

  const timeframes = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' }
  ];

  const historyData = [
    { id: 1, employee: 'Jessica Martinez', field: 'Passport Expiry', oldVal: '2024-03-01', newVal: '2025-03-01', date: '2024-03-20', severity: 'Critical' },
    { id: 2, employee: 'Michael Chen', field: 'Address line 1', oldVal: '123 Old St', newVal: '456 New Ave', date: '2024-03-19', severity: 'Warning' },
    { id: 3, employee: 'Sarah Johnson', field: 'Visa Category', oldVal: 'Tier 2', newVal: 'Skilled Worker', date: '2024-03-18', severity: 'Info' },
    { id: 4, employee: 'David Kim', field: 'Date of Birth', oldVal: '1990-05-15', newVal: '1990-05-16', date: '2024-03-15', severity: 'Critical' }
  ];

  return (
    <div className="rh-page">
      {/* Header Section */}
      <div className="rh-header">
        <div className="rh-header-left">
          <div className="rh-header-icon">
            <History size={28} color="#0a3d5c" />
          </div>
          <div>
            <h1 className="rh-header-title">Resolution History</h1>
            <p className="rh-header-subtitle">Complete audit trail of resolved changes</p>
          </div>
        </div>
        <button className="rh-btn-export">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="rh-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="rh-stat-card">
            <div className="rh-stat-content">
              <div className="rh-stat-info">
                <p className="rh-stat-label">{stat.label}</p>
                <h2 className="rh-stat-value">{stat.value}</h2>
              </div>
              <div className="rh-stat-icon-wrapper" style={{ backgroundColor: stat.iconBg }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar Section */}
      <FormProvider {...methods}>
        <div className="rh-toolbar">
          <div className="rh-search-box">
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              placeholder="Search employees, documents..." 
              className="rh-search-input"
            />
          </div>
          <div className="rh-filters">
            <div className="rh-filter-item">
              <RHFSearchableSelect 
                name="category"
                options={categories}
              />
            </div>
            <div className="rh-filter-item">
              <RHFSearchableSelect 
                name="severity"
                options={severities}
              />
            </div>
            <div className="rh-filter-item">
              <RHFSearchableSelect 
                name="timeframe"
                options={timeframes}
              />
            </div>
          </div>
        </div>
      </FormProvider>

      {/* Main Content Area */}
      <div className="rh-content-container">
        {historyData.length > 0 ? (
          <div className="rh-history-list">
            <div className="rh-list-header">
              <span>Employee & Field</span>
              <span>Resolved Change</span>
              <span>Resolution Date</span>
            </div>
            {historyData.map((item) => (
              <div key={item.id} className="rh-history-item">
                <div className="rh-item-info">
                  <div className="rh-item-avatar">{item.employee.charAt(0)}</div>
                  <div>
                    <p className="rh-item-name">{item.employee}</p>
                    <p className="rh-item-field">{item.field}</p>
                  </div>
                </div>
                <div className="rh-item-change">
                  <span className="rh-old-val">{item.oldVal}</span>
                  <History size={14} className="rh-arrow-icon" />
                  <span className="rh-new-val">{item.newVal}</span>
                </div>
                <div className="rh-item-date-row">
                  <span className="rh-item-date">{item.date}</span>
                  <span className={`rh-tag rh-tag--${item.severity.toLowerCase()}`}>
                    {item.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rh-empty-state">
            <p>No historical records found for the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolutionHistory;
