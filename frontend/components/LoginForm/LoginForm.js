import React from 'react';
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const LoginForm = ({
  loginType,
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  error,
  isLoading,
  handleLoginTypeChange,
}) => {
  return (
    <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 344 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <IconButton onClick={() => handleLoginTypeChange(null)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#333333', fontWeight: 'bold' }}>
          Log in with {loginType}
        </Typography>
      </Box>
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <TextField
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={`Enter your ${loginType}`}
        InputProps={{
          style: {
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            color: '#333333',
          },
        }}
      />
      <TextField
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        InputProps={{
          style: {
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            color: '#333333',
          },
        }}
      />
      <Typography variant="body2" align="right" sx={{ color: '#333333', cursor: 'pointer' }}>
        Forgot password?
      </Typography>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{
          mt: 2,
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#333333' },
          textTransform: 'none',
          fontWeight: 'bold',
        }}
      >
        {isLoading ? 'Logging in...' : 'Continue'}
      </Button>
    </form>
  );
};

export default LoginForm;