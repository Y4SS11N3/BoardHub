import React from 'react';
import { Box, Typography } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

const LoginFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '10px 20px',
        color: '#6a6a6a',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > *': {
            marginRight: '20px',
            padding: '8px',
            borderRadius: '10%',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: '#e8e8e8',
            },
          },
          '& > span': {
            borderRadius: '20px',
          },
        }}
      >
        <QuestionMarkIcon sx={{ fontSize: '32px' }} />
        <AccessibilityIcon sx={{ fontSize: '32px' }} />
        <Typography
          variant="body2"
          component="span"
          noWrap
          sx={{
            color: '#111111',
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: '#e8e8e8',
            },
          }}
        >
          English (US) &#9662;
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginFooter;