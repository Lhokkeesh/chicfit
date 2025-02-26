'use client';

import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminPage && <Header />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {!isAdminPage && <Footer />}
    </Box>
  );
} 