import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, styled } from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#111827',
  padding: theme.spacing(-2, 0),
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const Logo = styled('span')(({ theme }) => ({
  color: '#ced0d4',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: '1.5rem',
  textDecoration: 'none',
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1),
}));

const NavLink = styled(Button)(({ theme }) => ({
  color: '#ced0d4',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '0.9rem',
  marginLeft: 0,
  '&:not(:first-child)': {
    marginLeft: theme.spacing(0.5),
  },
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const NavLinkSeparator = styled('span')(({ theme }) => ({
  color: '#636466',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 500,
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
}));


const ActionButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 500,
  textTransform: 'none',
  marginLeft: theme.spacing(2),
  padding: theme.spacing(0.5, 2),
  borderRadius: '20px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const GetQuoteLink = styled('a')(({ theme }) => ({
  color: '#ced0d4',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 500,
  textDecoration: 'none',
  marginLeft: theme.spacing(2),
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Header = () => {
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Logo>BoardHub</Logo>
        <NavLinks>

          <NavLinkSeparator>/</NavLinkSeparator>
          <NavLink component={Link} to="/">
            Home
          </NavLink>
          <NavLinkSeparator>/</NavLinkSeparator>
          <NavLink component={Link} to="/contact">
            Contact
          </NavLink>
          <NavLinkSeparator>/</NavLinkSeparator>
          <NavLink component={Link} to="/about">
            About
          </NavLink>
        </NavLinks>
        <ActionButtons>
          <ActionButton component={Link} to="/login" style={{ backgroundColor: '#ced0d4', color: '#3c3d40' }}>
            Log in
          </ActionButton>
          <ActionButton component={Link} to="/register" style={{ backgroundColor: '#5ca8f6' }}>Sign up</ActionButton>
        </ActionButtons>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;