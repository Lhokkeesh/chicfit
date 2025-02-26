'use client';

import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

const faqCategories = [
  {
    category: 'Orders',
    questions: [
      {
        question: 'How do I track my order?',
        answer: 'Once your order ships, you will receive a confirmation email with a tracking number. You can use this number to track your package on our website or the carrier\'s website.',
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'Orders can be modified or cancelled within 1 hour of placement. Please contact our customer service team immediately if you need to make changes to your order.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.',
      },
    ],
  },
  {
    category: 'Shipping',
    questions: [
      {
        question: 'How long will it take to receive my order?',
        answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business day delivery.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping times vary by location.',
      },
      {
        question: 'Is shipping free?',
        answer: 'We offer free standard shipping on orders over $100 within the continental United States.',
      },
    ],
  },
  {
    category: 'Returns',
    questions: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for unworn items in original condition with tags attached. Visit our Returns page for more details.',
      },
      {
        question: 'How do I start a return?',
        answer: 'To initiate a return, log into your account and go to your order history, or contact our customer service team.',
      },
      {
        question: 'Do I have to pay for return shipping?',
        answer: 'Returns are free for customers in the United States. International customers are responsible for return shipping costs.',
      },
    ],
  },
  {
    category: 'Product',
    questions: [
      {
        question: 'How do I find my size?',
        answer: 'Check our size guide for detailed measurements. Each product page includes specific sizing information.',
      },
      {
        question: 'Are your products authentic?',
        answer: 'Yes, all our products are 100% authentic and sourced directly from authorized manufacturers.',
      },
      {
        question: 'Can I get notified when an item is back in stock?',
        answer: 'Yes, click the "Notify Me" button on any out-of-stock item to receive an email when it\'s available.',
      },
    ],
  },
];

export default function FAQPage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

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
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Find answers to common questions about our products and services
          </Typography>
        </Box>

        {/* FAQ Categories Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            {faqCategories.map((category, index) => (
              <Tab
                key={category.category}
                label={category.category}
                id={`faq-tab-${index}`}
                sx={{ textTransform: 'none' }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* FAQ Accordions */}
        {faqCategories.map((category, index) => (
          <Box
            key={category.category}
            role="tabpanel"
            hidden={currentTab !== index}
            id={`faq-tabpanel-${index}`}
          >
            {currentTab === index && (
              <Box>
                {category.questions.map((faq, faqIndex) => (
                  <Accordion key={faqIndex} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary">{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>
        ))}

        {/* Contact Support Box */}
        <Paper sx={{ mt: 6, p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Still Have Questions?
          </Typography>
          <Typography color="text.secondary" paragraph>
            Our customer service team is here to help you with any other questions you may have.
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