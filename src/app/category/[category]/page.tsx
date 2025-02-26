'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Product } from '@/types/product';
import ProductCard from '@/components/common/ProductCard';
import ProductFilters from '@/components/common/ProductFilters';
import { Box, Container, Typography, Grid, Fade } from '@mui/material';
import Link from 'next/link';
import { VALID_CATEGORIES, CategoryType, categoryTitles } from '@/data/categories';

interface Pagination {
  total: number;
  page: number;
  pages: number;
}

function isCategoryValid(category: string): category is CategoryType {
  return VALID_CATEGORIES.includes(category as CategoryType);
}

function CategoryPageClient() {
  const params = useParams();
  const router = useRouter();
  const categoryParam = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  const fetchProducts = async (page = 1) => {
    if (!isCategoryValid(categoryParam)) {
      router.push('/not-found');
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await api.getProducts({
        category: categoryParam,
        query: searchQuery,
        sort: sortOption,
        page,
      });
      
      const filteredProducts = data.products.filter(
        (product) => 
          product.price >= priceRange.min && 
          product.price <= (priceRange.max === Infinity ? product.price : priceRange.max)
      );
      
      setProducts(filteredProducts);
      setPagination(data.pagination);
      setError('');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryParam, searchQuery, sortOption, priceRange]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (sort: string) => {
    setSortOption(sort);
  };

  const handlePriceRange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  if (!isCategoryValid(categoryParam)) {
    return null;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Oops!
          </Typography>
          <Typography color="text.secondary">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Fade in timeout={800}>
        <div>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 2 }}>
              {categoryTitles[categoryParam as CategoryType].title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
              {categoryTitles[categoryParam as CategoryType].description}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ position: 'sticky', top: 24, bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
                <ProductFilters
                  onSearch={handleSearch}
                  onSort={handleSort}
                  onPriceRange={handlePriceRange}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={9}>
              {isLoading ? (
                <Grid container spacing={3}>
                  {[...Array(6)].map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ height: 400, bgcolor: 'grey.100', borderRadius: 2 }} />
                    </Grid>
                  ))}
                </Grid>
              ) : products.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 1
                }}>
                  <Typography variant="h5" color="text.primary" gutterBottom>
                    No Products Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {searchQuery || priceRange.max !== Infinity 
                      ? "Try adjusting your filters or search criteria"
                      : "We're currently restocking this category. Check back soon!"}
                  </Typography>
                  <Link href="/" passHref>
                    <Typography
                      component="a"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Return to Home
                    </Typography>
                  </Link>
                </Box>
              ) : (
                <Fade in timeout={500}>
                  <Grid container spacing={3}>
                    {products.map((product) => (
                      <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <ProductCard product={product} />
                      </Grid>
                    ))}
                  </Grid>
                </Fade>
              )}

              {pagination.pages > 1 && !isLoading && products.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <Box
                        key={page}
                        onClick={() => fetchProducts(page)}
                        sx={{
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          bgcolor: page === pagination.page ? 'primary.main' : 'transparent',
                          color: page === pagination.page ? 'primary.contrastText' : 'text.primary',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: page === pagination.page ? 'primary.dark' : 'action.hover',
                          },
                        }}
                      >
                        {page}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </div>
      </Fade>
    </Container>
  );
}

// Server Component
export default function CategoryPage({ params }: { params: { category: string } }) {
  if (!isCategoryValid(params.category)) {
    return null;
  }
  return <CategoryPageClient />;
} 