import { api } from "./api";

export const immigrationService = {
  // Get all compliance conflicts
  getComplianceConflicts: async (pagination = false, page = 1, limit = 10) => {
    const response = await api.get("api/v1/comparison/conflict-data", {
      params: { pagination, page, limit },
    });
    return response.data;
  },

  // Get detailed conflicts for a specific employee
  getEmployeeConflicts: async (employeeId: string) => {
    const response = await api.get(`api/v1/comparison/conflicts/${employeeId}/compare`);
    return response.data;
  },

  // Get all immigration profiles
  getImmigrationProfiles: async (page = 1, limit = 10, conflictStatus?: string) => {
    const response = await api.get("immigration-profiles", {
      params: { page, limit, conflictStatus },
    });
    return response.data;
  },

  // Update SMS data for an existing immigration profile
  // profileId = immigration profile _id (from GET /immigration-profiles response)
  saveSMSData: async (profileId: string, smsData: any) => {
    // If this is a mock/demo profile, simulate success without hitting the API
    if (profileId.startsWith('mock-')) {
      return { success: true, data: {}, message: 'Demo save (no real API call)' };
    }
    const response = await api.put(`immigration-profiles/${profileId}`, { smsData });
    return response.data;
  },

  // Get single immigration profile by ID
  getImmigrationProfileById: async (profileId: string) => {
    if (profileId.startsWith('mock-')) {
      // Return enhanced mock data for details view
      return {
        success: true,
        data: {
          _id: profileId,
          empCode: profileId === 'mock-1' ? 'EMP-2024-001' : 'EMP-0022',
          employeeName: profileId === 'mock-1' ? 'Priya Nair' : 'Abraham Anitha',
          firstName: 'Abraham',
          lastName: 'Anitha',
          jobTitle: 'Activity Co-ordinator',
          department: 'Care Staff',
          smsData: {
            niNumber: 'AB987654B',
            passportNumber: 'U4571060',
            residentPermitExpiry: '2027-03-16',
            nationality: 'British',
            email: 'abraham.a@example.com',
            contactNumber: '07712 345678',
            address: '123 Care Home Rd, London',
            hourlyRate: 12.50,
            contractHours: 37.5,
            deductions: true,
            dependents: false,
          }
        }
      };
    }
    const response = await api.get(`immigration-profiles/${profileId}`);
    return response.data;
  },
};
