'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import { useToast } from '@/hooks/useToast';

const steps = ['Select Items', 'Return Reason', 'Shipping Method', 'Review'];

const returnReasons = [
  'Wrong size',
  'Not as described',
  'Changed mind',
  'Defective/damaged',
  'Received wrong item',
  'Other',
];

interface ReturnItem {
  id: string;
  name: string;
  size: string;
  price: number;
  selected: boolean;
  reason: string;
}

export default function ReturnPage() {
  const { showToast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [items, setItems] = useState<ReturnItem[]>([
    {
      id: '1',
      name: 'Classic White T-Shirt',
      size: 'M',
      price: 29.99,
      selected: false,
      reason: '',
    },
    {
      id: '2',
      name: 'Slim Fit Jeans',
      size: 'L',
      price: 79.99,
      selected: false,
      reason: '',
    },
  ]);
  const [shippingMethod, setShippingMethod] = useState('prepaid');

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmitReturn();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleItemSelection = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleReasonChange = (id: string, reason: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, reason } : item
    ));
  };

  const handleSubmitReturn = async () => {
    try {
      // Here you would typically send the return request to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('success', 'Return request submitted successfully!');
      // Redirect to orders page or show success screen
    } catch (error) {
      showToast('error', 'Failed to submit return request. Please try again.');
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper sx={{ p: 3 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography color="text.secondary">Size: {item.size}</Typography>
                      <Typography color="text.secondary">${item.price}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.selected}
                            onChange={() => handleItemSelection(item.id)}
                          />
                        }
                        label="Select for return"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            {items.filter(item => item.selected).map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.name}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label="Return Reason"
                    value={item.reason}
                    onChange={(e) => handleReasonChange(item.id, e.target.value)}
                    required
                  >
                    {returnReasons.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Choose Shipping Method
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={shippingMethod === 'prepaid'}
                      onChange={() => setShippingMethod('prepaid')}
                    />
                  }
                  label="Prepaid Return Label (Free)"
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  We'll email you a prepaid return shipping label once your return is approved.
                </Alert>
              </Grid>
            </Grid>
          </Paper>
        );

      case 3:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Return Request
            </Typography>
            <Grid container spacing={3}>
              {items.filter(item => item.selected).map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography color="text.secondary">
                      Reason: {item.reason}
                    </Typography>
                    <Typography color="text.secondary">
                      Refund Amount: ${item.price}
                    </Typography>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Alert severity="info">
                  Once you submit your return request, we'll review it and send you a confirmation
                  email with the next steps and your return shipping label.
                </Alert>
              </Grid>
            </Grid>
          </Paper>
        );

      default:
        return 'Unknown step';
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return items.some(item => item.selected);
      case 1:
        return items.filter(item => item.selected)
          .every(item => item.reason);
      case 2:
        return Boolean(shippingMethod);
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontFamily: '"Cormorant Garamond", serif' }}>
          Start a Return
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {activeStep === steps.length - 1 ? 'Submit Return' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 