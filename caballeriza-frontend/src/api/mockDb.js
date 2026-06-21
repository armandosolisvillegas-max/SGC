// Fallback Local Mock Database for SGC Frontend (persisted in LocalStorage)

const DEFAULT_DB = {
  usuarios: [
    { id: 1, nombre: "Admin SGC", email: "admin@caballo.com", password: "admin123", rol: "ADMINISTRADOR" },
    { id: 2, nombre: "Dr. Roberto Solis", email: "vet@caballo.com", password: "vet123", rol: "VETERINARIO" },
    { id: 3, nombre: "Juan Pérez (Cuidador)", email: "cuidador@caballo.com", password: "cuidador123", rol: "CUIDADOR" },
    { id: 4, nombre: "Carlos Méndez (Cliente)", email: "cliente@caballo.com", password: "cliente123", rol: "CLIENTE" }
  ],
  caballos: [
    { id: 1, nombre: "Rayo", identificador: "CAB-001", edad: 5, raza: "Pura Sangre", sexo: "Macho", peso: 450, fotoUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500&auto=format&fit=crop" },
    { id: 2, nombre: "Tormenta", identificador: "CAB-002", edad: 4, raza: "Árabe", sexo: "Hembra", peso: 420, fotoUrl: "https://images.unsplash.com/photo-1598974357801-cbca100e6543?w=500&auto=format&fit=crop" },
    { id: 3, nombre: "Centella", identificador: "CAB-003", edad: 7, raza: "Frisón", sexo: "Hembra", peso: 510, fotoUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop" }
  ],
  historialesMedicos: [
    { id: 1, caballoId: 1, tipo: "vacuna", fecha: "2026-05-10", descripcion: "Vacuna de Influenza Equina anual.", responsableId: 2, responsableNombre: "Dr. Roberto Solis" },
    { id: 2, caballoId: 1, tipo: "tratamiento", fecha: "2026-06-01", descripcion: "Tratamiento desparasitante oral.", responsableId: 2, responsableNombre: "Dr. Roberto Solis" },
    { id: 3, caballoId: 2, tipo: "alergia", fecha: "2026-04-15", descripcion: "Alergia detectada al polvo de paja fina.", responsableId: 2, responsableNombre: "Dr. Roberto Solis" }
  ],
  empleados: [
    { id: 1, nombre: "Roberto Solis", rol: "veterinario", contacto: "+506 8888-1111" },
    { id: 2, nombre: "Pedro Alvares", rol: "potrador", contacto: "+506 8888-2222" },
    { id: 3, nombre: "Juan Pérez", rol: "cuidador", contacto: "+506 8888-3333" },
    { id: 4, nombre: "María Gómez", rol: "administrador", contacto: "+506 8888-4444" }
  ],
  turnos: [
    { id: 1, empleadoId: 3, fecha: "2026-06-21", horaInicio: "08:00", horaFin: "16:00", tareaAsignada: "Limpieza de pesebreras y cepillado general." },
    { id: 2, empleadoId: 1, fecha: "2026-06-22", horaInicio: "09:00", horaFin: "13:00", tareaAsignada: "Revisión general y desparasitaciones." },
    { id: 3, empleadoId: 2, fecha: "2026-06-21", horaInicio: "14:00", horaFin: "18:00", tareaAsignada: "Entrenamiento de salto con Rayo." }
  ],
  reservas: [
    { id: 1, tipo: "cita_vet", fecha: "2026-06-22", horaInicio: "09:30", horaFin: "10:30", estado: "CONFIRMADA", cupoMaximo: 1, cupoActual: 1, caballoId: 1, caballoNombre: "Rayo", clienteId: 1, clienteNombre: "Admin SGC" },
    { id: 2, tipo: "paseo", fecha: "2026-06-23", horaInicio: "15:00", horaFin: "16:30", estado: "CONFIRMADA", cupoMaximo: 5, cupoActual: 2, caballoId: 2, caballoNombre: "Tormenta", clienteId: 4, clienteNombre: "Carlos Méndez" },
    { id: 3, tipo: "monta", fecha: "2026-06-24", horaInicio: "10:00", horaFin: "11:30", estado: "PENDIENTE", cupoMaximo: 2, cupoActual: 1, caballoId: 3, caballoNombre: "Centella", clienteId: 4, clienteNombre: "Carlos Méndez" }
  ],
  planesAlimentacion: [
    { id: 1, caballoId: 1, descripcion: "Alfalfa verde fresca + Concentrado premium. 2kg diario.", frecuencia: "Diario (Mañana y Tarde)", insumoId: 1 },
    { id: 2, caballoId: 2, descripcion: "Heno selecto + suplemento vitamínico.", frecuencia: "Diario (Mañana)", insumoId: 1 },
    { id: 3, caballoId: 3, descripcion: "Concentrado energético alto en fibra.", frecuencia: "Dos veces al día", insumoId: 2 }
  ],
  registrosSuministro: [
    { id: 1, fecha: "2026-06-20", tipo: "alimento", cantidad: 2.0, planId: 1, caballoNombre: "Rayo" },
    { id: 2, fecha: "2026-06-20", tipo: "alimento", cantidad: 1.5, planId: 2, caballoNombre: "Tormenta" }
  ],
  insumos: [
    { id: 1, nombre: "Heno de Alfalfa", tipo: "alimento", stockActual: 120.5, stockMinimo: 50.0 },
    { id: 2, nombre: "Concentrado Nutre-Equino", tipo: "alimento", stockActual: 15.0, stockMinimo: 25.0 },
    { id: 3, nombre: "Desparasitante Equi-Max", tipo: "medicina", stockActual: 40.0, stockMinimo: 10.0 },
    { id: 4, nombre: "Vacuna Influenza EquiShield", tipo: "medicina", stockActual: 5.0, stockMinimo: 8.0 }
  ],
  alertas: [
    { id: 1, tipo: "stock_bajo", mensaje: "El stock de 'Concentrado Nutre-Equino' está por debajo del mínimo (15.0kg / 25.0kg).", referenciaId: 2, leida: false, fecha: "2026-06-20" },
    { id: 2, tipo: "stock_bajo", mensaje: "El stock de 'Vacuna Influenza EquiShield' está por debajo del mínimo (5.0u / 8.0u).", referenciaId: 4, leida: false, fecha: "2026-06-20" }
  ]
};

// Check if localStorage database exists, if not initialize it
const getDB = () => {
  const dbStr = localStorage.getItem('sgc_db');
  if (!dbStr) {
    localStorage.setItem('sgc_db', JSON.stringify(DEFAULT_DB));
    return DEFAULT_DB;
  }
  return JSON.parse(dbStr);
};

const saveDB = (db) => {
  localStorage.setItem('sgc_db', JSON.stringify(db));
};

export const mockDb = {
  // Auth mock handlers
  auth: {
    login: (email, password) => {
      const db = getDB();
      const user = db.usuarios.find(u => u.email === email && u.password === password);
      if (user) {
        return { token: `mock-jwt-token-for-${user.id}-${user.rol}`, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } };
      }
      throw new Error("Credenciales inválidas.");
    },
    registro: (nombre, email, password, rol) => {
      const db = getDB();
      if (db.usuarios.some(u => u.email === email)) {
        throw new Error("El correo electrónico ya está registrado.");
      }
      const newUser = { id: Date.now(), nombre, email, password, rol: rol || "CLIENTE" };
      db.usuarios.push(newUser);
      saveDB(db);
      return { token: `mock-jwt-token-for-${newUser.id}-${newUser.rol}`, user: { id: newUser.id, nombre: newUser.nombre, email: newUser.email, rol: newUser.rol } };
    }
  },

  // Horses CRUD
  caballos: {
    getAll: () => getDB().caballos,
    getById: (id) => getDB().caballos.find(c => c.id === Number(id)),
    create: (data) => {
      const db = getDB();
      const newHorse = { ...data, id: Date.now() };
      db.caballos.push(newHorse);
      saveDB(db);
      return newHorse;
    },
    update: (id, data) => {
      const db = getDB();
      const idx = db.caballos.findIndex(c => c.id === Number(id));
      if (idx !== -1) {
        db.caballos[idx] = { ...db.caballos[idx], ...data };
        saveDB(db);
        return db.caballos[idx];
      }
      throw new Error("Caballo no encontrado.");
    },
    delete: (id) => {
      const db = getDB();
      db.caballos = db.caballos.filter(c => c.id !== Number(id));
      db.historialesMedicos = db.historialesMedicos.filter(h => h.caballoId !== Number(id));
      db.planesAlimentacion = db.planesAlimentacion.filter(p => p.caballoId !== Number(id));
      saveDB(db);
      return true;
    },
    getMedicalHistory: (caballoId) => {
      return getDB().historialesMedicos.filter(h => h.caballoId === Number(caballoId));
    },
    addMedicalEntry: (caballoId, entry) => {
      const db = getDB();
      const newEntry = {
        ...entry,
        id: Date.now(),
        caballoId: Number(caballoId),
        fecha: entry.fecha || new Date().toISOString().split('T')[0]
      };
      db.historialesMedicos.push(newEntry);
      saveDB(db);
      return newEntry;
    }
  },

  // Employees CRUD
  empleados: {
    getAll: () => getDB().empleados,
    create: (data) => {
      const db = getDB();
      const newEmp = { ...data, id: Date.now() };
      db.empleados.push(newEmp);
      saveDB(db);
      return newEmp;
    },
    update: (id, data) => {
      const db = getDB();
      const idx = db.empleados.findIndex(e => e.id === Number(id));
      if (idx !== -1) {
        db.empleados[idx] = { ...db.empleados[idx], ...data };
        saveDB(db);
        return db.empleados[idx];
      }
      throw new Error("Empleado no encontrado.");
    },
    delete: (id) => {
      const db = getDB();
      db.empleados = db.empleados.filter(e => e.id !== Number(id));
      db.turnos = db.turnos.filter(t => t.empleadoId !== Number(id));
      saveDB(db);
      return true;
    },
    getShifts: (empleadoId) => {
      return getDB().turnos.filter(t => t.empleadoId === Number(empleadoId));
    },
    addShift: (empleadoId, shiftData) => {
      const db = getDB();
      const newShift = {
        ...shiftData,
        id: Date.now(),
        empleadoId: Number(empleadoId)
      };
      db.turnos.push(newShift);
      saveDB(db);
      return newShift;
    }
  },

  // Calendar Reservations
  reservas: {
    getAll: () => getDB().reservas,
    create: (data) => {
      const db = getDB();
      
      // Control de Cupo: Check if capacity allows booking
      const maxSlots = Number(data.cupoMaximo) || 1;
      const matchingBookings = db.reservas.filter(r => 
        r.fecha === data.fecha && 
        r.horaInicio === data.horaInicio && 
        r.estado !== "CANCELADA" &&
        r.caballoId === Number(data.caballoId)
      );
      
      const totalBooked = matchingBookings.reduce((sum, r) => sum + (r.cupoActual || 1), 0);
      if (totalBooked >= maxSlots) {
        throw new Error("EXCESO_CUPO: No hay cupo disponible para esta fecha, hora y caballo.");
      }

      const horse = db.caballos.find(c => c.id === Number(data.caballoId));
      const client = db.usuarios.find(u => u.id === Number(data.clienteId)) || { nombre: "Cliente General" };

      const newRes = {
        ...data,
        id: Date.now(),
        caballoId: Number(data.caballoId),
        caballoNombre: horse ? horse.nombre : "Desconocido",
        clienteId: Number(data.clienteId),
        clienteNombre: client.nombre,
        cupoActual: 1,
        estado: data.estado || "PENDIENTE"
      };

      db.reservas.push(newRes);
      saveDB(db);
      return newRes;
    },
    update: (id, data) => {
      const db = getDB();
      const idx = db.reservas.findIndex(r => r.id === Number(id));
      if (idx !== -1) {
        db.reservas[idx] = { ...db.reservas[idx], ...data };
        saveDB(db);
        return db.reservas[idx];
      }
      throw new Error("Reserva no encontrada.");
    },
    cancel: (id) => {
      const db = getDB();
      const idx = db.reservas.findIndex(r => r.id === Number(id));
      if (idx !== -1) {
        db.reservas[idx].estado = "CANCELADA";
        saveDB(db);
        return db.reservas[idx];
      }
      throw new Error("Reserva no encontrada.");
    },
    delete: (id) => {
      const db = getDB();
      db.reservas = db.reservas.filter(r => r.id !== Number(id));
      saveDB(db);
      return true;
    }
  },

  // Feeding & Supplies Plan
  alimentacion: {
    getPlanByCaballo: (caballoId) => {
      return getDB().planesAlimentacion.find(p => p.caballoId === Number(caballoId));
    },
    savePlan: (caballoId, planData) => {
      const db = getDB();
      const idx = db.planesAlimentacion.findIndex(p => p.caballoId === Number(caballoId));
      if (idx !== -1) {
        db.planesAlimentacion[idx] = { ...db.planesAlimentacion[idx], ...planData };
        saveDB(db);
        return db.planesAlimentacion[idx];
      } else {
        const newPlan = { ...planData, id: Date.now(), caballoId: Number(caballoId) };
        db.planesAlimentacion.push(newPlan);
        saveDB(db);
        return newPlan;
      }
    },
    logSuministro: (planId, supplyData) => {
      const db = getDB();
      const plan = db.planesAlimentacion.find(p => p.id === Number(planId));
      if (!plan) throw new Error("Plan de alimentación no encontrado.");
      
      const horse = db.caballos.find(c => c.id === plan.caballoId);
      
      // Subtract from inventory stock
      if (plan.insumoId) {
        const insumoIdx = db.insumos.findIndex(i => i.id === Number(plan.insumoId));
        if (insumoIdx !== -1) {
          const insumo = db.insumos[insumoIdx];
          const newStock = Math.max(0, insumo.stockActual - Number(supplyData.cantidad));
          db.insumos[insumoIdx].stockActual = newStock;
          
          // Trigger alert if stock falls below minimum
          if (newStock < insumo.stockMinimo) {
            const hasAlert = db.alertas.some(a => a.tipo === "stock_bajo" && a.referenciaId === insumo.id && !a.leida);
            if (!hasAlert) {
              db.alertas.push({
                id: Date.now(),
                tipo: "stock_bajo",
                mensaje: `El stock de '${insumo.nombre}' ha caído por debajo del mínimo recomendado (${newStock} / ${insumo.stockMinimo}).`,
                referenciaId: insumo.id,
                leida: false,
                fecha: new Date().toISOString().split('T')[0]
              });
            }
          }
        }
      }
      
      const newLog = {
        id: Date.now(),
        fecha: new Date().toISOString().split('T')[0],
        tipo: supplyData.tipo || "alimento",
        cantidad: Number(supplyData.cantidad),
        planId: Number(planId),
        caballoNombre: horse ? horse.nombre : "Desconocido"
      };
      
      db.registrosSuministro.push(newLog);
      saveDB(db);
      return newLog;
    },
    getLogs: () => {
      return getDB().registrosSuministro;
    }
  },

  // Inventory Insumos
  insumos: {
    getAll: () => getDB().insumos,
    getLowStock: () => {
      const db = getDB();
      return db.insumos.filter(i => i.stockActual < i.stockMinimo);
    },
    create: (data) => {
      const db = getDB();
      const newInsumo = {
        ...data,
        id: Date.now(),
        stockActual: Number(data.stockActual),
        stockMinimo: Number(data.stockMinimo)
      };
      db.insumos.push(newInsumo);
      
      // Check low stock alert immediately
      if (newInsumo.stockActual < newInsumo.stockMinimo) {
        db.alertas.push({
          id: Date.now() + 1,
          tipo: "stock_bajo",
          mensaje: `Alerta inicial: El stock de '${newInsumo.nombre}' está bajo (${newInsumo.stockActual} / ${newInsumo.stockMinimo}).`,
          referenciaId: newInsumo.id,
          leida: false,
          fecha: new Date().toISOString().split('T')[0]
        });
      }
      
      saveDB(db);
      return newInsumo;
    },
    update: (id, data) => {
      const db = getDB();
      const idx = db.insumos.findIndex(i => i.id === Number(id));
      if (idx !== -1) {
        const updated = {
          ...db.insumos[idx],
          ...data,
          stockActual: Number(data.stockActual),
          stockMinimo: Number(data.stockMinimo)
        };
        db.insumos[idx] = updated;
        
        // Remove or trigger low stock alert
        if (updated.stockActual < updated.stockMinimo) {
          const hasAlert = db.alertas.some(a => a.tipo === "stock_bajo" && a.referenciaId === updated.id && !a.leida);
          if (!hasAlert) {
            db.alertas.push({
              id: Date.now(),
              tipo: "stock_bajo",
              mensaje: `El stock de '${updated.nombre}' se encuentra bajo (${updated.stockActual} / ${updated.stockMinimo}).`,
              referenciaId: updated.id,
              leida: false,
              fecha: new Date().toISOString().split('T')[0]
            });
          }
        } else {
          // Auto read or delete stock alert if solved
          db.alertas = db.alertas.filter(a => !(a.tipo === "stock_bajo" && a.referenciaId === updated.id));
        }
        
        saveDB(db);
        return updated;
      }
      throw new Error("Insumo no encontrado.");
    }
  },

  // System Alerts
  alertas: {
    getAll: () => getDB().alertas,
    getUnread: () => getDB().alertas.filter(a => !a.leida),
    markAsRead: (id) => {
      const db = getDB();
      const idx = db.alertas.findIndex(a => a.id === Number(id));
      if (idx !== -1) {
        db.alertas[idx].leida = true;
        saveDB(db);
        return db.alertas[idx];
      }
      throw new Error("Alerta no encontrada.");
    }
  }
};
