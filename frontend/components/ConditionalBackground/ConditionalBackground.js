import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

const ConditionalBackground = ({ children }) => {
  const location = useLocation();
  const isLoginOrRegisterPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboardPage = ['/dashboard', '/shared-with-me', '/trash', '/favorites', '/folder/:folderId'].some(path => 
    path.includes(':folderId') ? location.pathname.startsWith(path.replace(':folderId', '')) : location.pathname === path
  );
  const isBoardPage = location.pathname.includes('/board/');
  const isSharedBoardPage = location.pathname.startsWith('/shared/');
  
  const currentBoard = useSelector(state => state.board.currentBoard);
  const sharedBoard = useSelector(state => state.board.sharedBoard);

  // Render login or register page background
  if (isLoginOrRegisterPage) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        sx={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect x='9' y='9' width='2' height='2' fill='%23dddddd'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px',
        }}
      >
        {children}
      </Box>
    );
  }

  // Render dashboard page background
  if (isDashboardPage) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        sx={{
          backgroundColor: '#fff',
        }}
      >
        {children}
      </Box>
    );
  }

  // Render board or shared board page background
  if ((isBoardPage && currentBoard) || (isSharedBoardPage && sharedBoard)) {
    const board = isBoardPage ? currentBoard : sharedBoard;
    const backgroundImage = board.background;
    const dominantColor = board.dominantColor || 'rgba(120, 90, 60, 0.7)'; // Fallback color

    return (
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        sx={{
          backgroundImage: backgroundImage ? `url(/board-backgrounds/${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: dominantColor, // Use dominantColor as fallback
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: dominantColor,
            opacity: 0.3, // Adjust this value to control the overlay intensity
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    );
  }

  // Default: render children without background
  return children;
};

export default ConditionalBackground;