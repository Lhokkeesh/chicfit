'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ReviewSection from '@/components/product/ReviewSection';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/useToast';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch product');
        }

        setProduct(data);
        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors?.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes && !selectedSize) {
      showToast('error', 'Please select a size');
      return;
    }

    if (product.colors && !selectedColor) {
      showToast('error', 'Please select a color');
      return;
    }

    addItem({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
    showToast('success', 'Added to cart');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Product not found'}
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ position: 'relative', paddingTop: '133%', borderRadius: 2, overflow: 'hidden' }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Chip
              label={product.category}
              color="primary"
              size="small"
              sx={{ mb: 2 }}
            />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif' }}>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              {product.description}
            </Typography>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Size
                </Typography>
                <ToggleButtonGroup
                  value={selectedSize}
                  exclusive
                  onChange={(_, newSize) => setSelectedSize(newSize)}
                  sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                >
                  {product.sizes.map((size) => (
                    <ToggleButton
                      key={size}
                      value={size}
                      sx={{
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      }}
                    >
                      {size}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Color
                </Typography>
                <ToggleButtonGroup
                  value={selectedColor}
                  exclusive
                  onChange={(_, newColor) => setSelectedColor(newColor)}
                  sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                >
                  {product.colors.map((color) => (
                    <ToggleButton
                      key={color}
                      value={color}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        p: 0,
                        border: '2px solid',
                        borderColor: selectedColor === color ? 'primary.main' : 'grey.300',
                        bgcolor: color.toLowerCase(),
                        '&:hover': {
                          bgcolor: color.toLowerCase(),
                        },
                        '&.Mui-selected': {
                          bgcolor: color.toLowerCase(),
                          '&:hover': {
                            bgcolor: color.toLowerCase(),
                          },
                        },
                      }}
                    />
                  ))}
                </ToggleButtonGroup>
              </Box>
            )}

            {/* Quantity Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                Quantity
              </Typography>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Add to Cart Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleAddToCart}
              startIcon={<AddShoppingCartIcon />}
              sx={{
                py: 1.5,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Add to Cart
            </Button>

            {/* Stock Status */}
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                color={product.stock > 0 ? 'success.main' : 'error.main'}
              >
                {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box sx={{ mt: 8 }}>
        <Suspense fallback={<CircularProgress />}>
          <ReviewSection productId={params.id as string} />
        </Suspense>
      </Box>
    </Container>
  );
} 