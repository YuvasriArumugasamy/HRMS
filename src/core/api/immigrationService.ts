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

  // Resolve a conflict (this might involve updating the profile)
  // For now, we'll assume updating the profile is the way to resolve
  updateImmigrationProfile: async (id: string, data: any) => {
    const response = await api.put(`immigration-profiles/${id}`, data);
    return response.data;
  },
};
