export function generateClientId(clientId: number): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    return `M/${year}/${month}/${String(clientId).padStart(4, "0")}`
  }
  
  