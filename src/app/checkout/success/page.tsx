'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Redirect to home if no orderId is present
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  // Don't render anything if there's no orderId
  if (!orderId) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleOutlineIcon
          sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
        />
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontFamily: '"Cormorant Garamond", serif',
            color: 'success.dark'
          }}
        >
          Order Confirmed!
        </Typography>
        <Typography color="text.secondary" paragraph>
          Thank you for your purchase. Your order #{orderId.slice(-6)} has been confirmed and will be processed shortly.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocalShippingOutlinedIcon color="primary" />
            <Typography>
              We'll send you shipping confirmation when your order ships
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmailOutlinedIcon color="primary" />
            <Typography>
              A confirmation email has been sent to your email address
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/account/orders')}
            sx={{ minWidth: 160 }}
          >
            View Orders
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            sx={{ 
              minWidth: 160,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 