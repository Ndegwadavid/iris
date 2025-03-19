// lib/sales.ts
export type Examination = {
  id: string;
  client_name: string;
  client: {
    first_name: string;
    last_name: string;
    reg_no: string;
    last_examination_date: string;
  };
  examination_date: string;
  state: string;
  booked_for_sales: boolean;
};

export type Sale = {
  id: string;
  examination: Examination;
  frame_brand: string;
  lens_brand: string;
  total_price: number;
  order_paid: string;
};