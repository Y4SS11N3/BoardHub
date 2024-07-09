import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { ReactComponent as GoogleLogo } from '../SocialLoginButtons/google-logo.svg';

const PasswordRegister = ({ email, password, setPassword, confirmPassword, setConfirmPassword, onBack, onRegister, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (password === confirmPassword) {
      onRegister();
    } else {
      // Handle password mismatch error
      console.log('Passwords do not match');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="center"
      flexGrow={1}
      sx={{
        backgroundColor: 'transparent',
        padding: '32px',
        maxWidth: '400px',
        margin: 'auto',
      }}
    >
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="body1" sx={{ color: '#333333', fontFamily: 'Montserrat, sans-serif' }}>
          Sign up with email
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ mb: 3, color: '#333333', fontFamily: 'Montserrat, sans-serif' }}>
        {email}
      </Typography>
      <Button
        variant="contained"
        fullWidth
        sx={{
          mb: 3,
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#333333' },
          textTransform: 'none',
          fontWeight: 'normal',
          height: '48px',
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingLeft: '25px',
          paddingRight: '50px',
        }}
      >
        <GoogleLogo style={{ marginRight: 8, width: 24, height: 24 }} />
        <span style={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>Continue with Google</span>
      </Button>
      <Typography variant="body2" sx={{ mb: 1, color: '#333333', fontFamily: 'Montserrat, sans-serif' }}>
        Create a password
      </Typography>
      <TextField
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Typography variant="body2" sx={{ mb: 1, color: '#333333', fontFamily: 'Montserrat, sans-serif' }}>
        Confirm password
      </Typography>
      <TextField
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleRegister}
        disabled={isLoading}
        sx={{
          backgroundColor: '#ff4081',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#ff4081' },
          textTransform: 'none',
          fontWeight: 'bold',
          height: '48px',
          borderRadius: '24px',
        }}
      >
        {isLoading ? 'Registering...' : 'Sign up'}
      </Button>
    </Box>
  );
};

export default PasswordRegister;