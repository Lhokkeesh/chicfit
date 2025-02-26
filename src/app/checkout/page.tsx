'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { api } from '@/services/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    cardNumber: process.env.NEXT_PUBLIC_TEST_CARD_NUMBER || '',
    expiryDate: process.env.NEXT_PUBLIC_TEST_CARD_EXPIRY || '',
    cvv: process.env.NEXT_PUBLIC_TEST_CARD_CVC || '',
  });

  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create order
      const response = await api.createOrder({
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        totalAmount: total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        paymentMethod: 'card',
      });

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/checkout/success?orderId=${response.orderId}`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'Something went wrong during checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={5} lg={4}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Order Summary
            </Typography>
            <Box sx={{ maxHeight: 400, overflowY: 'auto', my: 3 }}>
              {items.map((item) => (
                <Box key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} sx={{ mb: 2 }}>
                  <CartItem item={item} />
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography>Free</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary.main">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Checkout Form */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif', mb: 4 }}>
              Checkout Details
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mt: 2 }}>
                Shipping Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mt: 4 }}>
                Payment Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder={process.env.NEXT_PUBLIC_TEST_CARD_NUMBER}
                    helperText="Use the test card number shown in the placeholder"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Expiry Date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder={process.env.NEXT_PUBLIC_TEST_CARD_EXPIRY}
                    helperText="Use the test expiry date shown in the placeholder"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="CVV"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder={process.env.NEXT_PUBLIC_TEST_CARD_CVC}
                    helperText="Use the test CVV shown in the placeholder"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                sx={{ mt: 4, py: 1.5 }}
              >
                {isLoading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 