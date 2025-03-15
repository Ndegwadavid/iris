"use server";

import { api } from "@/lib";

/**
 * Register Clients.
 *
 */

export async function registerClient(formData: FormData) {
  const rawCredentials = {
    branch: formData.get("branch") as string,
    first_name: formData.get("firstName") as string,
    last_name: formData.get("lastName") as string,
    dob: formData.get("dob") as string,
    phone_number: formData.get("phone_number") as string,
    email: formData.get("email") as string,
    location: formData.get("residence") as string,
    registered_by: formData.get("servedBy") as string,
    gender: formData.get("gender") as string,
    previous_prescription: (formData.get("previousRx") as string) || "",
  };

  const resp = await api("clients/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rawCredentials),
  });
  console.log(resp.booked);
  if (resp?.booked === 'true') {
    return {
      message: "Client  registered!",
      status: '201',
    };
  } else {
    return {
      message: "Data invalid!",
      status: '400',
    };
  }
}
