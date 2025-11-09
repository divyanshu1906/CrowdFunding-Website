import api from "./axios";

export async function createOrder(amount, category, project_id) {
  // amount in rupees (decimal/number)
  const res = await api.post("payments/create-order/", { amount, category, project_id });
  return res.data;
}

export async function verifyPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature, payment_id) {
  const res = await api.post("payments/verify/", {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    payment_id,
  });
  return res.data;
}
