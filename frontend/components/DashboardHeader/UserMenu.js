import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, Divider, Box, Typography, styled, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { logout } from '../../redux/actions/authActions';
import UserAvatar from '../UserAvatar/UserAvatar';

// Styled components
const UserMenuWrapper = styled(Menu)(({ theme }) => ({
  marginTop: theme.spacing(1),
  '& .MuiPaper-root': {
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(2),
    width: 300,
  },
}));

const UserMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const UserMenuDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
}));

const UserMenuIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: '#757575',
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#5ca8f6',
  color: '#fff',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  marginTop: theme.spacing(2),
  '&:hover': {
    backgroundColor: '#5cbef6',
  },
}));

const UserMenu = ({ anchorEl, open, onClose, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarColor, setAvatarColor] = useState(null);

  // Handle user logout
  const handleLogout = async () => {
    await dispatch(logout());
    onClose();
    navigate('/login');
  };

  // Handle avatar color generation
  const handleColorGenerated = (color) => {
    setAvatarColor(color);
  };

  return (
    <UserMenuWrapper
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-start" p={2}>
        <UserAvatar 
          name={user?.username}
          width="48px"
          height="48px"
          fontSize="24px"
          onColorGenerated={handleColorGenerated}
          avatarUrl={user?.avatarUrl}
        />
        <Typography variant="h6" fontWeight="bold">
          {user?.fullName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user?.email}
        </Typography>
        <Typography variant="body2" color="textSecondary" display="flex" alignItems="center">
          {user?.username}
        </Typography>
      </Box>

      <UserMenuItem component={Link} to="/settings" onClick={onClose}>
        <UserMenuIcon>
          <SettingsIcon fontSize="small" />
        </UserMenuIcon>
        Settings
      </UserMenuItem>

      <UserMenuItem component={Link} to="/profile" onClick={onClose}>
        <UserMenuIcon>
          <AccountBoxIcon fontSize="small" />
        </UserMenuIcon>
        My profile
      </UserMenuItem>

      <UserMenuDivider />
      <Box p={2}>
        <LogoutButton variant="contained" fullWidth onClick={handleLogout}>
          Log out
        </LogoutButton>
      </Box>
    </UserMenuWrapper>
  );
};

export default UserMenu;