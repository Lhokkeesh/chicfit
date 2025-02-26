'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '@/context/CartContext';
import { signOut, useSession } from 'next-auth/react';

const navigation = [
  { name: 'Women', href: '/category/women' },
  { name: 'Men', href: '/category/men' },
  { name: 'Accessories', href: '/category/accessories' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="sticky" color="inherit" sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 64 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            href="/"
            sx={{
              fontFamily: 'Cormorant Garamond',
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
            }}
          >
            ChicFit
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 8 }}>
            {navigation.map((item) => (
              <Button
                key={item.name}
                component={Link}
                href={item.href}
                sx={{
                  mx: 2,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {item.name}
              </Button>
            ))}
            {session && (
              <Button
                component={Link}
                href="/account/orders"
                sx={{
                  mx: 2,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Orders
              </Button>
            )}
          </Box>

          {/* Desktop Actions */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <IconButton
              component={Link}
              href="/cart"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={itemCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {session ? (
              <Button
                onClick={handleLogout}
                variant="outlined"
                color="primary"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                component={Link}
                href="/auth/login"
                variant="outlined"
                color="primary"
              >
                Sign In
              </Button>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navigation.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
            {session && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Orders" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary="Cart" />
                {itemCount > 0 && (
                  <Badge badgeContent={itemCount} color="primary" sx={{ ml: 1 }} />
                )}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              {session ? (
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
              ) : (
                <ListItemButton
                  component={Link}
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              )}
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
} 