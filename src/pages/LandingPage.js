import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

const Feature = ({ title, description, icon }) => (
  <Card sx={{ 
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 6,
    },
    background: 'linear-gradient(145deg, rgba(10,10,31,0.8) 0%, rgba(140,0,201,0.1) 100%)',
  }}>
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      {icon}
      <Typography variant="h6" gutterBottom sx={{ mt: 2, color: '#00CFFF' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#9FA9B4' }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const Instruction = ({ text, icon }) => (
  <ListItem sx={{ py: 1 }}>
    <ListItemIcon sx={{ color: '#00CFFF' }}>
      {icon}
    </ListItemIcon>
    <ListItemText 
      primary={text} 
      sx={{ color: '#9FA9B4' }}
    />
  </ListItem>
);

const LandingPage = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ 
        my: 8, 
        textAlign: 'center',
        background: 'linear-gradient(145deg, rgba(10,10,31,0.9) 0%, rgba(140,0,201,0.2) 100%)',
        borderRadius: 4,
        p: 6,
      }}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 700,
            background: 'linear-gradient(45deg, #00CFFF 30%, #8C00C9 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 3,
          }}
        >
          Dr. Mochanic's Dash
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#9FA9B4',
            mb: 4,
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          Your intelligent companion for instant dashboard light recognition and diagnosis
        </Typography>
        <Button 
          component={Link} 
          to="/camera" 
          variant="contained" 
          size="large" 
          startIcon={<CameraAltIcon />}
          sx={{ 
            py: 2, 
            px: 4,
            fontSize: '1.2rem',
            background: 'linear-gradient(45deg, #00CFFF 30%, #8C00C9 90%)',
            boxShadow: '0 3px 15px rgba(0, 207, 255, 0.3)',
            '&:hover': {
              boxShadow: '0 5px 20px rgba(0, 207, 255, 0.5)',
            }
          }}
        >
          Start Scanning
        </Button>
      </Box>

      {/* Features Section */}
      <Typography variant="h4" sx={{ mb: 4, color: '#00CFFF', textAlign: 'center' }}>
        Key Features
      </Typography>
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Feature 
            title="Instant Recognition" 
            description="Advanced AI technology for quick and accurate dashboard light identification"
            icon={<SearchIcon sx={{ fontSize: 40, color: '#00CFFF' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Feature 
            title="Works Offline" 
            description="Full functionality without internet connection - use anywhere, anytime"
            icon={<WifiOffIcon sx={{ fontSize: 40, color: '#00CFFF' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Feature 
            title="Expert Solutions" 
            description="Get professional diagnostic information and repair recommendations"
            icon={<BuildIcon sx={{ fontSize: 40, color: '#00CFFF' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Feature 
            title="Comprehensive Database" 
            description="Extensive library of dashboard lights from all major car manufacturers"
            icon={<InfoIcon sx={{ fontSize: 40, color: '#00CFFF' }} />}
          />
        </Grid>
      </Grid>

      {/* How to Use Section */}
      <Paper sx={{ 
        p: 4, 
        mt: 4, 
        background: 'linear-gradient(145deg, rgba(10,10,31,0.8) 0%, rgba(140,0,201,0.1) 100%)',
        borderRadius: 4,
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#00CFFF', textAlign: 'center', mb: 4 }}>
          How to Use
        </Typography>
        <List>
          <Instruction 
            text="Point your camera at any dashboard warning light"
            icon={<CameraAltIcon />}
          />
          <Instruction 
            text="Hold steady while the AI analyzes the symbol"
            icon={<SearchIcon />}
          />
          <Instruction 
            text="Get instant identification and diagnosis"
            icon={<CheckCircleIcon />}
          />
          <Instruction 
            text="Review detailed information and recommended solutions"
            icon={<BuildIcon />}
          />
        </List>
      </Paper>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography variant="h5" sx={{ color: '#9FA9B4', mb: 3 }}>
          Ready to decode your dashboard?
        </Typography>
        <Button 
          component={Link} 
          to="/camera" 
          variant="contained" 
          size="large"
          sx={{ 
            background: 'linear-gradient(45deg, #00CFFF 30%, #8C00C9 90%)',
            px: 4,
            py: 2,
          }}
        >
          Start Scanning Now
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;