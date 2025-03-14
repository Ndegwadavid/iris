export type Client = {
    id: string
    reg_no: string
    first_name: string
    last_name: string
    date_of_birth: string
    phone_number: string
    email: string
    last_examination_date: string
  }
  
  const CLIENTS_API_URL = "http://127.0.0.1:8000/api/v001/clients/search/"
  
  export async function fetchClients(searchQuery: string = ""): Promise<Client[]> {
    try {
      const url = searchQuery ? `${CLIENTS_API_URL}?q=${encodeURIComponent(searchQuery)}` : CLIENTS_API_URL
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error response:", errorData)
        throw new Error(errorData.error || "Failed to fetch clients")
      }
      const data = await response.json()
      console.log("Raw API data:", data) // Debug raw response
      return Array.isArray(data) ? data : (data.results || []) // Handle paginated or array response
    } catch (error) {
      console.error("Fetch error:", error)
      return []
    }
  }