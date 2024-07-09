import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const Logo = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  textDecoration: 'none',
  color: 'inherit',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  '&:hover': {
    textDecoration: 'none',
  },
  pointerEvents: 'auto',
}));

const AuthLink = styled(Link)(({ theme }) => ({
  color: '#757575',
  textDecoration: 'underline',
  fontWeight: 'bold',
  '&:hover': {
    color: '#111111',
  },
  pointerEvents: 'auto',
}));

const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
  pointerEvents: 'none',
});

const LoginHeader = ({ isRegisterPage }) => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <StyledToolbar>
        <Logo variant="h6" component={Link} to="/">
          BoardHub
        </Logo>
        <Box sx={{ pointerEvents: 'auto' }}>
          <Typography variant="body1" component="span" sx={{ color: '#757575' }}>
            {isRegisterPage ? 'Already a member? ' : 'Not a member? '}
          </Typography>
          <AuthLink to={isRegisterPage ? '/login' : '/register'}>
            {isRegisterPage ? 'Log in' : 'Sign up'}
          </AuthLink>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default LoginHeader;