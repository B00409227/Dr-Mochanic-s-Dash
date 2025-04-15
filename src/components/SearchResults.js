import React, { useMemo } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
} from '@mui/material';
import dashboardData from '../data/dashboard.json';

const SearchResults = ({ searchQuery }) => {
  const filteredResults = useMemo(() => {
    if (!searchQuery) return [];
    
    return Object.entries(dashboardData)
      .filter(([_, light]) => 
        light.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        light.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 20); // Limit results to 20 items
  }, [searchQuery]);

  if (!searchQuery) {
    return (
      <Box sx={{ textAlign: 'center', color: '#9FA9B4', py: 4 }}>
        <Typography variant="body1">
          Enter a search term to find dashboard lights
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {filteredResults.map(([id, light]) => (
        <Grid item xs={12} md={6} key={id}>
          <Card sx={{
            height: '100%',
            background: 'linear-gradient(145deg, rgba(10,10,31,0.8) 0%, rgba(140,0,201,0.1) 100%)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 5px 20px rgba(0, 207, 255, 0.2)',
            },
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00CFFF', mb: 2 }}>
                {light.name}
              </Typography>
              <Chip 
                label={light.category} 
                size="small" 
                sx={{ 
                  mb: 2,
                  backgroundColor: 
                    light.category === 'Red' ? 'rgba(255, 0, 0, 0.2)' :
                    light.category === 'Yellow' ? 'rgba(255, 255, 0, 0.2)' :
                    'rgba(0, 255, 0, 0.2)',
                  color: '#9FA9B4',
                }} 
              />
              <Typography variant="body2" sx={{ color: '#9FA9B4', mb: 2 }}>
                {light.description}
              </Typography>
              <Typography variant="body2" sx={{ color: '#00CFFF' }}>
                Solution:
              </Typography>
              <Typography variant="body2" sx={{ color: '#9FA9B4' }}>
                {light.solution}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SearchResults; 