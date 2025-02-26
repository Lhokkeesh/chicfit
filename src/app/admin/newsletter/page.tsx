'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import { format } from 'date-fns';

interface Subscriber {
  _id: string;
  email: string;
  subscribed: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/newsletter');
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      const data = await response.json();
      setSubscribers(data.subscribers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/newsletter/${subscriberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete subscriber');

      setSubscribers(subscribers.filter(sub => sub._id !== subscriberId));
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      alert('Failed to delete subscriber');
    }
  };

  const handleExportCSV = () => {
    // Filter active subscribers
    const activeSubscribers = subscribers.filter(sub => sub.subscribed);
    
    // Create CSV content
    const csvContent = [
      ['Email', 'Subscribed Date'],
      ...activeSubscribers.map(sub => [
        sub.email,
        format(new Date(sub.subscribedAt), 'yyyy-MM-dd')
      ])
    ].map(row => row.join(',')).join('\\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `newsletter_subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Newsletter Subscribers
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
        >
          Export Active Subscribers
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subscribed Date</TableCell>
              <TableCell>Unsubscribed Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber._id}>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>
                  <Chip
                    label={subscriber.subscribed ? 'Active' : 'Unsubscribed'}
                    color={subscriber.subscribed ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(subscriber.subscribedAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {subscriber.unsubscribedAt
                    ? format(new Date(subscriber.unsubscribedAt), 'MMM d, yyyy')
                    : '-'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleDeleteSubscriber(subscriber._id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {subscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="textSecondary" py={3}>
                    No subscribers found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 