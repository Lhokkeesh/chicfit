'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';

const termsContent = [
  {
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using this website, you accept and agree to be bound by these Terms of Service.',
      'If you do not agree to these terms, you must not use our website.',
      'We reserve the right to modify these terms at any time.',
      'Your continued use of the website constitutes acceptance of the modified terms.',
    ],
  },
  {
    title: 'Account Registration',
    content: [
      'You must be at least 18 years old to create an account.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You agree to provide accurate and complete information when creating an account.',
      'We reserve the right to suspend or terminate accounts that violate our terms.',
    ],
  },
  {
    title: 'Product Information',
    content: [
      'We strive to display accurate product information and pricing.',
      'Colors may vary due to monitor settings and photography.',
      'We reserve the right to limit quantities of any product.',
      'Prices are subject to change without notice.',
    ],
  },
  {
    title: 'Orders and Payment',
    content: [
      'All orders are subject to acceptance and availability.',
      'We reserve the right to refuse any order.',
      'Payment must be made in full at the time of ordering.',
      'We use secure payment processing systems.',
    ],
  },
  {
    title: 'Shipping and Delivery',
    content: [
      'Delivery times are estimates and not guaranteed.',
      'We are not responsible for delays beyond our control.',
      'Risk of loss passes to you upon delivery.',
      'Additional charges may apply for international shipping.',
    ],
  },
  {
    title: 'Returns and Refunds',
    content: [
      'Returns must be initiated within 30 days of purchase.',
      'Items must be unused and in original condition.',
      'Refunds will be processed to the original payment method.',
      'Shipping costs for returns are the customer\'s responsibility unless the item is defective.',
    ],
  },
  {
    title: 'Intellectual Property',
    content: [
      'All content on this website is our property or our licensors.',
      'You may not use our content without permission.',
      'Our trademarks may not be used without written consent.',
      'You retain ownership of content you submit to us.',
    ],
  },
  {
    title: 'Limitation of Liability',
    content: [
      'We are not liable for indirect or consequential damages.',
      'Our liability is limited to the amount paid for products.',
      'We do not guarantee uninterrupted access to our website.',
      'We are not responsible for third-party content.',
    ],
  },
];

export default function TermsPage() {
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
            Terms of Service
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Box>

        {/* Introduction */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" paragraph>
            Welcome to ChicFit. These Terms of Service govern your use of our website and services.
            Please read these terms carefully before using our website. By using our website,
            you agree to comply with and be bound by these terms.
          </Typography>
        </Paper>

        {/* Important Notice */}
        <Alert severity="info" sx={{ mb: 4 }}>
          Please note that these terms include important information about your legal rights,
          remedies, and obligations. By using our services, you agree to these terms.
        </Alert>

        {/* Terms Content Sections */}
        {termsContent.map((section) => (
          <Paper key={section.title} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {section.title}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              {section.content.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'text.secondary',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}

        {/* Contact Information */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms of Service, please contact us:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Email: legal@chicfit.com"
                sx={{ '& .MuiListItemText-primary': { color: 'text.secondary' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Address: 123 Fashion Street, New York, NY 10001"
                sx={{ '& .MuiListItemText-primary': { color: 'text.secondary' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Phone: 1-800-CHICFIT"
                sx={{ '& .MuiListItemText-primary': { color: 'text.secondary' } }}
              />
            </ListItem>
          </List>
        </Paper>

        {/* Footer Note */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            These terms are effective as of the date shown above and will remain in effect except
            with respect to any changes in its provisions in the future, which will be in effect
            immediately after being posted on this page.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
} 