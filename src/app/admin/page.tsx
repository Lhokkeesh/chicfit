'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  Mail as ContactsIcon,
} from '@mui/icons-material';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalContacts: number;
  recentOrders: Array<{
    _id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <OrdersIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <ProductsIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    },
    {
      title: 'Total Contacts',
      value: stats?.totalContacts || 0,
      icon: <ContactsIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                borderRadius: 2,
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              }}
            >
              {card.icon}
              <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
                {card.value}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <List>
                {stats?.recentOrders?.map((order) => (
                  <Box key={order._id}>
                    <ListItem>
                      <ListItemText
                        primary={`Order #${order._id.slice(-6)}`}
                        secondary={`$${order.totalAmount} - ${order.status}`}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Users
              </Typography>
              <List>
                {stats?.recentUsers?.map((user) => (
                  <Box key={user._id}>
                    <ListItem>
                      <ListItemText
                        primary={user.name}
                        secondary={user.email}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 