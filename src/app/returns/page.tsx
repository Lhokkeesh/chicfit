'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useToast } from '@/hooks/useToast';
import toast from 'react-hot-toast';

interface ReturnItem {
  id: string;
  name: string;
  size: string;
  price: number;
  selected: boolean;
  reason: string;
}

const returnSteps = [
  {
    label: 'Start Return',
    description: 'Log into your account and locate your order in the order history.',
  },
  {
    label: 'Select Items',
    description: 'Choose the items you wish to return and specify the reason.',
  },
  {
    label: 'Print Label',
    description: 'Download and print your prepaid return shipping label.',
  },
  {
    label: 'Ship Items',
    description: 'Pack the items securely and attach the shipping label.',
  },
  {
    label: 'Refund',
    description: 'Receive your refund within 5-7 business days after we receive the return.',
  },
];

const eligibleItems = [
  'Unworn items in original condition',
  'Items with original tags attached',
  'Items in original packaging',
  'Items purchased within the last 30 days',
  'Items that are not final sale',
];

const ineligibleItems = [
  'Worn or damaged items',
  'Items without original tags',
  'Intimate apparel and swimwear',
  'Accessories (jewelry, bags, etc.) with damaged packaging',
  'Final sale items',
];

const returnReasons = [
  'Wrong size',
  'Not as described',
  'Changed mind',
  'Defective/damaged',
  'Received wrong item',
  'Other'
];

const shippingMethods = [
  'Drop off at carrier location',
  'Schedule pickup (additional fee may apply)'
];

export default function ReturnsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState<ReturnItem[]>([
    // Example items - replace with actual order items
    {
      id: '1',
      name: 'Classic T-Shirt',
      size: 'M',
      price: 29.99,
      selected: false,
      reason: ''
    },
    {
      id: '2',
      name: 'Slim Fit Jeans',
      size: 'L',
      price: 79.99,
      selected: false,
      reason: ''
    }
  ]);
  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleItemToggle = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleReasonChange = (itemId: string, reason: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, reason } : item
    ));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate form before setting submitting state
    const selectedItems = items.filter(item => item.selected).map(item => ({
      productId: item.id,
      name: item.name,
      size: item.size,
      price: item.price,
      reason: item.reason
    }));

    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }

    // Validate reasons
    const missingReasons = selectedItems.some(item => !item.reason);
    if (missingReasons) {
      toast.error('Please provide a reason for each selected item');
      return;
    }

    // Set submitting state after validation
    setSubmitting(true);

    try {
      // Create return request
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedItems,
          shippingMethod
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit return request');
      }

      // Show success message
      toast.success('Return request submitted successfully', {
        duration: 2000
      });
      
      // Navigate after the toast is shown
      setTimeout(() => {
        const confirmationUrl = `/returns/confirmation?id=${data.id}`;
        window.location.href = confirmationUrl;
      }, 2000);
    } catch (error: any) {
      console.error('Return submission error:', error);
      toast.error(error.message || 'Failed to submit return request');
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 4 }}>
            <CircularProgress size={40} color="inherit" />
            <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Submitting Return Request
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Please wait while we process your return request.
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif' }}>
        Return Items
      </Typography>
      <Typography color="text.secondary" paragraph>
        Please select the items you wish to return and provide a reason for each return.
      </Typography>

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Select Items to Return
          </Typography>
          {items.map((item) => (
            <Box key={item.id} sx={{ mb: 3, pb: 3, borderBottom: 1, borderColor: 'divider' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.selected}
                    onChange={() => handleItemToggle(item.id)}
                  />
                }
                label={
                  <Box>
                    <Typography>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.size} | Price: ${item.price}
                    </Typography>
                  </Box>
                }
              />
              {item.selected && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Select
                    value={item.reason}
                    onChange={(e) => handleReasonChange(item.id, e.target.value)}
                    displayEmpty
                    required
                  >
                    <MenuItem value="" disabled>Select a reason</MenuItem>
                    {returnReasons.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Please select a reason for return</FormHelperText>
                </FormControl>
              )}
            </Box>
          ))}
        </Paper>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Method
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
            >
              {shippingMethods.map((method) => (
                <FormControlLabel
                  key={method}
                  value={method}
                  control={<Radio />}
                  label={method}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ minWidth: 200 }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Submit Return Request'
            )}
          </Button>
        </Box>
      </form>
    </Container>
  );
} 