import React from 'react';
import { 
  Container, Typography, Button, Box, Grid, Card, CardContent,
  Divider, Paper, Stack, List, ListItem, ListItemIcon, ListItemText,
  useTheme, useMediaQuery, Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import logo from '../assets/logo.jpg';

const Feature = ({ title, description, icon }) => (
  <Card sx={{ 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 3,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 28px rgba(0, 207, 255, 0.25)',
    },
    background: 'linear-gradient(165deg, rgba(10,10,31,0.9) 0%, rgba(140,0,201,0.15) 100%)',
    border: '1px solid rgba(0, 207, 255, 0.1)',
  }}>
    <Box sx={{ 
      mb: 3,
      p: 2,
      borderRadius: '50%',
      background: 'rgba(0, 207, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {React.cloneElement(icon, { sx: { fontSize: 40, color: '#00CFFF' }})}
    </Box>
    <Typography variant="h6" gutterBottom sx={{ color: '#00CFFF', textAlign: 'center' }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: '#9FA9B4', textAlign: 'center' }}>
      {description}
    </Typography>
  </Card>
);

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A1F',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(140,0,201,0.15) 0%, rgba(10,10,31,0) 50%)',
      pt: 2,
      pb: 4
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
          background: 'linear-gradient(165deg, rgba(10,10,31,0.9) 0%, rgba(140,0,201,0.15) 100%)',
          borderRadius: 4,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4
          }}>
            <Avatar
              src={logo}
              alt="Dr. Mochanic"
              sx={{
                width: { xs: 120, md: 180 },
                height: { xs: 120, md: 180 },
                border: '2px solid #00CFFF',
                boxShadow: '0 0 20px rgba(0, 207, 255, 0.3)',
              }}
            />
          </Box>
          <Typography variant={isMobile ? "h3" : "h1"} sx={{ 
            color: '#00CFFF',
            mb: 2,
            background: 'linear-gradient(45deg, #00CFFF 30%, #8C00C9 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}>
            Dr. Mochanic's Dash
          </Typography>
          <Typography variant={isMobile ? "body1" : "h5"} sx={{ 
            color: '#9FA9B4', 
            mb: 4,
            maxWidth: '800px',
            mx: 'auto',
          }}>
            Your intelligent companion for instant dashboard light recognition and diagnosis
          </Typography>
          <Button 
            component={Link} 
            to="/camera" 
            variant="contained" 
            size="large"
            sx={{ 
              background: 'linear-gradient(45deg, #00CFFF 30%, #8C00C9 90%)',
              px: { xs: 3, md: 6 },
              py: { xs: 1.5, md: 2 },
              fontSize: { xs: '1rem', md: '1.2rem' },
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0, 207, 255, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Scanning
          </Button>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Feature 
              icon={<SearchIcon />}
              title="Instant Recognition"
              description="Advanced AI technology for quick and accurate dashboard light identification"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Feature 
              icon={<WifiOffIcon />}
              title="Works Offline"
              description="Full functionality without internet - use anywhere, anytime"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Feature 
              icon={<BuildIcon />}
              title="Expert Solutions"
              description="Get professional diagnostic insights and repair recommendations"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Feature 
              icon={<InfoIcon />}
              title="Comprehensive Database"
              description="Extensive library of dashboard lights from all major manufacturers"
            />
          </Grid>
        </Grid>

        {/* How to Use Section */}
        <Paper sx={{ 
          p: { xs: 3, md: 5 }, 
          background: 'linear-gradient(165deg, rgba(10,10,31,0.9) 0%, rgba(140,0,201,0.15) 100%)',
          borderRadius: 4,
          border: '1px solid rgba(0, 207, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 207, 255, 0.1)',
        }}>
          <Typography variant="h4" gutterBottom sx={{ 
            color: '#00CFFF', 
            textAlign: 'center', 
            mb: 4,
            background: 'linear-gradient(45deg, #00CFFF 30%, #8C00C9 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            How to Use
          </Typography>
          <List>
            {[
              { text: "Point your camera at any dashboard warning light", icon: <CameraAltIcon /> },
              { text: "Hold steady while the AI analyzes the symbol", icon: <SearchIcon /> },
              { text: "Get instant identification and diagnosis", icon: <CheckCircleIcon /> },
              { text: "Review detailed information and recommended solutions", icon: <BuildIcon /> }
            ].map((item, index) => (
              <ListItem key={index} sx={{ 
                py: 2,
                '&:hover': {
                  background: 'rgba(0, 207, 255, 0.05)',
                  transform: 'translateX(10px)',
                },
                transition: 'all 0.3s ease',
                borderRadius: 2,
              }}>
                <ListItemIcon sx={{ 
                  color: '#00CFFF',
                  minWidth: 50,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    color: '#9FA9B4',
                    '& .MuiListItemText-primary': {
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Call to Action */}
        <Box sx={{ 
          textAlign: 'center', 
          my: 8,
          p: { xs: 3, md: 5 },
          background: 'linear-gradient(165deg, rgba(10,10,31,0.9) 0%, rgba(140,0,201,0.15) 100%)',
          borderRadius: 4,
          border: '1px solid rgba(0, 207, 255, 0.1)',
        }}>
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
              px: { xs: 3, md: 6 },
              py: { xs: 1.5, md: 2 },
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0, 207, 255, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Scanning Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;