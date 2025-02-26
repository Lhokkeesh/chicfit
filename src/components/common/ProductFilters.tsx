import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface ProductFiltersProps {
  onSearch: (query: string) => void;
  onSort: (sort: string) => void;
  onPriceRange: (min: number, max: number) => void;
}

export default function ProductFilters({ onSearch, onSort, onPriceRange }: ProductFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Handle price range change
  const handlePriceRangeChange = () => {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    onPriceRange(min, max);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Stack spacing={3} sx={{ width: '100%' }}>
        {/* Search */}
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            id="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>

        {/* Sort */}
        <FormControl fullWidth size="small">
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            id="sort"
            value={sortOption}
            label="Sort by"
            onChange={(e) => {
              setSortOption(e.target.value);
              onSort(e.target.value);
            }}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
          </Select>
        </FormControl>

        {/* Price Range */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2" gutterBottom>
            Price Range
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ width: '100%' }}
          >
            <TextField
              type="number"
              id="min-price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handlePriceRangeChange}
              placeholder="Min price"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              size="small"
              fullWidth
            />
            <TextField
              type="number"
              id="max-price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={handlePriceRangeChange}
              placeholder="Max price"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              size="small"
              fullWidth
            />
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
} 