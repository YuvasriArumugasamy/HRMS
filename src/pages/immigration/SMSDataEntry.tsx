import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, User, Briefcase, DollarSign, Calendar, ShieldCheck, Save, Loader2, Wand2 } from 'lucide-react';
import type { AppDispatch, RootState } from '@/app/store';
import { fetchImmigrationProfiles, saveSMSData } from '@/modules/immigration/immigrationSlice';
import RHFTextField from '@/components/form/RHFTextField';
import RHFSearchableSelect from '@/components/form/RHFSearchableSelect';
import RHFDatePicker from '@/components/form/RHFDatePicker';
import RHFCheckbox from '@/components/form/RHFCheckbox';
import './SMSDataEntry.css';

interface SMSFormData {
  employeeId: string;
  niNumber: string;
  passportNumber: string;
  contactNumber: string;
  email: string;
  visaExpiry: Date | null;
  address: string;
  workLocation: string;
  designation: string;
  hourlyRate: string;
  contractHours: string;
  deductions: boolean;
  dependents: boolean;
  ssp: boolean;
  smp: boolean;
  unpaidLeave: boolean;
}

export const SMSDataEntry = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { immigrationProfiles } = useSelector((state: RootState) => state.immigration);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SMSFormData>({
    defaultValues: {
      employeeId: '',
      niNumber: '',
      passportNumber: '',
      contactNumber: '',
      email: '',
      visaExpiry: null,
      address: '',
      workLocation: '',
      designation: '',
      hourlyRate: '',
      contractHours: '',
      deductions: false,
      dependents: false,
      ssp: false,
      smp: false,
      unpaidLeave: false,
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const selectedEmployeeId = watch('employeeId');

  useEffect(() => {
    if (immigrationProfiles.length === 0) {
      dispatch(fetchImmigrationProfiles({ page: 1, limit: 100 }));
    }
  }, [dispatch, immigrationProfiles.length]);

  // Update fields when employee is selected
  useEffect(() => {
    if (selectedEmployeeId) {
      // Find by employeeId instead of _id since we updated the selection value
      const selectedEmp = immigrationProfiles.find((emp: any) => emp.employeeId === selectedEmployeeId);
      if (selectedEmp) {
        // Pre-fill some data if available
        setValue('niNumber', selectedEmp.smsData?.niNumber || '');
        setValue('passportNumber', selectedEmp.smsData?.passportNumber || '');
        setValue('designation', selectedEmp.jobTitle || '');
        setValue('email', selectedEmp.smsData?.email || '');
      }
    }
  }, [selectedEmployeeId, immigrationProfiles, setValue]);

  const onSubmit = async (data: SMSFormData) => {
    setIsSubmitting(true);
    try {
      const { employeeId: profileId, ...smsData } = data;
      await dispatch(saveSMSData({ profileId, smsData })).unwrap();
      navigate('/immigration-profiles');
    } catch (error) {
      console.error('Failed to save SMS data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Mock employee list (fallback when API returns no data) ─────────────
  const MOCK_EMPLOYEE_OPTIONS = [
    { label: 'Priya Nair (EMP-2024-001)',              value: 'mock-emp-001' },
    { label: 'Maria Santos (EMP-2024-002)',             value: 'mock-emp-002' },
    { label: 'Dawit Bekele (EMP-2024-003)',             value: 'mock-emp-003' },
    { label: 'Aneta Kowalski (EMP-2024-004)',           value: 'mock-emp-004' },
    { label: 'James Osei (EMP-2024-005)',               value: 'mock-emp-005' },
  ];
  // ─────────────────────────────────────────────────────────────────────────

  // ─── Fill all fields with sample / test data ─────────────────────────────
  const fillSampleData = () => {
    if (immigrationProfiles.length > 0) {
      // Real API employee — pick first one
      const first = immigrationProfiles[0] as any;
      setValue('employeeId', first._id || first.employeeId);
    } else {
      // No real data — pick first mock employee
      setValue('employeeId', 'mock-emp-001');
    }
    setValue('niNumber',        'AB123456C');
    setValue('passportNumber',  'GB0123456');
    setValue('contactNumber',   '07712 345678');
    setValue('email',           'priya.nair@ashtoncare.com');
    setValue('visaExpiry',      new Date('2025-12-31'));
    setValue('address',         '42 Maple Street, Manchester, M1 2AB');
    setValue('workLocation',    'Manchester HQ');
    setValue('designation',     'Care Assistant');
    setValue('hourlyRate',      '12.50');
    setValue('contractHours',   '37.5');
    setValue('deductions',      true);
    setValue('dependents',      false);
    setValue('ssp',             true);
    setValue('smp',             false);
    setValue('unpaidLeave',     false);
  };
  // ─────────────────────────────────────────────────────────────────────────

  // Build dropdown options — use empCode as label fallback (API has no employeeName)
  const realEmployeeOptions = immigrationProfiles.map((emp: any) => ({
    label: emp.employeeName
      ? `${emp.employeeName} (${emp.empCode})`
      : emp.empCode || emp._id,
    value: emp._id || emp.employeeId,
  }));

  // Show real employees if available, otherwise show mock list
  const employeeOptions = realEmployeeOptions.length > 0
    ? realEmployeeOptions
    : MOCK_EMPLOYEE_OPTIONS;

  return (
    <div className="sms-entry-page p-8 max-w-5xl mx-auto space-y-8 bg-[#fafbfc] min-h-screen">
      {/* breadcrumb override or back link */}
      <Link 
        to="/immigration-profiles" 
        className="inline-flex items-center text-[#1b6b8f] font-bold text-sm bg-transparent hover:bg-blue-50 px-3 py-2 rounded-xl transition-all duration-200 mb-2 -ml-3"
      >
        <ChevronLeft size={18} className="mr-1" />
        Back to Immigration Profiles
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="sms-entry-header">
          <h1 className="text-3xl font-extrabold text-[#001f3f]">SMS Data Entry</h1>
          <p className="text-gray-500 mt-1 text-[15px]">Enter immigration employee data for SMS system synchronization</p>
        </div>
        {/* Fill sample data button — for testing / demo purposes */}
        <button
          type="button"
          onClick={fillSampleData}
          className="flex items-center space-x-2 bg-amber-50 border border-amber-300 text-amber-700 px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-amber-100 transition-all transform active:scale-95 shadow-sm whitespace-nowrap"
        >
          <Wand2 size={16} />
          <span>Fill Sample Data</span>
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Section 1: Select Employee */}
          <div className="sms-section-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="sms-section-header bg-[#3b82f6] px-6 py-3 flex items-center space-x-2">
              <User size={18} className="text-white" />
              <h2 className="text-white font-bold tracking-wide">Select Employee</h2>
            </div>
            <div className="p-8">
              <div className="max-w-md">
                <RHFSearchableSelect
                  name="employeeId"
                  label="Employee"
                  placeholder="Select an employee..."
                  options={employeeOptions}
                  required
                  searchable
                  type="employee"
                  rules={{ required: "Please select an employee" }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Contact Information */}
          <div className="sms-section-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="sms-section-header bg-[#1e7498] px-6 py-3 flex items-center space-x-2">
              <ShieldCheck size={18} className="text-white" />
              <h2 className="text-white font-bold tracking-wide">Personal & Contact Information</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1">
                <RHFTextField 
                  name="niNumber" 
                  label="NI Number" 
                  placeholder="e.g., AB123456C" 
                  required 
                  rules={{ required: "NI Number is required" }}
                />
                {!selectedEmployeeId && (
                  <p className="text-[12px] font-bold text-orange-500 ml-1">Please select an employee first</p>
                )}
              </div>
              <div className="space-y-1">
                <RHFTextField 
                  name="passportNumber" 
                  label="Passport Number" 
                  placeholder="e.g., GB0123456" 
                  required 
                  rules={{ required: "Passport Number is required" }}
                />
                {!selectedEmployeeId && (
                  <p className="text-[12px] font-bold text-orange-500 ml-1">Please select an employee first</p>
                )}
              </div>
              <RHFTextField 
                name="contactNumber" 
                label="Contact Number" 
                placeholder="---" 
                required 
                rules={{ required: "Contact Number is required" }}
              />
              <RHFTextField 
                name="email" 
                label="Email Address" 
                placeholder="e.g., employee@company.com" 
                required 
                rules={{ required: "Email is required" }}
              />
              <RHFDatePicker 
                name="visaExpiry" 
                label="Visa Expiry Date" 
                placeholder="dd-mm-yyyy" 
                required 
              />
              <div className="md:col-span-2">
                <RHFTextField 
                  name="address" 
                  label="Address" 
                  placeholder="e.g., 123 Oxford Street, London W1D 2HD" 
                  required 
                  rules={{ required: "Address is required" }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Employment Information */}
          <div className="sms-section-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="sms-section-header bg-[#a327ff] px-6 py-3 flex items-center space-x-2">
              <Briefcase size={18} className="text-white" />
              <h2 className="text-white font-bold tracking-wide">Employment Information</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <RHFTextField 
                name="workLocation" 
                label="Work Location" 
                placeholder="e.g., London HQ" 
                required 
                rules={{ required: "Work Location is required" }}
              />
              <RHFTextField 
                name="designation" 
                label="Designation" 
                placeholder="e.g., Software Engineer" 
                required 
                rules={{ required: "Designation is required" }}
              />
            </div>
          </div>

          {/* Section 4: Payroll Information */}
          <div className="sms-section-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="sms-section-header bg-[#10b981] px-6 py-3 flex items-center space-x-2">
              <DollarSign size={18} className="text-white" />
              <h2 className="text-white font-bold tracking-wide">Payroll Information</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <RHFTextField 
                name="hourlyRate" 
                label="Hourly Rate (£)" 
                placeholder="e.g., 25.50" 
                required 
                rules={{ required: "Hourly Rate is required" }}
              />
              <RHFTextField 
                name="contractHours" 
                label="Contract Hours (per week)" 
                placeholder="e.g., 40" 
                required 
                rules={{ required: "Contract Hours are required" }}
              />
            </div>
          </div>

          {/* Section 5: Leave & Benefits Settings */}
          <div className="sms-section-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="sms-section-header bg-[#0284c7] px-6 py-3 flex items-center space-x-2">
              <Calendar size={18} className="text-white" />
              <h2 className="text-white font-bold tracking-wide">Leave & Benefits Settings</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
                  <RHFCheckbox name="deductions" label="Deductions Applicable" />
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
                  <RHFCheckbox name="dependents" label="Has Dependents" />
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
                  <RHFCheckbox name="ssp" label="SSP (Statutory Sick Pay)" />
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
                  <RHFCheckbox name="smp" label="SMP (Statutory Maternity Pay)" />
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
                  <RHFCheckbox name="unpaidLeave" label="Unpaid Leave" />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end items-center space-x-4 pt-4 pb-12">
            <button
              type="button"
              onClick={() => navigate('/immigration-profiles')}
              className="px-8 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-8 py-2.5 bg-[#1b6b8f] text-white rounded-lg font-bold shadow-lg hover:bg-[#13506b] transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save SMS Data</span>
                </>
              )}
            </button>
          </div>

        </form>
      </FormProvider>
    </div>
  );
};
