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
} from '@mui/material';

const privacyContent = [
  {
    title: 'Information We Collect',
    content: [
      'Personal information (name, email, address, phone number)',
      'Payment information (processed securely through our payment providers)',
      'Order history and preferences',
      'Device and browser information',
      'Cookies and usage data',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: [
      'Process and fulfill your orders',
      'Communicate with you about your orders and account',
      'Send marketing communications (with your consent)',
      'Improve our website and services',
      'Prevent fraud and maintain security',
    ],
  },
  {
    title: 'Information Sharing',
    content: [
      'Service providers (payment processors, shipping carriers)',
      'Legal requirements and law enforcement',
      'Business transfers (mergers, acquisitions)',
      'With your consent',
      'Never sold to third parties for marketing',
    ],
  },
  {
    title: 'Your Rights',
    content: [
      'Access your personal information',
      'Correct inaccurate information',
      'Request deletion of your information',
      'Opt-out of marketing communications',
      'Data portability',
    ],
  },
  {
    title: 'Data Security',
    content: [
      'SSL/TLS encryption for data transmission',
      'Secure payment processing',
      'Regular security assessments',
      'Limited employee access',
      'Data breach notification procedures',
    ],
  },
  {
    title: 'Cookies Policy',
    content: [
      'Essential cookies for site functionality',
      'Analytics cookies to improve service',
      'Marketing cookies (with consent)',
      'Third-party cookies',
      'Cookie preferences management',
    ],
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Box>

        {/* Introduction */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" paragraph>
            At ChicFit, we take your privacy seriously. This Privacy Policy describes how we collect,
            use, and protect your personal information when you use our website and services.
            By using our website, you agree to the collection and use of information in accordance
            with this policy.
          </Typography>
        </Paper>

        {/* Privacy Content Sections */}
        {privacyContent.map((section, index) => (
          <Paper key={section.title} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {section.title}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              {section.content.map((item, itemIndex) => (
                <ListItem key={itemIndex}>
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
        <Paper sx={{ p: 4, mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Contact Us About Privacy
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Email: privacy@chicfit.com"
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
            This privacy policy is subject to change. We will notify you of any material changes
            by posting the new policy on this page.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
} 