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
  const CLIENT_DETAIL_API_URL = "http://127.0.0.1:8000/api/v001/clients/"
  
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
      return Array.isArray(data) ? data : (data.results || [])
    } catch (error) {
      console.error("Fetch error:", error)
      return []
    }
  }
  
  export async function fetchClientById(id: string): Promise<Client | null> {
    try {
      const response = await fetch(`${CLIENT_DETAIL_API_URL}${id}/`, {
        method: "GET",
        credentials: "include",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch client")
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching client:", error)
      return null
    }
  }