'use client';

import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';

export default function NotFound() {
  return (
    <Container
      sx={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        py: 4,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '4rem', md: '6rem' },
          fontFamily: '"Cormorant Garamond", serif',
          color: 'primary.main',
          mb: 2,
        }}
      >
        404
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          mb: 3,
        }}
      >
        Page Not Found
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: '600px' }}
      >
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Typography>
      <Link href="/" passHref>
        <Button
          variant="contained"
          size="large"
          sx={{
            textTransform: 'none',
            px: 4,
          }}
        >
          Back to Home
        </Button>
      </Link>
    </Container>
  );
} 