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

  // Save SMS data for an employee
  saveSMSData: async (employeeId: string, smsData: any) => {
    const response = await api.post(`api/v1/immigration/sms-data`, {
      employeeId,
      ...smsData,
    });
    return response.data;
  },
};
