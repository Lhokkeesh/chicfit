'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Link from 'next/link';
import { api } from '@/services/api';
import { Order } from '@/types/order';

const statusColors = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  processing: { bg: '#DBEAFE', text: '#1E40AF' },
  shipped: { bg: '#D1FAE5', text: '#065F46' },
  delivered: { bg: '#ECFDF5', text: '#064E3B' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    if (!session) {
      router.push('/auth/login?redirect=/account/orders');
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await api.getOrder(params.id as string);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, session, router]);

  const handleStatusChange = async (newStatus: typeof validStatuses[number]) => {
    try {
      setIsUpdating(true);
      await api.updateOrderStatus(params.id as string, newStatus);
      
      // Refresh order data
      const data = await api.getOrder(params.id as string);
      setOrder(data);
    } catch (error) {
      console.error('Failed to update order status:', error);
      // You might want to show an error message to the user
    } finally {
      setIsUpdating(false);
    }
  };

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>
            {error || 'Order not found'}
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/account/orders"
            sx={{ mt: 2 }}
          >
            Back to Orders
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/account/orders"
          variant="text"
          sx={{ mb: 2 }}
        >
          ← Back to Orders
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif' }}>
          Order Details
        </Typography>
        <Typography color="text.secondary">
          Order #{order._id.slice(-8)}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Items
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {order.items.map((item) => (
              <Box
                key={item.product._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 'none',
                    pb: 0,
                    mb: 0,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src={item.product.image}
                    alt={item.product.name}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                      {item.selectedSize && ` | Size: ${item.selectedSize}`}
                      {item.selectedColor && ` | Color: ${item.selectedColor}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)} each
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle1">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Order Status
              </Typography>
              {isAdmin ? (
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    value={order.status}
                    label="Status"
                    onChange={(e) => handleStatusChange(e.target.value as typeof validStatuses[number])}
                    disabled={isUpdating}
                  >
                    {validStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Chip
                  label={order.status.toUpperCase()}
                  sx={{
                    bgcolor: statusColors[order.status as keyof typeof statusColors]?.bg,
                    color: statusColors[order.status as keyof typeof statusColors]?.text,
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payment Status
              </Typography>
              <Typography variant="body1">
                {order.paymentStatus.toUpperCase()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payment Method
              </Typography>
              <Typography variant="body1">
                {order.paymentMethod}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Order Date
              </Typography>
              <Typography variant="body1">
                {formatDate(order.createdAt)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h5" color="primary.main">
                ${order.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.country}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {order.shippingAddress.email}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 