import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material';
import { register } from '../../redux/actions/authActions';
import SocialLoginButtons from '../../components/SocialLoginButtons/SocialLoginButtons';
import PasswordRegister from '../../components/PasswordRegister/PasswordRegister';

// Register component
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Handle register form submission
  const handleRegister = () => {
    if (isEmailValid) {
      if (showPasswordInput) {
        dispatch(register({ username, fullName, email, password }, navigate));
      } else {
        setShowPasswordInput(true);
      }
    }
  };

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Check if email is valid
  const isEmailValid = email.trim() !== '';

  // Render password input component if email is entered
  if (showPasswordInput) {
    return (
      <PasswordRegister
        username={username}
        fullName={fullName}
        email={email}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onBack={() => setShowPasswordInput(false)}
        onRegister={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Render initial registration form
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
        Sign up
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: '#333333', fontFamily: 'Montserrat, sans-serif', textAlign: 'left', mb: 3 }}>
        You belong here
      </Typography>
      <SocialLoginButtons />
      <Typography variant="body2" sx={{ mt: 3, color: '#333333', fontFamily: 'Montserrat, sans-serif', textAlign: 'left', mb: 1 }}>
        Or, sign up with email
      </Typography>
      <Box display="flex" justifyContent="flex-start" width="100%" maxWidth={344} sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
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
      <Box display="flex" justifyContent="flex-start" width="100%" maxWidth={344} sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
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
          onClick={handleRegister}
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
          {isLoading ? 'Signing up...' : 'Continue'}
        </Button>
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 3, color: '#333333', fontFamily: 'Montserrat, sans-serif' }}>
        By signing up, you agree to our Terms of Service and Privacy Policy. 
        You also solemnly swear that you're up to no good (but in a good way).
      </Typography>
    </Box>
  );
};

export default Register;