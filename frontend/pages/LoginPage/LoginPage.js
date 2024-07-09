import React from 'react';
import LoginHeader from '../../components/LoginHeader/LoginHeader';
import Login from '../Login/Login';
import LoginFooter from '../../components/Footer/LoginFooter';
import { Box } from '@mui/material';

const LoginPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      <LoginHeader />
      <Box flexGrow={1}>
        <Login />
      </Box>
      <LoginFooter />
    </Box>
  );
};

export default LoginPage;