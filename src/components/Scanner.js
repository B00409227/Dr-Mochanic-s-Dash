import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import * as tf from '@tensorflow/tfjs';
import dashboardData from '../data/dashboard.json';

const Scanner = ({ onDetection }) => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastDetectionRef = useRef(null);

  const [isModelLoading, setIsModelLoading] = useState(true);

  useEffect(() => {
    initializeCamera();
    return () => cleanup();
  }, []);

  const initializeCamera = async () => {
    try {
      // Request camera access with higher resolution
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Wait for model to load
      console.log('Loading model...');
      const model = await tf.loadLayersModel('/models/model.json');
      console.log('Model loaded successfully');
      modelRef.current = model;
      
      setIsModelLoading(false);
      startPrediction();

    } catch (error) {
      console.error('Error initializing camera or model:', error);
    }
  };

  const startPrediction = () => {
    if (!modelRef.current || !videoRef.current) return;

    const predict = async () => {
      if (videoRef.current && 
          modelRef.current && 
          videoRef.current.videoWidth > 0 && 
          videoRef.current.videoHeight > 0) {
        try {
          // Process video frame
          const videoFrame = tf.browser.fromPixels(videoRef.current);
          
          // Preprocess image to match model's expected input
          const resized = tf.image.resizeBilinear(videoFrame, [224, 224]);
          const normalized = tf.div(resized, 255.0);
          const batched = normalized.expandDims(0);

          // Get prediction
          const prediction = await modelRef.current.predict(batched);
          const probabilities = await prediction.data();
          
          // Cleanup tensors
          tf.dispose([videoFrame, resized, normalized, batched, prediction]);

          // Find best match
          const maxProbability = Math.max(...probabilities);
          const classIndex = probabilities.indexOf(maxProbability);

          // Only detect if confidence is high enough and different from last detection
          if (maxProbability >= 0.85) {
            const warningLights = Object.values(dashboardData);
            if (classIndex < warningLights.length) {
              const lightData = warningLights[classIndex];
              
              // Check if this is a new detection
              if (lastDetectionRef.current?.name !== lightData.name) {
                console.log('New detection:', lightData.name, 'confidence:', maxProbability);
                lastDetectionRef.current = lightData;
                onDetection(lightData);
              }
            }
          } else {
            // Clear last detection if confidence drops
            if (lastDetectionRef.current !== null) {
              lastDetectionRef.current = null;
              onDetection(null);
            }
          }
        } catch (error) {
          console.error('Prediction error:', error);
        }
      }
      
      // Continue detection loop
      animationFrameRef.current = requestAnimationFrame(predict);
    };

    // Start prediction when video is ready
    videoRef.current.addEventListener('loadeddata', () => {
      console.log('Video ready, starting detection');
      predict();
    });
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (modelRef.current) {
      modelRef.current.dispose();
    }
    lastDetectionRef.current = null;
  };

  return (
    <Box sx={{
      width: '100%',
      height: '400px',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 2,
      backgroundColor: 'rgba(0,0,0,0.2)',
    }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {isModelLoading && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#00CFFF',
        }}>
          Loading model...
        </Box>
      )}
    </Box>
  );
};

export default Scanner;
