import axiosClient, { isNetworkError } from './axiosClient';
import { mockDb } from './mockDb';

export const empleadoApi = {
  getAll: async () => {
    try {
      const res = await axiosClient.get('/empleados');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.empleados.getAll();
      throw e;
    }
  },
  create: async (data) => {
    try {
      const res = await axiosClient.post('/empleados', data);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.empleados.create(data);
      throw e;
    }
  },
  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`/empleados/${id}`, data);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.empleados.update(id, data);
      throw e;
    }
  },
  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`/empleados/${id}`);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.empleados.delete(id);
      throw e;
    }
  },
  getShifts: async (empleadoId) => {
    try {
      const res = await axiosClient.get(`/empleados/${empleadoId}/turnos`);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.empleados.getShifts(empleadoId);
      throw e;
    }
  },
  addShift: async (empleadoId, data) => {
    try {
      const res = await axiosClient.post(`/empleados/${empleadoId}/turnos`, data);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.empleados.addShift(empleadoId, data);
      throw e;
    }
  }
};

export const reservaApi = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axiosClient.get(`/reservas?${query}`);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        let list = mockDb.reservas.getAll();
        if (params.tipo) {
          list = list.filter(r => r.tipo === params.tipo);
        }
        if (params.fecha) {
          list = list.filter(r => r.fecha === params.fecha);
        }
        return list;
      }
      throw e;
    }
  },
  create: async (data) => {
    try {
      const res = await axiosClient.post('/reservas', data);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.reservas.create(data);
      throw e;
    }
  },
  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`/reservas/${id}`, data);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.reservas.update(id, data);
      throw e;
    }
  },
  cancel: async (id) => {
    try {
      const res = await axiosClient.patch(`/reservas/${id}/cancelar`);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.reservas.cancel(id);
      throw e;
    }
  },
  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`/reservas/${id}`);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.reservas.delete(id);
      throw e;
    }
  }
};

export const alimentacionApi = {
  getPlanByCaballo: async (caballoId) => {
    try {
      const res = await axiosClient.get(`/caballos/${caballoId}/plan-alimentacion`);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.alimentacion.getPlanByCaballo(caballoId);
      throw e;
    }
  },
  savePlan: async (caballoId, planData) => {
    try {
      const res = await axiosClient.post(`/caballos/${caballoId}/plan-alimentacion`, planData);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.alimentacion.savePlan(caballoId, planData);
      throw e;
    }
  },
  logSuministro: async (planId, supplyData) => {
    try {
      const res = await axiosClient.post(`/planes/${planId}/suministros`, supplyData);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.alimentacion.logSuministro(planId, supplyData);
      throw e;
    }
  },
  getLogs: async () => {
    try {
      const res = await axiosClient.get('/planes/suministros'); // or similar
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.alimentacion.getLogs();
      throw e;
    }
  }
};

export const inventarioApi = {
  getAll: async () => {
    try {
      const res = await axiosClient.get('/insumos');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.insumos.getAll();
      throw e;
    }
  },
  getLowStock: async () => {
    try {
      const res = await axiosClient.get('/insumos/stock-bajo');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.insumos.getLowStock();
      throw e;
    }
  },
  create: async (data) => {
    try {
      const res = await axiosClient.post('/insumos', data);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.insumos.create(data);
      throw e;
    }
  },
  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`/insumos/${id}`, data);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.insumos.update(id, data);
      throw e;
    }
  },
  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`/insumos/${id}`);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.insumos.delete(id);
      throw e;
    }
  }
};

export const alertaApi = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axiosClient.get(`/alertas?${query}`);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        if (params.leida === 'false') {
          return mockDb.alertas.getUnread();
        }
        return mockDb.alertas.getAll();
      }
      throw e;
    }
  },
  markAsRead: async (id) => {
    try {
      const res = await axiosClient.patch(`/alertas/${id}/marcar-leida`);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) return mockDb.alertas.markAsRead(id);
      throw e;
    }
  }
};
