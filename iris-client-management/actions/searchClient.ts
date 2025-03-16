"use server";

import { api } from "@/lib";

// Search for a client by first name, last name, phone number or email

// Usage:
// const {data} = useFetch(searchClient, 'Peter')


export const searchClient = async (query: string) => {
    const response = await api(
      `clients/search-client/?q=${query}`,
      {
        method: "GET",
      }
    );

    return response;
}
