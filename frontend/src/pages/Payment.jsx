import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createOrder, verifyPayment } from "../api/createPayment";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Payment() {
  const { id, category } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const orderResp = await createOrder(amount, category, id);
      const { order, key, payment_id } = orderResp;

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "CrowdFunding",
        description: `Donation for project ${category}/${id}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              payment_id
            );
            setMessage("✅ Payment successful! Thank you for your donation.");
            setTimeout(() => navigate(`/project/${id}`), 1800);
          } catch (err) {
            console.error("Verification failed", err);
            setMessage("⚠️ Payment succeeded but verification failed.");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Support This Project
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Every contribution helps us move closer to our goal.
        </p>

        {/* Donation Form */}
        <form onSubmit={handleDonate}>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Donation Amount (INR)
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="block w-full rounded-lg border border-gray-300 p-3 mb-6 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-lg font-medium transition-colors duration-200 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Processing..." : `Donate ₹${amount}`}
          </button>
        </form>

        {/* Message Section */}
        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.includes("successful")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Back link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-indigo-500 hover:text-indigo-700 underline"
          >
            ← Back to Project
          </button>
        </div>
      </div>
    </div>
  );
}
