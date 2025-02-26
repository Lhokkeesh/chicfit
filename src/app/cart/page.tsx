'use client';

import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import Link from 'next/link';
import { Box, Container, Typography, Button, Divider, Paper } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CartPage() {
  const { items, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 'sm',
            mx: 'auto',
            py: { xs: 6, md: 8 },
          }}
        >
          <ShoppingBagOutlinedIcon
            sx={{
              fontSize: 64,
              color: 'primary.main',
              mb: 3,
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Your cart is empty
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 4,
              fontSize: '1.1rem',
            }}
          >
            Start exploring our collection to add items to your cart
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 600,
          color: 'text.primary',
          mb: { xs: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        Shopping Cart
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {items.map((item) => (
              <Box key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}>
                <CartItem item={item} />
                <Divider sx={{ my: 3 }} />
              </Box>
            ))}
          </Paper>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '380px' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              top: 24,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 600,
                mb: 3,
              }}
            >
              Order Summary
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">
                  Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </Typography>
                <Typography fontWeight="500">${total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight="500">Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography fontWeight="500">Total</Typography>
                <Typography fontWeight="600" color="primary.main" fontSize="1.2rem">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              component={Link}
              href="/checkout"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              Proceed to Checkout
            </Button>

            <Button
              component={Link}
              href="/"
              variant="text"
              fullWidth
              sx={{
                mt: 2,
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
} 