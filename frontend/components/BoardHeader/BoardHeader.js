import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  height: '64px',
  zIndex: 1300,
  position: 'fixed',
  top: 0,
  left: 0,
  right: '60px',
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: '64px',
});

const ToolbarContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 'calc(98% - 60px)',
  marginRight: '60px',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 1, 0.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  '&::placeholder': {
    color: alpha(theme.palette.common.black, 0.5),
    opacity: 1,
  },
}));

// BoardHeader component
const BoardHeader = () => {
  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <ToolbarContent>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: 'none', sm: 'block' },
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem',
              }}
            >
              BoardHub
            </Typography>
          </Link>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </ToolbarContent>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default BoardHeader;