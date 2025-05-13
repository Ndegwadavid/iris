"use server";

const BASE_URL = "http://127.0.0.1:8000/api/v001";

export const createStaff = async (data: any) => {
  const resp = await fetch(`${BASE_URL}/auth/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await resp.json(); 

  return responseData; 
};
