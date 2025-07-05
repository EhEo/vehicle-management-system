export interface Employee {
  id: string;
  name: string;
  department: string;
  status: 'working' | 'leaving' | 'business_trip' | 'vacation' | 'out_of_office';
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  status: 'available' | 'in_use' | 'out_of_office' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}

export interface ExternalVehicle {
  id: string;
  type: 'taxi' | 'personal' | 'external';
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveRecord {
  id: string;
  date: string;
  vehicleId: string;
  vehicleName: string;
  employees: {
    id: string;
    name: string;
    department: string;
  }[];
  leaveTime: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExternalLeaveRecord {
  id: string;
  date: string;
  externalVehicleId: string;
  externalVehicleName: string;
  employees: {
    id: string;
    name: string;
    department: string;
  }[];
  leaveTime: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}