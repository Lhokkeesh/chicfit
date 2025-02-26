import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '133.33%', // 3:4 aspect ratio
  backgroundColor: theme.palette.grey[100],
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  overflow: 'hidden',
}));

const StyledImage = styled(Image)({
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity: 1,
      selectedSize: product.sizes?.[0],
      selectedColor: product.colors?.[0],
    });
  };

  return (
    <StyledCard>
      <Link href={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
        <ImageContainer>
          <StyledImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </ImageContainer>
      </Link>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box mb={1}>
          <Chip
            label={product.category}
            size="small"
            sx={{
              backgroundColor: 'primary.light',
              color: 'primary.main',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>
        </Link>

        <Typography
          variant="h6"
          color="primary"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          ${product.price.toFixed(2)}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddToCart}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard; 