import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100); // Convert to cents
};

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100; // Convert from cents
};

export default stripe;
