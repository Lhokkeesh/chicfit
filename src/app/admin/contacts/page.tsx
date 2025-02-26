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
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon, Email as EmailIcon } from '@mui/icons-material';
import { format } from 'date-fns';

interface Contact {
  _id: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
}

const statusColors = {
  pending: 'warning',
  in_progress: 'info',
  resolved: 'success',
} as const;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data.contacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete contact');
      
      setContacts(contacts.filter(contact => contact._id !== contactId));
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Failed to delete contact');
    }
  };

  const handleStatusChange = async (contactId: string, newStatus: Contact['status']) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update contact status');
      
      setContacts(contacts.map(contact => 
        contact._id === contactId 
          ? { ...contact, status: newStatus }
          : contact
      ));
    } catch (err) {
      console.error('Error updating contact status:', err);
      alert('Failed to update contact status');
    }
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
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Contact Messages
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Inquiry Type</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.inquiryType}</TableCell>
                <TableCell>
                  <Tooltip title={contact.message}>
                    <Typography noWrap sx={{ maxWidth: 200 }}>
                      {contact.message}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={contact.status.replace('_', ' ')}
                    color={statusColors[contact.status]}
                    size="small"
                    onClick={() => {
                      const statuses: Contact['status'][] = ['pending', 'in_progress', 'resolved'];
                      const currentIndex = statuses.indexOf(contact.status);
                      const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                      handleStatusChange(contact._id, nextStatus);
                    }}
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Send Email">
                    <IconButton
                      href={`mailto:${contact.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={() => handleDeleteContact(contact._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 