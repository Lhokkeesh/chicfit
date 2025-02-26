'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';

const shippingMethods = [
  {
    method: 'Standard Shipping',
    time: '3-5 business days',
    cost: 'Free on orders over $100\n$7.95 for orders under $100',
  },
  {
    method: 'Express Shipping',
    time: '1-2 business days',
    cost: '$14.95',
  },
  {
    method: 'Next Day Delivery',
    time: 'Next business day',
    cost: '$24.95',
  },
  {
    method: 'International Standard',
    time: '7-14 business days',
    cost: 'Starting at $19.95',
  },
  {
    method: 'International Express',
    time: '3-5 business days',
    cost: 'Starting at $39.95',
  },
];

const shippingFeatures = [
  {
    title: 'Order Tracking',
    description: 'Track your package at any time with the tracking number provided in your shipping confirmation email.',
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Processing Time',
    description: 'Orders are typically processed within 1-2 business days before shipping.',
    icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'International Shipping',
    description: 'We ship to most countries worldwide. Customs fees may apply for international orders.',
    icon: <PublicIcon sx={{ fontSize: 40 }} />,
  },
];

export default function ShippingPage() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontFamily: '"Cormorant Garamond", serif',
              mb: 2,
            }}
          >
            Shipping Information
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Everything you need to know about our shipping services
          </Typography>
        </Box>

        {/* Shipping Features */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {shippingFeatures.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Shipping Methods Table */}
        <Paper sx={{ mb: 6 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Shipping Method</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Delivery Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shippingMethods.map((method) => (
                  <TableRow key={method.method}>
                    <TableCell>{method.method}</TableCell>
                    <TableCell>{method.time}</TableCell>
                    <TableCell>{method.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Additional Information */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 4 }}>
              All delivery times are estimated and may vary depending on your location and any potential delays.
            </Alert>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Processing
              </Typography>
              <Typography color="text.secondary" paragraph>
                Orders placed before 2 PM EST on business days are typically processed the same day.
                Orders placed after 2 PM EST or on weekends will be processed the next business day.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                International Orders
              </Typography>
              <Typography color="text.secondary" paragraph>
                International customers may be subject to customs duties and taxes upon delivery.
                These fees are not included in the shipping cost and are the responsibility of the customer.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 