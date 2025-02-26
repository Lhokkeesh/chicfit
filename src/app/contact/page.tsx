'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useToast } from '@/hooks/useToast';

const inquiryTypes = [
  'Order Status',
  'Returns & Exchanges',
  'Product Information',
  'Shipping & Delivery',
  'Other',
];

interface ContactForm {
  name: string;
  email: string;
  orderNumber: string;
  inquiryType: string;
  message: string;
}

export default function ContactPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    orderNumber: '',
    inquiryType: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      showToast('success', 'Your message has been sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        orderNumber: '',
        inquiryType: '',
        message: '',
      });
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontFamily: '"Cormorant Garamond", serif',
            mb: 2 
          }}
        >
          Contact Us
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          We're here to help! Send us a message and we'll get back to you as soon as possible.
        </Typography>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ mb: 4 }}>
                <EmailIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6" gutterBottom>Email</Typography>
                <Typography color="text.secondary">
                  support@chicfit.com
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <PhoneIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6" gutterBottom>Phone</Typography>
                <Typography color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>

              <Box>
                <LocationOnIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6" gutterBottom>Address</Typography>
                <Typography color="text.secondary">
                  123 Fashion Street
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Order Number (Optional)"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    select
                    label="Inquiry Type"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                  >
                    {inquiryTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ 
                      minWidth: 200,
                      height: 48
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 