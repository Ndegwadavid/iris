"use server";

import { api } from "@/lib";

export async function registerExamination(formData: FormData, id: string) {
  const rawCredentials = {
    examined_by: formData.get("examined_by") as string, 
    clinical_history: formData.get("clinical_history") as string,

    right_sph: parseFloat(formData.get("right_sph") as string),
    right_cyl: parseFloat(formData.get("right_cyl") as string),
    right_axis: parseInt(formData.get("right_axis") as string, 10),
    right_add: parseFloat(formData.get("right_add") as string),
    right_va: formData.get("right_va") as string,
    right_ipd: parseFloat(formData.get("right_ipd") as string),

    left_sph: parseFloat(formData.get("left_sph") as string),
    left_cyl: parseFloat(formData.get("left_cyl") as string),
    left_axis: parseInt(formData.get("left_axis") as string, 10),
    left_add: parseFloat(formData.get("left_add") as string),
    left_va: formData.get("left_va") as string,
    left_ipd: parseFloat(formData.get("left_ipd") as string),
  };

  try {
    const resp = await api(`clients/examination/${id}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawCredentials),
    });

    const data = await resp.json();
    console.log("Response:", data);

    return data;
  } catch (error) {
    console.error("Error registering examination:", error);
  }
}
