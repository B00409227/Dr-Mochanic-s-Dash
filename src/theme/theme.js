import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0A0A1F',
      paper: '#0F0F2B',
    },
    primary: {
      main: '#00CFFF',
      light: '#33D7FF',
      dark: '#00A3CC',
      contrastText: '#000000',
    },
    secondary: {
      main: '#8C00C9',
      light: '#A033D4',
      dark: '#6F00A1',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#9FA9B4',
      disabled: '#444A59',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(0, 207, 255, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(0, 207, 255, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0F0F2B',
          borderRadius: 16,
          border: '1px solid rgba(140, 0, 201, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A1F',
          boxShadow: '0 4px 20px rgba(0, 207, 255, 0.08)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0, 207, 255, 0.05)',
    '0 4px 8px rgba(0, 207, 255, 0.08)',
    // ... add more shadow definitions if needed
  ],
});

export default theme;