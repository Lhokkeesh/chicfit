import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Box, Typography, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (e: any) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item._id, newQuantity);
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          width: { xs: 80, sm: 120 },
          height: { xs: 100, sm: 150 },
          borderRadius: 2,
          overflow: 'hidden',
          flexShrink: 0,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            {item.name}
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textTransform: 'capitalize',
            mb: 1,
          }}
        >
          {item.category}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {item.selectedSize && (
            <Typography variant="body2" color="text.secondary">
              Size: {item.selectedSize}
            </Typography>
          )}
          {item.selectedColor && (
            <Typography variant="body2" color="text.secondary">
              Color: {item.selectedColor}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={item.quantity}
              onChange={handleQuantityChange}
              sx={{
                '& .MuiSelect-select': {
                  py: 1,
                },
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            onClick={() => removeItem(item._id)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
              },
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem; 