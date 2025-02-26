'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import Link from 'next/link';

const steps = [
  'Return Submitted',
  'Return Review',
  'Return Approved',
  'Ship Items',
  'Refund Processed'
];

export default function ReturnConfirmationPage() {
  const searchParams = useSearchParams();
  const returnId = searchParams.get('id');
  const [returnDetails, setReturnDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturnDetails = async () => {
      try {
        if (!returnId) {
          setError('No return ID provided');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/returns?id=${returnId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch return details');
        }

        const data = await response.json();
        setReturnDetails(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReturnDetails();
  }, [returnId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !returnDetails) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          {error || 'Unable to load return details'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Return Request Submitted
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Return ID: {returnId}
          </Typography>
        </Box>

        <Stepper activeStep={0} alternativeLabel sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Return Details
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Items Being Returned:
            </Typography>
            {returnDetails.items.map((item: any, index: number) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography>
                  • {item.name} - Size: {item.size}
                </Typography>
                <Typography color="text.secondary" sx={{ ml: 2 }}>
                  Reason: {item.reason}
                </Typography>
              </Box>
            ))}
            <Typography sx={{ mt: 2 }}>
              <strong>Shipping Method:</strong> {returnDetails.shippingMethod}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Next Steps
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography component="div">
              <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Our team will review your return request within 1-2 business days.</li>
                <li>You will receive an email with a return shipping label once approved.</li>
                <li>Pack your items securely in their original condition.</li>
                <li>Attach the shipping label to your package.</li>
                <li>Drop off your package at the specified carrier location.</li>
              </ol>
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={Link}
            href="/orders"
            variant="contained"
            color="primary"
          >
            View Your Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 