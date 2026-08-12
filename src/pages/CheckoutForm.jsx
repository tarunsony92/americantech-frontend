// CheckoutForm.jsx
import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (amount) => {
    const res = await axios.post('http://localhost:5000/api/create-payment-intent', {
      amount: amount * 100, // rupees ko paise mein convert
    });
    setClientSecret(res.data.clientSecret);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/payment-success',
      },
      redirect: 'if_required',
    });

    if (error) {
      console.error(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment successful!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default CheckoutForm;