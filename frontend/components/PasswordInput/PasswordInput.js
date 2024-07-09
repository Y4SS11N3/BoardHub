import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { ReactComponent as GoogleLogo } from '../SocialLoginButtons/google-logo.svg';

const PasswordInput = ({ email, password, setPassword, onBack, onLogin, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState(false);

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
          Log in with email
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
        Or enter password
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
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onLogin}
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
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
      <Typography variant="body2" align="right" sx={{ mt: 2, color: '#333333', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
        Forgot password?
      </Typography>
    </Box>
  );
};

export default PasswordInput;