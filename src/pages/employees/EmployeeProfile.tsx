import { useState } from 'react';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    DollarSign,
    User,
    AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmployeeProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Personal Info');

    const tabs = ['Personal Info', 'Job Details', 'Documents', 'Compliance'];

    const documents = [
        { id: 1, name: 'Employment Contract.pdf', date: '2023-06-15' },
        { id: 2, name: 'Visa Documentation.pdf', date: '2026-01-15' },
        { id: 3, name: 'Work Permit.pdf', date: '2026-02-10' },
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-800 transition-colors"
            >
                <ArrowLeft size={16} />
                <span className="text-[15px]">Back to Employees</span>
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm">
                <div className="flex items-center space-x-5">
                    <div className="w-[72px] h-[72px] rounded-full bg-[#ecf0ff] flex items-center justify-center text-[#5542f6] text-[22px] font-semibold">
                        SJ
                    </div>
                    <div>
                        <h1 className="text-[22px] font-semibold text-gray-900">Sarah Johnson</h1>
                        <p className="text-[15px] text-gray-500 mt-0.5">Senior Software Engineer</p>
                        <div className="flex space-x-2 mt-2.5">
                            <span className="bg-[#1a6e9a] text-white px-2.5 py-0.5 rounded-[5px] text-[12px] font-medium">
                                Immigration
                            </span>
                            <span className="bg-[#1a6e9a] text-white px-2.5 py-0.5 rounded-[5px] text-[12px] font-medium">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                    <button className="px-4 py-2 border border-[#1a6e9a] rounded-lg text-sm font-semibold text-[#1a6e9a] bg-white hover:bg-gray-50 transition-colors shadow-sm">
                        Edit Profile
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#5542f6] hover:bg-[#4635d8] transition-colors shadow-sm">
                        View Documents
                    </button>
                </div>
            </div>

            {/* Red Alert Banner */}
            <div className="bg-[#fff5f5] border border-[#fecdd3] rounded-lg p-4 flex items-start space-x-3">
                <AlertTriangle size={20} className="text-[#e11d48] mt-0.5" />
                <div>
                    <h3 className="text-[15px] font-bold text-[#e11d48]">Data mismatch detected with SMS system:</h3>
                    <p className="text-[14px] text-[#e11d48] mt-0.5">
                        1 field(s) require attention. Review the Compliance tab below.
                    </p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-[#f1f3f5] p-1 rounded-full inline-flex space-x-1">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-1.5 rounded-full text-[14px] font-medium transition-all flex items-center ${activeTab === tab
                                ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab}
                        {tab === 'Compliance' && (
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full ml-2"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content Areas */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm min-h-[400px]">

                {/* PERSONAL INFO TAB */}
                {activeTab === 'Personal Info' && (
                    <div>
                        <h2 className="text-[18px] font-semibold text-gray-900 mb-8 mt-2">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div className="flex space-x-4">
                                <Mail className="text-gray-400 mt-0.5" size={20} />
                                <div>
                                    <p className="text-[14px] text-gray-500 mb-0.5">Email</p>
                                    <p className="text-[15px] text-gray-900">sarah.johnson@company.com</p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Phone className="text-gray-400 mt-0.5" size={20} />
                                <div>
                                    <p className="text-[14px] text-gray-500 mb-0.5">Phone</p>
                                    <p className="text-[15px] text-gray-900">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex space-x-4 md:col-span-2">
                                <MapPin className="text-gray-400 mt-0.5" size={20} />
                                <div>
                                    <p className="text-[14px] text-gray-500 mb-0.5">Address</p>
                                    <p className="text-[15px] text-gray-900">123 Main St, New York, NY 10001</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* JOB DETAILS TAB */}
                {activeTab === 'Job Details' && (
                    <div>
                        <h2 className="text-[18px] font-semibold text-gray-900 mb-8 mt-2">Job Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div className="flex space-x-4">
                                <Briefcase className="text-gray-400 mt-0.5" size={20} />
                                <div>
                                    <p className="text-[14px] text-gray-500 mb-0.5">Department</p>
                                    <p className="text-[15px] text-gray-900">Engineering</p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Calendar className="text-gray-400 mt-0.5" size={20} />
                                <div>
                                    <p className="text-[14px] text-gray-500 mb-0.5">Hire Date</p>
                                    <p className="text-[15px] text-gray-900">2023-06-15</p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <DollarSign className="text-gray-400 mt-0.5" size={20} />
                                <div>
                                    <p className="text-[14px] text-gray-500 mb-0.5">Salary</p>
                                    <p className="text-[15px] text-gray-900">$125,000</p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <User className="text-gray-400 mt-0.5" size={20} />
                                <div>
                                    <p className="text-[14px] text-gray-500 mb-0.5">Employee Type</p>
                                    <p className="text-[15px] text-gray-900">Immigration</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DOCUMENTS TAB */}
                {activeTab === 'Documents' && (
                    <div>
                        <h2 className="text-[18px] font-semibold text-gray-900 mb-6 mt-2">Documents</h2>
                        <div className="space-y-4">
                            {documents.map((doc) => (
                                <div key={doc.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h4 className="text-[15px] text-gray-900 font-medium">{doc.name}</h4>
                                        <p className="text-[13px] text-gray-500 mt-0.5">Uploaded on {doc.date}</p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 shadow-sm">
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* COMPLIANCE TAB */}
                {activeTab === 'Compliance' && (
                    <div>
                        <div className="bg-[#fff9e6] border border-[#fde047] rounded-lg p-4 flex items-center space-x-3 mb-8">
                            <AlertTriangle size={18} className="text-[#a16207]" />
                            <p className="text-[14px] text-[#a16207]">Data discrepancies found between SMS and HRMS systems. Please review and resolve.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* SMS Data */}
                            <div className="border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[16px] font-semibold text-gray-900">SMS System Data</h3>
                                    <span className="border border-gray-200 text-gray-600 px-3 py-1 rounded-md text-[12px] font-medium">Source of Truth</span>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[13px] text-gray-500 mb-1">Phone Number</p>
                                        <p className="text-[15px] text-gray-900">+1 (555) 123-4567</p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 mb-1">Address</p>
                                        <p className="text-[15px] text-[#e11d48]">123 Main St, New York, NY 10001</p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 mb-1">Salary</p>
                                        <p className="text-[15px] text-gray-900">$125,000</p>
                                    </div>
                                </div>
                            </div>

                            {/* HRMS Data */}
                            <div className="border border-gray-200 rounded-xl p-6 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)]">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[16px] font-semibold text-gray-900">HRMS Data</h3>
                                    <span className="bg-[#1a6e9a] text-white px-3 py-1 rounded-md text-[12px] font-medium">Current System</span>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[13px] text-gray-500 mb-1">Phone Number</p>
                                        <p className="text-[15px] text-gray-900">+1 (555) 123-4567</p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 mb-1">Address</p>
                                        <p className="text-[15px] text-[#e11d48]">125 Main St, New York, NY 10001</p>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 mb-1">Salary</p>
                                        <p className="text-[15px] text-gray-900">$125,000</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-8">
                            <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#5542f6] hover:bg-[#4635d8] transition-colors shadow-sm">
                                Sync with SMS
                            </button>
                            <button className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 shadow-sm">
                                Request Update
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
