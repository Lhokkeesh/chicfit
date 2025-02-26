'use client';

import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useToast } from '@/hooks/useToast';
import { TextField } from '@mui/material';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '80vh',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
}));

const HeroSlide = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  transition: 'opacity 0.5s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)',
    zIndex: 1,
  },
}));

const SliderButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  color: 'white',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const SliderDots = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
  display: 'flex',
  gap: '10px',
}));

const Dot = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: active ? 'white' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '400px',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)',
    zIndex: 1,
  },
}));

const categories = [
  {
    title: "Women's Collection",
    description: 'Discover our latest women\'s fashion collection',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070',
    link: '/category/women'
  },
  {
    title: "Men's Collection",
    description: 'Explore our men\'s fashion essentials',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1995',
    link: '/category/men'
  },
  {
    title: 'Accessories',
    description: 'Complete your look with our accessories',
    image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?q=80&w=2072',
    link: '/category/accessories'
  }
];

const features = [
  {
    title: 'Free Shipping',
    description: 'On orders over $100',
    icon: '🚚',
  },
  {
    title: 'Easy Returns',
    description: '30-day return policy',
    icon: '↩️',
  },
  {
    title: 'Secure Payment',
    description: 'Safe & secure checkout',
    icon: '🔒',
  },
];

const heroSlides = [
  {
    image: '/images/hero1.jpg',
    title: 'Discover Your Style',
    subtitle: 'Explore our curated collection of trendy fashion and accessories',
  },
  {
    image: '/images/hero2.jpeg',
    title: 'New Arrivals',
    subtitle: 'Shop the latest trends and must-have pieces',
  },
  {
    image: '/images/hero3.jpeg',
    title: 'Exclusive Collection',
    subtitle: 'Discover our premium selection of designer pieces',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      showToast('success', 'Successfully subscribed to our newsletter!');
      setEmail(''); // Clear the email input
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        {heroSlides.map((slide, index) => (
          <HeroSlide
            key={index}
            sx={{
              opacity: currentSlide === index ? 1 : 0,
              visibility: currentSlide === index ? 'visible' : 'hidden',
            }}
          >
            <Image
              src={slide.image}
              alt={`Hero Image ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <Container sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <Box maxWidth="600px">
                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 500,
                    mb: 2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    mb: 4,
                    fontWeight: 400,
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.4,
                  }}
                >
                  {slide.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/category/women"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </Container>
          </HeroSlide>
        ))}

        <SliderButton
          onClick={handlePrevSlide}
          sx={{ left: { xs: '10px', md: '40px' }, top: '50%', transform: 'translateY(-50%)' }}
        >
          <ArrowBackIosNewIcon />
        </SliderButton>
        <SliderButton
          onClick={handleNextSlide}
          sx={{ right: { xs: '10px', md: '40px' }, top: '50%', transform: 'translateY(-50%)' }}
        >
          <ArrowForwardIosIcon />
        </SliderButton>

        <SliderDots>
          {heroSlides.map((_, index) => (
            <Dot
              key={index}
              active={currentSlide === index}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </SliderDots>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature) => (
              <Grid item xs={12} sm={4} key={feature.title}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <Typography variant="h2" sx={{ fontSize: '2.5rem', mb: 2 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
            }}
          >
            Shop by Category
          </Typography>
          <Grid container spacing={4}>
            {categories.map((category) => (
              <Grid item xs={12} md={4} key={category.title}>
                <Link href={category.link} style={{ textDecoration: 'none' }}>
                  <CategoryCard>
                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                    <CardContent
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2,
                        color: 'white',
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: '"Cormorant Garamond", serif',
                          fontWeight: 600,
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Explore Collection →
                      </Typography>
                    </CardContent>
                  </CategoryCard>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box
        component="section"
        sx={{
          py: 8,
          px: 2,
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h2" component="h2" gutterBottom>
            Stay Updated
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Subscribe to our newsletter for exclusive offers and fashion updates.
          </Typography>
          <Box
            component="form"
            onSubmit={handleNewsletterSubmit}
            sx={{
              mt: 3,
              display: 'flex',
              gap: 1,
              maxWidth: 'sm',
              mx: 'auto',
            }}
          >
            <TextField
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ flexGrow: 1 }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                minWidth: 120,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
