// lib/sales.ts

export type Examination = {
    id: string
    client_name: string
    client: {
      first_name: string
      last_name: string
      reg_no: string
      last_examination_date: string
    }
    examination_date: string
    state: string
    booked_for_sales: boolean
  }
  
  export type Sale = {
    id: string
    examination: {
      client_name: string
    }
    frame_brand: string
    lens_brand: string
    total_price: number
    order_paid: string
  }
  
  const API_URL = "http://127.0.0.1:8000/api/v001/clients/sales/"
  const EXAMINATIONS_URL = "http://127.0.0.1:8000/api/v001/clients/examinations/"
  
  export async function fetchCompletedExaminations(): Promise<Examination[]> {
    try {
      const response = await fetch(EXAMINATIONS_URL, {
        method: "GET",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch examinations")
      const data = await response.json()
      // Filter for completed examinations on the frontend
      return data.d.filter((exam: Examination) => exam.state === "Completed")
    } catch (error) {
      console.error("Error fetching examinations:", error)
      throw error
    }
  }
  
  export async function fetchFilteredExaminations(searchQuery: string): Promise<Examination[]> {
    try {
      // For now, fetch all and filter client-side; we can add a backend search later
      const response = await fetch(EXAMINATIONS_URL, {
        method: "GET",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch filtered examinations")
      const data = await response.json()
      const completedExams = data.d.filter((exam: Examination) => exam.state === "Completed")
      if (!searchQuery) return completedExams
      return completedExams.filter(
        (exam: Examination) =>
          exam.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.client.reg_no.toLowerCase().includes(searchQuery.toLowerCase())
      )
    } catch (error) {
      console.error("Error filtering examinations:", error)
      throw error
    }
  }
  
  export async function fetchRecentSales(): Promise<Sale[]> {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch sales")
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching sales:", error)
      throw error
    }
  }
  
  export async function createSale(payload: any): Promise<any> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create sale")
      }
      return await response.json()
    } catch (error) {
      console.error("Error creating sale:", error)
      throw error
    }
  }