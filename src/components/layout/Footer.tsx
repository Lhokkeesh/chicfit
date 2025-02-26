import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Divider,
  Stack,
} from '@mui/material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'grey.300', py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: 'grey.50', fontFamily: 'Cormorant Garamond', mb: 2 }}>
              ChicFit
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400' }}>
              Elevating your style with curated fashion essentials for the modern wardrobe.
            </Typography>
          </Grid>

          {/* Shop */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: 'grey.50', fontFamily: 'Cormorant Garamond', mb: 2 }}>
              Shop
            </Typography>
            <Stack spacing={1.5}>
              <MuiLink
                component={Link}
                href="/category/women"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Women&apos;s Collection
              </MuiLink>
              <MuiLink
                component={Link}
                href="/category/men"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Men&apos;s Collection
              </MuiLink>
              <MuiLink
                component={Link}
                href="/category/accessories"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Accessories
              </MuiLink>
            </Stack>
          </Grid>

          {/* Help */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: 'grey.50', fontFamily: 'Cormorant Garamond', mb: 2 }}>
              Help
            </Typography>
            <Stack spacing={1.5}>
              <MuiLink
                component={Link}
                href="/help"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Help Center
              </MuiLink>
              <MuiLink
                component={Link}
                href="/faq"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                FAQ
              </MuiLink>
              <MuiLink
                component={Link}
                href="/shipping"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Shipping Information
              </MuiLink>
              <MuiLink
                component={Link}
                href="/returns"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Returns & Exchanges
              </MuiLink>
              <MuiLink
                component={Link}
                href="/contact"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Contact Us
              </MuiLink>
            </Stack>
          </Grid>

          {/* Connect */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: 'grey.50', fontFamily: 'Cormorant Garamond', mb: 2 }}>
              Connect
            </Typography>
            <Stack spacing={1.5}>
              <MuiLink
                href="https://instagram.com/chicfit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Instagram
              </MuiLink>
              <MuiLink
                href="https://facebook.com/chicfit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Facebook
              </MuiLink>
              <MuiLink
                href="https://twitter.com/chicfit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Twitter
              </MuiLink>
              <MuiLink
                href="https://pinterest.com/chicfit"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
              >
                Pinterest
              </MuiLink>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: 'grey.800' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} ChicFit. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <MuiLink
              component={Link}
              href="/privacy"
              sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={Link}
              href="/terms"
              sx={{ color: 'inherit', '&:hover': { color: 'grey.100' } }}
            >
              Terms of Service
            </MuiLink>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
} 