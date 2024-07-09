import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  height: '48px', // Reduced height
  zIndex: 1300,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: '48px', // Reduced height
});

const ToolbarContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const SlideShowHeader = () => {
  return (
    <StyledAppBar position="absolute">
      <StyledToolbar>
        <ToolbarContent>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                color: alpha('#ffffff', 0.7), // Semi-transparent white
                fontSize: '1.2rem', // Smaller font size
                fontWeight: 'bold',
                padding: '4px 8px', // Add some padding
                borderRadius: '4px', // Optional: adds a subtle rounded corner
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1), // Slight highlight on hover
                },
              }}
            >
              BoardHub
            </Typography>
          </Link>
        </ToolbarContent>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default SlideShowHeader;