export interface Client {
    id: number
    regNo: string
    name: string
    dob: string
    phone: string
    email: string
    address: string
    lastVisit: string
  }
  
  export interface Prescription {
    id: number
    clientId: number
    date: string
    right: {
      sph: string
      cyl: string
      axis: string
      add: string
      va: string
      ipd: string
    }
    left: {
      sph: string
      cyl: string
      axis: string
      add: string
      va: string
      ipd: string
    }
    doctor: string
    notes: string
  }
  
  export interface Sale {
    id: number
    reference: string
    clientId: number
    client: {
      name: string
      regNo: string
    }
    date: string
    frame: {
      brand: string
      model: string
      color: string
      quantity: number
      price: number
    }
    lens: {
      brand: string
      type: string
      material: string
      coating: string
      quantity: number
      price: number
    }
    payment: {
      subtotal: number
      tax: number
      total: number
      advance: number
      balance: number
      method: "cash" | "mpesa" | "card"
    }
    order: {
      fittingInstructions: string
      deliveryDate: string
      bookedBy: string
      status: "pending" | "ready" | "delivered" | "cancelled"
    }
  }
  
  export interface Staff {
    id: number
    name: string
    email: string
    role: "admin" | "optometrist" | "receptionist" | "sales"
    status: "active" | "inactive"
  }
  
  export interface AdminUser {
    username: string
    password: string
    role: "admin"
  }
  
  // Sample admin users (in production, this would be in a secure database)
  export const ADMIN_USERS: AdminUser[] = [
    {
      username: "admin",
      password: "admin123", // In production, this would be hashed
      role: "admin",
    },
    {
      username: "manager",
      password: "manager123", // In production, this would be hashed
      role: "admin",
    },
  ]
  
  