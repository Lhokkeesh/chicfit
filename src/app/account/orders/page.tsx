'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Divider,
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
  });
};

export default function OrdersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/auth/login?redirect=/account/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.getOrders();
        setOrders(response.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session, router]);

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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif' }}>
          My Orders
        </Typography>
        <Typography color="text.secondary">
          View and track your orders
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No orders found
          </Typography>
          <Typography color="text.secondary" paragraph>
            You haven't placed any orders yet.
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Order #{order._id.slice(-8)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Placed on {formatDate(order.createdAt)}
                        </Typography>
                      </Box>
                      <Chip
                        label={order.status.toUpperCase()}
                        sx={{
                          bgcolor: statusColors[order.status as keyof typeof statusColors]?.bg,
                          color: statusColors[order.status as keyof typeof statusColors]?.text,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ my: 2 }}>
                      {order.items.map((item) => (
                        <Box
                          key={item.product._id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              component="img"
                              src={item.product.image}
                              alt={item.product.name}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 1,
                              }}
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                {item.product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Qty: {item.quantity}
                                {item.selectedSize && ` | Size: ${item.selectedSize}`}
                                {item.selectedColor && ` | Color: ${item.selectedColor}`}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Box>
                        <Typography variant="subtitle2">
                          Total Amount
                        </Typography>
                        <Typography variant="h6" color="primary.main">
                          ${order.totalAmount.toFixed(2)}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        component={Link}
                        href={`/account/orders/${order._id}`}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
} 