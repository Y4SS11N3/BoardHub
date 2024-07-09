import React from 'react';
import { Box } from '@mui/material';

const AppContainer = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='2' fill='%23dddddd'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
      }}
    >
      {children}
    </Box>
  );
};

export default AppContainer;