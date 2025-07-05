import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Employee, Vehicle, LeaveRecord } from '@/types';

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'employees'), orderBy('name'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Employee[];
  },

  async getById(id: string): Promise<Employee | null> {
    const docRef = doc(db, 'employees', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Employee;
    }
    return null;
  },

  async create(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'employees'), {
      ...employee,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Employee>): Promise<void> {
    const docRef = doc(db, 'employees', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'employees', id);
    await deleteDoc(docRef);
  },

  async getByStatus(status: Employee['status']): Promise<Employee[]> {
    const q = query(
      collection(db, 'employees'),
      where('status', '==', status),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Employee[];
  },

  onSnapshot(callback: (employees: Employee[]) => void) {
    return onSnapshot(
      query(collection(db, 'employees'), orderBy('name')),
      (querySnapshot) => {
        const employees = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Employee[];
        callback(employees);
      }
    );
  },
};

export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'vehicles'), orderBy('name'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Vehicle[];
  },

  async getById(id: string): Promise<Vehicle | null> {
    const docRef = doc(db, 'vehicles', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Vehicle;
    }
    return null;
  },

  async create(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'vehicles'), {
      ...vehicle,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Vehicle>): Promise<void> {
    const docRef = doc(db, 'vehicles', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'vehicles', id);
    await deleteDoc(docRef);
  },

  async getByStatus(status: Vehicle['status']): Promise<Vehicle[]> {
    const q = query(
      collection(db, 'vehicles'),
      where('status', '==', status),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Vehicle[];
  },

  onSnapshot(callback: (vehicles: Vehicle[]) => void) {
    return onSnapshot(
      query(collection(db, 'vehicles'), orderBy('name')),
      (querySnapshot) => {
        const vehicles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Vehicle[];
        callback(vehicles);
      }
    );
  },
};

export const leaveRecordService = {
  async getAll(): Promise<LeaveRecord[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'leaveRecords'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      leaveTime: doc.data().leaveTime?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as LeaveRecord[];
  },

  async getByDate(date: string): Promise<LeaveRecord[]> {
    const q = query(
      collection(db, 'leaveRecords'),
      where('date', '==', date),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      leaveTime: doc.data().leaveTime?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as LeaveRecord[];
  },

  async create(record: Omit<LeaveRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'leaveRecords'), {
      ...record,
      leaveTime: Timestamp.fromDate(record.leaveTime),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<LeaveRecord>): Promise<void> {
    const docRef = doc(db, 'leaveRecords', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
      ...(updates.leaveTime && { leaveTime: Timestamp.fromDate(updates.leaveTime) }),
    };
    
    await updateDoc(docRef, updateData);
  },

  onSnapshot(callback: (records: LeaveRecord[]) => void) {
    return onSnapshot(
      query(collection(db, 'leaveRecords'), orderBy('createdAt', 'desc')),
      (querySnapshot) => {
        const records = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          leaveTime: doc.data().leaveTime?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as LeaveRecord[];
        callback(records);
      }
    );
  },
};