import React, { useEffect, useState } from 'react';
import { X, User, Briefcase, ShieldCheck, DollarSign, Clock, MapPin, CheckCircle } from 'lucide-react';
import { immigrationService } from '@/core/api/immigrationService';
import './ProfileDetailModal.css';

interface ProfileDetailModalProps {
  profileId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ profileId, isOpen, onClose }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && profileId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const response = await immigrationService.getImmigrationProfileById(profileId);
          if (response.success) {
            setProfileData(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch profile details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, profileId]);

  if (!isOpen) return null;

  const initials = profileData?.employeeName 
    ? profileData.employeeName.split(' ').map((n: any) => n[0]).join('').toUpperCase().substring(0, 2)
    : '??';

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-header-info">
            <div className="profile-avatar-large">
              {initials}
            </div>
            <div className="profile-name-area">
              <h2>{profileData?.employeeName || 'Loading...'}</h2>
              <div className="profile-subtitle">{profileData?.empCode || '...'} • {profileData?.smsData?.nationality || 'N/A'}</div>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="profile-modal-content">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#246e8c] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Personal Information */}
              <div className="modal-section">
                <h3 className="section-title"><User size={18} /> Personal Information</h3>
                <div className="section-grid">
                  <div className="info-item"><span className="info-label">Title</span><span className="info-value">Mr</span></div>
                  <div className="info-item"><span className="info-label">Known As</span><span className="info-value">Abe</span></div>
                  <div className="info-item"><span className="info-label">Date of Birth</span><span className="info-value">21 Mar 1990</span></div>
                  <div className="info-item"><span className="info-label">Gender</span><span className="info-value">Male</span></div>
                  <div className="info-item"><span className="info-label">Pronouns</span><span className="info-value">He/Him</span></div>
                  <div className="info-item"><span className="info-label">Marital Status</span><span className="info-value">Single</span></div>
                  <div className="info-item"><span className="info-label">Nationality</span><span className="info-value">{profileData?.smsData?.nationality || 'British'}</span></div>
                  <div className="info-item"><span className="info-label">Ethnic Origin</span><span className="info-value">Black African</span></div>
                  <div className="info-item"><span className="info-label">Religion</span><span className="info-value">Buddhist</span></div>
                  <div className="info-item"><span className="info-label">NHS Number</span><span className="info-value">2222123123</span></div>
                  <div className="info-item"><span className="info-label">Emergency Contact</span><span className="info-value">John Anitha</span></div>
                  <div className="info-item"><span className="info-label">Next of Kin</span><span className="info-value">Mary Anitha</span></div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="modal-section">
                <h3 className="section-title"><Briefcase size={18} /> Employment Information</h3>
                <div className="section-grid">
                  <div className="info-item"><span className="info-label">Job Title</span><span className="info-value">{profileData?.jobTitle || 'Activity Co-ordinator'}</span></div>
                  <div className="info-item"><span className="info-label">Department</span><span className="info-value">{profileData?.department || 'Care Staff'}</span></div>
                  <div className="info-item"><span className="info-label">Job Status</span><span className="badge-value badge-active">Active</span></div>
                  <div className="info-item"><span className="info-label">Start Date</span><span className="info-value">31 Mar 2026</span></div>
                  <div className="info-item"><span className="info-label">Supervisor</span><span className="info-value">Jane Smith</span></div>
                  <div className="info-item"><span className="info-label">NI Number</span><span className="info-value">{profileData?.smsData?.niNumber || 'AB987654B'}</span></div>
                  <div className="info-item"><span className="info-label">Key Worker</span><span className="badge-value badge-no">No</span></div>
                  <div className="info-item"><span className="info-label">Display on Rota</span><span className="badge-value badge-yes">Yes</span></div>
                </div>
              </div>

              {/* Compliance & Immigration Details */}
              <div className="modal-section">
                <h3 className="section-title"><ShieldCheck size={18} /> Compliance & Immigration Details</h3>
                <div className="section-grid">
                  <div className="info-item"><span className="info-label">Passport Number</span><span className="info-value">{profileData?.smsData?.passportNumber || 'U4571060'}</span></div>
                  <div className="info-item"><span className="info-label">Passport Expiry</span><span className="info-value">30 Mar 2027</span></div>
                  <div className="info-item"><span className="info-label">Resident Permit Expiry</span><span className="info-value">16 Mar 2027</span></div>
                  <div className="info-item"><span className="info-label">CRB Number</span><span className="info-value">CRB123456</span></div>
                  <div className="info-item"><span className="info-label">CRB Date</span><span className="info-value">27 Mar 2026</span></div>
                  <div className="info-item"><span className="info-label">CRB Cleared</span><span className="badge-value badge-yes">Yes</span></div>
                  <div className="info-item"><span className="info-label">Badge Number</span><span className="info-value">BADGE001</span></div>
                  <div className="info-item"><span className="info-label">Status</span><span className="badge-value badge-status">Clear</span></div>
                </div>
                
                <div className="mt-6">
                  <span className="info-label mb-2 block">NMC Records</span>
                  <div className="nmc-records-table">
                    <div className="nmc-header">
                      <span className="info-label">NMC Number</span>
                      <span className="info-label">Start Date</span>
                      <span className="info-label">Expiry Date</span>
                    </div>
                    <div className="nmc-row">
                      <span className="info-value">934759347598</span>
                      <span className="info-value text-gray-500">31 Mar 2026</span>
                      <span className="info-value text-gray-500">30 Mar 2028</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payroll Information */}
              <div className="modal-section">
                <h3 className="section-title"><DollarSign size={18} /> Payroll Information</h3>
                <div className="section-grid">
                  <div className="info-item"><span className="info-label">Employee Type</span><span className="badge-value bg-[#1b6b8f] text-white">Immigration</span></div>
                  <div className="info-item"><span className="info-label">Hourly Rate</span><span className="info-value">£{profileData?.smsData?.hourlyRate?.toFixed(2) || '12.50'}</span></div>
                  <div className="info-item"><span className="info-label">Contract Hours</span><span className="info-value">{profileData?.smsData?.contractHours || '37.5'} hrs/week</span></div>
                  <div className="info-item flex-grow"><span className="info-label">Work Location</span><span className="info-value">Ashton House</span></div>
                </div>

                <div className="mt-6">
                  <span className="info-label mb-2 block">Bank Accounts</span>
                  <div className="bank-account-card">
                    <div className="bank-tag">Primary (Active)</div>
                    <div className="flex justify-between">
                      <div className="info-item"><span className="info-label">Bank Name</span><span className="info-value">Lloyds</span></div>
                      <div className="info-item"><span className="info-label">Account Number</span><span className="info-value">*****5678</span></div>
                      <div className="info-item text-right"><span className="info-label">Sort Code</span><span className="info-value">20-00-00</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="footer-stamp">
          <Clock size={12} />
          Last compared: 30 Mar 2026
        </div>
      </div>
    </div>
  );
};
