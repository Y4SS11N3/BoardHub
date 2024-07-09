import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material';
import { login } from '../../redux/actions/authActions';
import SocialLoginButtons from '../../components/SocialLoginButtons/SocialLoginButtons';
import PasswordInput from '../../components/PasswordInput/PasswordInput';

// Login component
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (isEmailValid) {
      if (showPasswordInput) {
        dispatch(login(email, password, navigate));
      } else {
        setShowPasswordInput(true);
      }
    }
  };

  // Check if email is valid
  const isEmailValid = email.trim() !== '';

  // Render password input component if email is entered
  if (showPasswordInput) {
    return (
      <PasswordInput
        email={email}
        password={password}
        setPassword={setPassword}
        onBack={() => setShowPasswordInput(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Render initial login form
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
      <Typography variant="h4" gutterBottom sx={{ color: '#333333', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', textAlign: 'left', mb: 1 }}>
        Log in
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: '#333333', fontFamily: 'Montserrat, sans-serif', textAlign: 'left', mb: 3 }}>
        Welcome back to where you belong
      </Typography>
      <SocialLoginButtons />
      <Typography variant="body2" sx={{ mt: 3, color: '#333333', fontFamily: 'Montserrat, sans-serif', textAlign: 'left', mb: 1 }}>
        Or, log in with email/username
      </Typography>
      <Box display="flex" justifyContent="flex-start" width="100%" maxWidth={344} sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@boardhub.com"
          InputProps={{
            style: {
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              color: '#333333',
              height: '48px',
            },
          }}
        />
      </Box>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Box display="flex" justifyContent="flex-end" width="100%" maxWidth={344} sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading || !isEmailValid}
          onClick={handleLogin}
          sx={{
            backgroundColor: isEmailValid ? '#ff4081' : '#e0e0e0',
            color: isEmailValid ? '#ffffff' : '#9e9e9e',
            '&:hover': {
              backgroundColor: isEmailValid ? '#ff4081' : '#e0e0e0',
            },
            textTransform: 'none',
            fontWeight: 'bold',
            width: 'auto',
            minWidth: '120px',
            height: '40px',
            borderRadius: '20px',
          }}
        >
          {isLoading ? 'Logging in...' : 'Continue'}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;