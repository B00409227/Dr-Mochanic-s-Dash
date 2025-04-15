import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper,
  LinearProgress,
  Fade,
  IconButton
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import dashboardData from '../data/dashboard.json';  // Updated import path

const Scanner = ({ onDetection = () => {} }) => {
  const webcamRef = useRef(null);
  const webcamInstanceRef = useRef(null);
  const modelRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consecutiveDetections, setConsecutiveDetections] = useState({});
  
  // Even stricter thresholds
  const CONFIDENCE_THRESHOLD = 0.995; // Increased to 99.5%
  const MIN_BRIGHTNESS_THRESHOLD = 60; // Increased brightness requirement
  const REQUIRED_CONSECUTIVE_FRAMES = 15; // Need more consecutive frames
  const DETECTION_COOLDOWN = 3000; // Longer cooldown between detections
  const MIN_CONTRAST_THRESHOLD = 40; // Higher contrast requirement
  const MIN_SYMBOL_SIZE = 0.20; // Symbol must be larger (20% of frame)
  const MAX_SYMBOL_SIZE = 0.60; // Symbol shouldn't be too large
  const MAX_PREDICTIONS_SHOWN = 1; // Only show the most confident prediction

  const [detectedWarning, setDetectedWarning] = useState(null);

  // Import dashboard data
  const [warningData] = useState(dashboardData);
  
  const checkFrameQuality = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Focus on a smaller center region (middle 30%)
    const centerStartX = Math.floor(canvas.width * 0.35);
    const centerEndX = Math.floor(canvas.width * 0.65);
    const centerStartY = Math.floor(canvas.height * 0.35);
    const centerEndY = Math.floor(canvas.height * 0.65);
    
    let centerBrightness = 0;
    let centerPixels = 0;
    let edgeBrightness = 0;
    let edgePixels = 0;
    let brightPixelsCount = 0;

    // Check for uniform lighting and proper centering
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        if (x >= centerStartX && x <= centerEndX && 
            y >= centerStartY && y <= centerEndY) {
          centerBrightness += pixelBrightness;
          centerPixels++;
          if (pixelBrightness > MIN_BRIGHTNESS_THRESHOLD) {
            brightPixelsCount++;
          }
        } else {
          edgeBrightness += pixelBrightness;
          edgePixels++;
        }
      }
    }

    const avgCenterBrightness = centerBrightness / centerPixels;
    const avgEdgeBrightness = edgeBrightness / edgePixels;
    const contrast = Math.abs(avgCenterBrightness - avgEdgeBrightness);
    const symbolSize = brightPixelsCount / (canvas.width * canvas.height);

    return {
      isGoodQuality: 
        avgCenterBrightness > MIN_BRIGHTNESS_THRESHOLD && // Center is bright enough
        contrast > MIN_CONTRAST_THRESHOLD && // Enough contrast
        avgCenterBrightness > (avgEdgeBrightness * 1.5) && // Center significantly brighter
        symbolSize >= MIN_SYMBOL_SIZE && // Symbol not too small
        symbolSize <= MAX_SYMBOL_SIZE && // Symbol not too large
        avgCenterBrightness < 250, // Avoid overexposed images
      brightness: avgCenterBrightness,
      contrast: contrast,
      symbolSize: symbolSize
    };
  };

  const processFrame = async () => {
    if (!webcamInstanceRef.current?.canvas || !modelRef.current) return;

    try {
      const quality = checkFrameQuality(webcamInstanceRef.current.canvas);
      if (!quality.isGoodQuality) {
        setPredictions([]);
        setDetectedWarning(null);
        return;
      }

      const predictions = await modelRef.current.predict(webcamInstanceRef.current.canvas);
      
      // Filter for high confidence predictions only
      const validPredictions = predictions
        .filter(p => p.probability > CONFIDENCE_THRESHOLD)
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 1); // Only show top match

      setPredictions(validPredictions);

      // Update detected warning with database info if confidence is high enough
      if (validPredictions.length > 0) {
        const bestMatch = validPredictions[0];
        const warningInfo = Object.values(warningData).find(
          w => w.name.toLowerCase() === bestMatch.className.toLowerCase()
        );
        
        if (warningInfo) {
          setDetectedWarning({
            ...warningInfo,
            confidence: bestMatch.probability
          });
        }
      } else {
        setDetectedWarning(null);
      }

    } catch (error) {
      console.error('Frame processing error:', error);
    }
  };

  useEffect(() => {
    let model, webcam;
    let isActive = true; // For cleanup
    
    const init = async () => {
      try {
        setIsLoading(true);
        
        // Wait for tmImage to be available
        if (!window.tmImage) {
          throw new Error('Teachable Machine library not loaded');
        }

        // Load the model
        console.log('Loading model...');
        model = await window.tmImage.load(
          '/models/model.json',
          '/models/metadata.json'
        );
        
        // Setup webcam
        console.log('Setting up webcam...');
        webcam = new window.tmImage.Webcam(200, 200, true);
        await webcam.setup();
        await webcam.play();
        
        // Add webcam canvas to DOM
        if (webcamRef.current && isActive) {
          webcamRef.current.innerHTML = ''; // Clear any existing content
          webcamRef.current.appendChild(webcam.canvas);
        }
        
        setIsLoading(false);
        
        // Start prediction loop
        const loop = async () => {
          if (!isActive) return; // Stop if component unmounted

          webcam.update();
          const predictions = await model.predict(webcam.canvas);
          
          if (isActive) {
            setPredictions(predictions);
            
            // Check for high confidence predictions
            const highConfidencePrediction = predictions.find(p => p.probability > 0.9);
            if (highConfidencePrediction) {
              try {
                onDetection(highConfidencePrediction.className);
              } catch (err) {
                console.error('Error in detection handler:', err);
              }
            }
            
            requestAnimationFrame(loop);
          }
        };
        
        if (isActive) {
          loop();
        }
      } catch (err) {
        console.error('Initialization error:', err);
        if (isActive) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };
    
    // Small delay to ensure scripts are loaded
    setTimeout(init, 1000);
    
    // Cleanup
    return () => {
      isActive = false;
      if (webcam) {
        webcam.stop();
      }
    };
  }, [onDetection]);

  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        Error: {error}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      {/* Camera View Container */}
      <Paper elevation={3} sx={{ 
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#000',
        aspectRatio: '4/3'
      }}>
        {/* Camera Feed */}
        <div ref={webcamRef} style={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} />

        {/* Scanning Overlay */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          border: '2px solid rgba(0, 207, 255, 0.5)',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <CenterFocusStrongIcon 
            sx={{ 
              fontSize: 48,
              color: 'rgba(0, 207, 255, 0.8)',
              animation: 'pulse 2s infinite'
            }} 
          />
        </Box>

        {/* Camera Controls */}
        <Box sx={{
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 2
        }}>
          <IconButton 
            sx={{ 
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <FlipCameraAndroidIcon />
          </IconButton>
          <IconButton 
            sx={{ 
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <CameraAltIcon />
          </IconButton>
        </Box>

        {/* Loading Overlay */}
        {isLoading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <CircularProgress sx={{ color: '#00CFFF' }} />
            <Typography color="white">
              Initializing camera...
            </Typography>
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Warning Details Panel */}
      {detectedWarning && (
        <Paper sx={{ 
          p: 2,
          bgcolor: detectedWarning.category === 'Red' 
            ? 'rgba(255, 0, 0, 0.1)' 
            : 'rgba(255, 165, 0, 0.1)',
          borderRadius: 2,
          border: `1px solid ${detectedWarning.category === 'Red' ? '#ff0000' : '#ffa500'}`
        }}>
          <Typography variant="h6" sx={{ 
            color: detectedWarning.category === 'Red' ? '#ff0000' : '#ffa500',
            mb: 1 
          }}>
            {detectedWarning.name}
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#fff', mb: 2 }}>
            Match Confidence: {(detectedWarning.confidence * 100).toFixed(0)}%
          </Typography>

          <Typography variant="subtitle2" sx={{ color: '#00CFFF', mb: 0.5 }}>
            Description:
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff', mb: 1.5 }}>
            {detectedWarning.description}
          </Typography>

          <Typography variant="subtitle2" sx={{ color: '#00CFFF', mb: 0.5 }}>
            Cause:
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff', mb: 1.5 }}>
            {detectedWarning.cause}
          </Typography>

          <Typography variant="subtitle2" sx={{ color: '#00CFFF', mb: 0.5 }}>
            Solution:
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            {detectedWarning.solution}
          </Typography>
        </Paper>
      )}

      {/* Animation Styles */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 0.5; }
          }
        `}
      </style>
    </Box>
  );
};

export default Scanner; 