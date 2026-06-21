import axiosClient, { isNetworkError } from './axiosClient';
import { mockDb } from './mockDb';

export const caballoApi = {
  getAll: async () => {
    try {
      const response = await axiosClient.get('/caballos');
      return response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return mockDb.caballos.getAll();
      }
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/caballos/${id}`);
      return response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return mockDb.caballos.getById(id);
      }
      throw error;
    }
  },

  create: async (caballoData) => {
    try {
      const response = await axiosClient.post('/caballos', caballoData);
      return response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return mockDb.caballos.create(caballoData);
      }
      throw error;
    }
  },

  update: async (id, caballoData) => {
    try {
      const response = await axiosClient.put(`/caballos/${id}`, caballoData);
      return response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return mockDb.caballos.update(id, caballoData);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosClient.delete(`/caballos/${id}`);
      return response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return mockDb.caballos.delete(id);
      }
      throw error;
    }
  },

  getMedicalHistory: async (caballoId) => {
    try {
      const response = await axiosClient.get(`/caballos/${caballoId}/historial-medico`);
      return response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return mockDb.caballos.getMedicalHistory(caballoId);
      }
      throw error;
    }
  },

  addMedicalEntry: async (caballoId, medicalEntry) => {
    try {
      const response = await axiosClient.post(`/caballos/${caballoId}/historial-medico`, medicalEntry);
      return response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return mockDb.caballos.addMedicalEntry(caballoId, medicalEntry);
      }
      throw error;
    }
  }
};
