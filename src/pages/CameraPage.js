import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  IconButton, 
  Box, 
  TextField,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  Fade,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BuildIcon from '@mui/icons-material/Build';
import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';
import SearchResults from '../components/SearchResults';

const CameraPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [detectedSymbol, setDetectedSymbol] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setDetectedSymbol(null); // Reset detection when switching tabs
  };

  const handleDetection = (symbol) => {
    console.log('Symbol detected:', symbol);
    setDetectedSymbol(symbol);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A1F',
      pt: 2,
      pb: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          px: 2,
        }}>
          <IconButton 
            onClick={() => navigate('/')} 
            sx={{ 
              mr: 2,
              color: '#00CFFF',
              '&:hover': {
                background: 'rgba(0, 207, 255, 0.1)',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ 
            color: '#FFFFFF',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <WarningAmberIcon sx={{ color: '#00CFFF' }} />
            Dashboard Scanner
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ 
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 2,
          mb: 3
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#00CFFF',
              },
              '& .Mui-selected': {
                color: '#00CFFF !important',
              }
            }}
          >
            <Tab 
              icon={<CameraAltIcon />} 
              label="Scan" 
              sx={{ color: '#9FA9B4' }}
            />
            <Tab 
              icon={<SearchIcon />} 
              label="Search" 
              sx={{ color: '#9FA9B4' }}
            />
          </Tabs>
        </Paper>

        {/* Content */}
        <Box>
          {/* Scan Tab */}
          <Fade in={activeTab === 0} unmountOnExit>
            <Box>
              {!detectedSymbol && (
                <Card sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                }}>
                  <CardContent sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2 
                  }}>
                    <BuildIcon sx={{ color: '#00CFFF' }} />
                    <Typography sx={{ color: '#9FA9B4' }}>
                      Position any warning light in the center of the frame
                    </Typography>
                  </CardContent>
                </Card>
              )}

              <Scanner onDetection={handleDetection} />

              {detectedSymbol && (
                <Alert 
                  severity="info"
                  icon={<WarningAmberIcon sx={{ color: '#00CFFF' }} />}
                  sx={{ 
                    mt: 3,
                    backgroundColor: 'rgba(0,207,255,0.1)',
                    color: '#FFFFFF',
                    '& .MuiAlert-icon': {
                      color: '#00CFFF'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: '#00CFFF' }}>
                    Warning Light Detected
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {detectedSymbol}
                  </Typography>
                </Alert>
              )}
            </Box>
          </Fade>

          {/* Search Tab */}
          <Fade in={activeTab === 1} unmountOnExit>
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for dashboard lights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#FFFFFF',
                    '& fieldset': {
                      borderColor: 'rgba(0, 207, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#00CFFF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00CFFF',
                    }
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#00CFFF' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <SearchResults searchQuery={searchQuery} />
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default CameraPage;
