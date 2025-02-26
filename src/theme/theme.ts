import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#bfa094',
      light: '#d2bab0',
      dark: '#a18072',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fbfaf8',
      paper: '#ffffff',
    },
    text: {
      primary: '#3d3527',
      secondary: '#637563',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 500,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 500,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 500,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
}); 