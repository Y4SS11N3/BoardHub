import React from 'react';
import { Box, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FaApple } from 'react-icons/fa';
import { ReactComponent as GoogleLogo } from './google-logo.svg';
import { ReactComponent as MicrosoftLogo } from './microsoft-logo.svg';

const useStyles = makeStyles({
  icon: {
    marginRight: 8,
    fontSize: 24,
  },
  googleIcon: {
    marginRight: 8,
    width: 24,
    height: 24,
  },
  microsoftIcon: {
    marginRight: 8,
    width: 24,
    height: 24,
  },
});

const SocialLoginButtons = () => {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" width="100%" maxWidth={344}>
      <Button
        variant="contained"
        fullWidth
        onClick={() => console.log('Google login')}
        sx={{
          mb: 2,
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
        <GoogleLogo className={classes.googleIcon} />
        <span style={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>Log in with Google</span>
      </Button>
      <Button
        variant="contained"
        fullWidth
        onClick={() => console.log('Microsoft login')}
        sx={{
          mb: 2,
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
        <MicrosoftLogo className={classes.microsoftIcon} />
        <span style={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>Log in with Microsoft</span>
      </Button>
      <Button
        variant="contained"
        fullWidth
        onClick={() => console.log('Apple login')}
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
        <FaApple className={classes.icon} />
        <span style={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>Log in with Apple</span>
      </Button>
    </Box>
  );
};

export default SocialLoginButtons;