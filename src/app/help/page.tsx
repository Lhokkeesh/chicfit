'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import Link from 'next/link';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

const helpTopics = [
  {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about orders, shipping, returns, and more.',
    icon: <HelpOutlineIcon sx={{ fontSize: 40 }} />,
    link: '/faq',
  },
  {
    title: 'Shipping Information',
    description: 'Learn about our shipping methods, delivery times, and tracking your order.',
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    link: '/shipping',
  },
  {
    title: 'Returns & Exchanges',
    description: 'Understand our return policy and how to initiate a return or exchange.',
    icon: <AssignmentReturnIcon sx={{ fontSize: 40 }} />,
    link: '/returns',
  },
  {
    title: 'Contact Us',
    description: 'Get in touch with our customer service team for personalized assistance.',
    icon: <ContactSupportIcon sx={{ fontSize: 40 }} />,
    link: '/contact',
  },
];

export default function HelpPage() {
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
            Help Center
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            How can we assist you today?
          </Typography>
        </Box>

        {/* Help Topics Grid */}
        <Grid container spacing={4}>
          {helpTopics.map((topic) => (
            <Grid item xs={12} sm={6} key={topic.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{topic.icon}</Box>
                  <Typography variant="h5" gutterBottom>
                    {topic.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {topic.description}
                  </Typography>
                  <Button
                    component={Link}
                    href={topic.link}
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Help Box */}
        <Paper sx={{ mt: 6, p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Need More Help?
          </Typography>
          <Typography color="text.secondary" paragraph>
            Our customer service team is available Monday through Friday, 9am to 5pm EST.
          </Typography>
          <Button
            component={Link}
            href="/contact"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Contact Support
          </Button>
        </Paper>
      </Container>
    </Box>
  );
} 