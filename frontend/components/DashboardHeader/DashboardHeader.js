import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Box, Button, styled, Typography } from '@mui/material';
import UserAvatar from '../UserAvatar/UserAvatar';
import UserMenu from './UserMenu';
import AddIcon from '@mui/icons-material/Add';
import { createBoard } from '../../redux/actions/boardActions';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(1, 0),
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: '#000',
  marginRight: theme.spacing(2),
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const NavLink = styled(Button)(({ theme }) => ({
  color: '#757575',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '1rem',
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#000',
  },
}));

const UserInfoButton = styled(Button)(({ theme, backgroundColor }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: backgroundColor || '#fff',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5, 1.5),
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: backgroundColor ? `${backgroundColor}90` : '#f5f5f5',
  },
  '& .MuiButton-label': {
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  '& .username': {
    color: '#757575',
    marginLeft: theme.spacing(1),
  },
}));

const MakeLink = styled(NavLink)(({ theme }) => ({
  color: '#426ab2',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#426ab2',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    marginRight: theme.spacing(0.5),
  },
}));

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const open = Boolean(anchorEl);

  // Effect to handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle opening user menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing user menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle color generation for user avatar
  const handleColorGenerated = (color) => {
    const lighterColor = `${color}40`;
    setBackgroundColor(lighterColor);
  };

  // Handle creating a new board
  const handleMakeClick = async () => {
    try {
      const newBoard = await dispatch(createBoard({ subject: 'New Board' }));
      if (newBoard && newBoard.boardId) {
        navigate(`/${user.username}/board/${newBoard.boardId}`);
      } else {
        throw new Error('Failed to create board: No boardId returned');
      }
    } catch (error) {
      // Handle error (e.g., show a notification to the user)
    }
  };

  return (
    <StyledAppBar position="fixed" isScrolled={isScrolled}>
      <StyledToolbar>
        <Box display="flex" alignItems="center">
          <Logo>BoardHub</Logo>
          <NavLinks>
            <NavLink component={Link} to="/dashboard">
              Home
            </NavLink>
            <NavLink component={Link} to="/about">
              About
            </NavLink>
            <NavLink component={Link} to="/contact">
              Contact
            </NavLink>

            {user && (
              <MakeLink 
                onClick={handleMakeClick}
                startIcon={<AddIcon />}
              >
                Make
              </MakeLink>
            )}
          </NavLinks>
        </Box>
        <Box display="flex" alignItems="center">
          {user && (
            <UserInfoButton onClick={handleClick} backgroundColor={backgroundColor}>
              <UserAvatar
                name={user.username}
                width="40px"
                height="40px"
                fontSize="20px"
                onColorGenerated={handleColorGenerated}
                avatarUrl={user.avatarUrl}
              />
              <span className="username">{user.username}</span>
            </UserInfoButton>
          )}
          <UserMenu anchorEl={anchorEl} open={open} onClose={handleClose} user={user} />
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default DashboardHeader;