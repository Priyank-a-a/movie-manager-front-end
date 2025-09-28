import { createTheme } from '@mui/material/styles';

// Define the custom theme based on Figma design
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2ECC71', // Green from Figma
      light: '#4CD787',
      dark: '#28B463',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00485B', // Teal from Figma
      light: '#005A70',
      dark: '#003845',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#00485B', // Teal background from Figma
      paper: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      disabled: '#A0A0A0',
    },
    error: {
      main: '#E74C3C',
    },
    warning: {
      main: '#F39C12',
    },
    info: {
      main: '#3498DB',
    },
    success: {
      main: '#2ECC71',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '12px 16px',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#2ECC71',
          '&:hover': {
            backgroundColor: '#4CD787',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2ECC71',
            },
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '& .MuiInputLabel-root': {
            color: '#E0E0E0',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#E0E0E0',
          '&.Mui-checked': {
            color: '#2ECC71',
          },
        },
      },
    },
  },
});

export default theme;
