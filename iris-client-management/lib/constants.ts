export const CURRENCY = {
    code: "KES",
    symbol: "KSh",
  }
  
  export const VAT_RATE = 0.16 // 16% VAT
  
  export const FRAME_OPTIONS = {
    brands: ["Ray-Ban", "Oakley", "Gucci", "Prada", "Tom Ford"],
    models: {
      "Ray-Ban": ["Aviator", "Wayfarer", "Round Metal", "Clubmaster"],
      Oakley: ["Holbrook", "Gascan", "Half Jacket", "Flak"],
      Gucci: ["GG0022", "GG0023", "GG0024", "GG0025"],
      Prada: ["PR 01OS", "PR 02OS", "PR 03OS", "PR 04OS"],
      "Tom Ford": ["TF 5178", "TF 5179", "TF 5180", "TF 5181"],
    },
    colors: ["Black", "Gold", "Silver", "Tortoise", "Blue", "Brown"],
  }
  
  export const LENS_OPTIONS = {
    brands: ["Essilor", "Zeiss", "Hoya", "Rodenstock"],
    types: ["Single Vision", "Bifocal", "Progressive", "Photochromic"],
    materials: ["CR-39", "Polycarbonate", "High Index 1.67", "High Index 1.74"],
    coatings: ["Anti-Reflective", "Anti-Scratch", "Blue Light Filter", "UV Protection"],
  }
  
  // Sample data (in production, this would come from a database)
  export const SAMPLE_CLIENTS = [
    {
      id: 1,
      regNo: "M/2024/03/0001",
      name: "John Doe",
      dob: "1985-05-12",
      phone: "+254712345678",
      email: "john.doe@example.com",
      address: "Nairobi, Westlands",
      lastVisit: "2024-03-15",
    },
    {
      id: 2,
      regNo: "M/2024/03/0002",
      name: "Jane Smith",
      dob: "1990-08-22",
      phone: "+254723456789",
      email: "jane.smith@example.com",
      address: "Nairobi, Kilimani",
      lastVisit: "2024-03-14",
    },
    // Add more sample clients...
  ]
  
  export const SAMPLE_SALES = [
    {
      id: 1,
      reference: "SO240315001",
      clientId: 1,
      client: {
        name: "John Doe",
        regNo: "M/2024/03/0001",
      },
      date: "2024-03-15",
      frame: {
        brand: "Ray-Ban",
        model: "Aviator",
        color: "Gold",
        quantity: 1,
        price: 15000,
      },
      lens: {
        brand: "Essilor",
        type: "Progressive",
        material: "High Index 1.67",
        coating: "Anti-Reflective",
        quantity: 2,
        price: 12000,
      },
      payment: {
        subtotal: 39000,
        tax: 6240,
        total: 45240,
        advance: 20000,
        balance: 25240,
        method: "mpesa",
      },
      order: {
        fittingInstructions: "PD: 64mm, Adjust nose pads",
        deliveryDate: "2024-03-20",
        bookedBy: "Sarah",
        status: "pending",
      },
    },
    // Add more sample sales...
  ]
  
  export const SAMPLE_STAFF = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@iris.com",
      role: "optometrist",
      status: "active",
    },
    {
      id: 2,
      name: "Michael Brown",
      email: "michael.brown@iris.com",
      role: "receptionist",
      status: "active",
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily.davis@iris.com",
      role: "sales",
      status: "active",
    },
  ]
  
  