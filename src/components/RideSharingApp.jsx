import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';

const RoutePreviewMap = lazy(() => import('./RoutePreviewMap'));

const locationCoords = {
  'Cyril E. King Airport': { lat: 18.3373, lng: -64.9733 },
  'Charlotte Amalie': { lat: 18.3419, lng: -64.9307 },
  'Red Hook': { lat: 18.3248, lng: -64.867 }
};

export default function RideSharingApp() {
  const [pickup, setPickup] = useState('Cyril E. King Airport');
  const [dropoff, setDropoff] = useState('Red Hook');
  const [fare, setFare] = useState(null);

  const pickupCoords = locationCoords[pickup];
  const dropoffCoords = locationCoords[dropoff];

  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) return;
    const distance = Math.sqrt(
      Math.pow(pickupCoords.lat - dropoffCoords.lat, 2) +
        Math.pow(pickupCoords.lng - dropoffCoords.lng, 2)
    );
    const estimate = 8 + distance * 40;
    setFare(estimate.toFixed(2));
  }, [pickup, dropoff, pickupCoords, dropoffCoords]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Ride Sharing
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Pickup"
          select
          SelectProps={{ native: true }}
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {Object.keys(locationCoords).map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </TextField>

        <TextField
          label="Dropoff"
          select
          SelectProps={{ native: true }}
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          fullWidth
        >
          {Object.keys(locationCoords).map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </TextField>

        <Box mt={2}>
          <Typography>
            💰 Estimated Fare: <strong>{fare ? `$${fare}` : 'Calculating...'}</strong>
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ height: '300px', borderRadius: 1, overflow: 'hidden' }}>
        {pickupCoords && dropoffCoords ? (
          <Suspense fallback={<p>🧭 Loading map preview...</p>}>
            <RoutePreviewMap pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
          </Suspense>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Select pickup and dropoff to preview route.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
