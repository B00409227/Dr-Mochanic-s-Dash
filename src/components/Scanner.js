import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper,
  LinearProgress,
  Fade,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import dashboardData from '../data/dashboard.json';  // Updated import path

const Scanner = ({ onDetection = () => {} }) => {
  const webcamRef = useRef(null);
  const webcamInstanceRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameRef = useRef(null); // Add this to track animation frame
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
  
  const [facingMode, setFacingMode] = useState('environment'); // Default to back camera
  
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

  const processFrame = useCallback(async () => {
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
  }, [warningData]);

  // Define the prediction loop function with useCallback
  const loop = useCallback(() => {
    if (webcamInstanceRef.current && modelRef.current) {
      processFrame();
      animationFrameRef.current = window.requestAnimationFrame(loop);
    }
  }, [processFrame]);

  // Initialize camera with better mobile support
  const initCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device/browser');
      }

      // Get available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      // Setup camera with preferred settings
      const constraints = {
        video: {
          facingMode: facingMode, // 'environment' for back camera, 'user' for front
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        }
      };

      // Get video stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (webcamRef.current) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true; // Important for iOS
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        
        webcamRef.current.innerHTML = '';
        webcamRef.current.appendChild(video);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initCamera();
    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (webcamRef.current?.querySelector('video')?.srcObject) {
        const tracks = webcamRef.current.querySelector('video').srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      {/* Camera Container */}
      <Paper elevation={3} sx={{ 
        position: 'relative',
        height: '80vh',
        overflow: 'hidden',
        bgcolor: '#000',
        borderRadius: 2
      }}>
        {/* Camera Feed */}
        <Box ref={webcamRef} sx={{
          width: '100%',
          height: '100%',
          '& > video': {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }
        }} />

        {/* Camera Controls */}
        <Box sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          p: 2,
          borderRadius: 5,
          bgcolor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Flip Camera Button - Switches between front/back cameras */}
          <Tooltip title="Switch Camera">
            <IconButton 
              onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
              sx={{ color: '#00CFFF' }}
            >
              <FlipCameraAndroidIcon />
            </IconButton>
          </Tooltip>

          {/* Capture Button - Takes a snapshot for analysis */}
          <Tooltip title="Analyze Warning Light">
            <IconButton 
              sx={{ 
                color: '#00CFFF',
                border: '2px solid #00CFFF',
                '&:hover': {
                  bgcolor: 'rgba(0,207,255,0.1)'
                }
              }}
            >
              <CameraAltIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.7)'
          }}>
            <CircularProgress sx={{ color: '#00CFFF' }} />
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#fff',
            p: 3
          }}>
            <Typography color="error">{error}</Typography>
            <Button 
              onClick={initCamera}
              variant="outlined" 
              sx={{ mt: 2, color: '#00CFFF' }}
            >
              Retry
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default memo(Scanner); 