import axiosClient, { isNetworkError } from './axiosClient';
import { mockDb } from './mockDb';

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn("Backend down. Falling back to Mock DB.");
        return mockDb.auth.login(email, password);
      }
      throw new Error(error.response?.data?.message || "Error al iniciar sesión.");
    }
  },

  registro: async (nombre, email, password, rol) => {
    try {
      const response = await axiosClient.post('/auth/registro', { nombre, email, password, rol });
      return response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn("Backend down. Falling back to Mock DB.");
        return mockDb.auth.registro(nombre, email, password, rol);
      }
      throw new Error(error.response?.data?.message || "Error al registrarse.");
    }
  }
};
