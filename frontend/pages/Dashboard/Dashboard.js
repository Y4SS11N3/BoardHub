import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Typography, Box, styled, Grid, Button, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserBoards, getSharedBoards, getTrashedBoards, getFavoriteBoards, setSortPreference, createNewFolder, fetchFolders, getFolderBoards } from '../../redux/actions/boardActions';
import { getUserCollaborations } from '../../redux/actions/collaborationActions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Sidebar from '../../components/Sidebar/Sidebar';
import BoardOptionsMenu from '../../components/BoardOptionsMenu/BoardOptionsMenu';
import NewFolderModal from '../../components/NewFolderModal/NewFolderModal';
import MultiSelectBoardMenu from '../../components/MultiSelectBoardMenu/MultiSelectBoardMenu';
import { ReactComponent as EmptyStateSVG } from '../../components/SocialLoginButtons/undraw_waiting__for_you_ldha.svg';



const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: 240,
  marginTop: 64,
  paddingTop: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginBottom: theme.spacing(2),
}));

const SortButtonsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const SortButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginLeft: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&.active': {
    color: theme.palette.primary.main,
  },
}));

const BoardCard = styled(Box)(({ theme, background }) => ({
  position: 'relative',
  height: 150,
  borderRadius: '10px 10px 60px 10px',
  overflow: 'hidden',
  backgroundImage: `url(/board-backgrounds/${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: 300,
}));

const CardInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: 'white',
  borderRadius: '0 0 10px 10px',
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  color: 'black',
  fontWeight: 'bold',
  fontSize: '1rem',
  marginBottom: '4px',
}));

const CardSubtitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(0, 0, 0, 0.7)',
  fontSize: '0.875rem',
}));

const MoreButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(1),
  position: 'relative',
  top: '-70px',
  right: '15px',
}));

const SelectionRect = styled('div')({
  position: 'fixed',
  border: '2px solid rgba(30, 136, 229, 0.8)',
  backgroundColor: 'rgba(30, 136, 229, 0.1)',
  pointerEvents: 'none',
  zIndex: 1000,
  borderRadius: '4px',
  boxShadow: '0 0 0 1px rgba(30, 136, 229, 0.5)',
});

const BoardCardWrapper = styled(Box)(({ theme, isSelected }) => ({
  position: 'relative',
  transition: 'all 0.3s ease', // Add smooth transition for visual feedback
  transform: isSelected ? 'scale(0.98)' : 'scale(1)', // Slightly shrink selected boards
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
    borderRadius: '10px 10px 60px 10px',
    boxShadow: isSelected ? `0 0 0 4px ${theme.palette.primary.light}` : 'none',
    pointerEvents: 'none',
    transition: 'all 0.3s ease',
  },
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50vh',
}));

const StyledSVG = styled(EmptyStateSVG)(({ theme }) => ({
  width: '300px',
  height: 'auto',
  marginBottom: theme.spacing(4),
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userBoards = useSelector(state => state.board.userBoards);
  const sharedBoards = useSelector(state => state.board.sharedBoards);
  const trashedBoards = useSelector(state => state.board.trashedBoards);
  const favoriteBoards = useSelector(state => state.board.favoriteBoards);
  const folderBoards = useSelector(state => state.board.folderBoards);
  const user = useSelector(state => state.auth.user);
  const sortPreference = useSelector(state => state.board.sortPreference);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const folders = useSelector(state => state.board.folders);
  const userCollaborations = useSelector(state => state.collaboration.userCollaborations);
  const searchTerm = useSelector((state) => state.board.searchTerm);

  // New state for multi-select feature
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [multiSelectMenuOpen, setMultiSelectMenuOpen] = useState(false);
  const [multiSelectMenuPosition, setMultiSelectMenuPosition] = useState({ x: 0, y: 0 });
  const dashboardRef = useRef(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchFolders());
      dispatch(getUserCollaborations());
      if (location.pathname.startsWith('/folder/')) {
        const folderId = location.pathname.split('/')[2];
        dispatch(getFolderBoards(folderId));
      } else {
        switch (location.pathname) {
          case '/dashboard':
            dispatch(getUserBoards());
            break;
          case '/trash':
            dispatch(getTrashedBoards());
            break;
          case '/shared-with-me':
            dispatch(getSharedBoards());
            break;
          case '/favorites':
            dispatch(getFavoriteBoards());
            break;
          default:
            dispatch(getUserBoards());
        }
      }
    }
  }, [dispatch, user, location.pathname]);

  useEffect(() => {
    const savedSortPreference = localStorage.getItem('sortPreference');
    if (savedSortPreference) {
      dispatch(setSortPreference(savedSortPreference));
    }
  }, [dispatch]);

  const handleSortByName = () => {
    dispatch(setSortPreference('name'));
    localStorage.setItem('sortPreference', 'name');
  };

  const handleSortByLastViewed = () => {
    dispatch(setSortPreference('lastViewed'));
    localStorage.setItem('sortPreference', 'lastViewed');
  };

  const getSectionTitle = () => {
    if (location.pathname.startsWith('/folder/')) {
      const folderId = location.pathname.split('/')[2];
      const folder = folders.find(f => f.id === folderId);
      return folder ? folder.name : 'Folder';
    }
    switch (location.pathname) {
      case '/dashboard':
        return 'Your Boards';
      case '/shared-with-me':
        return 'Shared with Me';
      case '/trash':
        return 'Trashed Boards';
      case '/favorites':
        return 'Favorite Boards';
      default:
        return 'Your Boards';
    }
  };

  const getBoards = () => {
    if (location.pathname.startsWith('/folder/')) {
      return folderBoards || [];
    }
    switch (location.pathname) {
      case '/dashboard':
        return userBoards || [];
      case '/shared-with-me':
        return sharedBoards || [];
      case '/trash':
        return trashedBoards || [];
      case '/favorites':
        return favoriteBoards || [];
      default:
        return userBoards || [];
    }
  };

  const boards = getBoards();

  const sortedBoards = [...boards].sort((a, b) => {
    if (sortPreference === 'name') {
      return a.title.localeCompare(b.title);
    } else if (sortPreference === 'lastViewed') {
      return new Date(b.lastViewed) - new Date(a.lastViewed);
    }
    return 0;
  });

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  const updateSelectedBoards = useCallback(() => {
    const selectedBoardIds = sortedBoards.filter((board) => {
      const boardElement = document.getElementById(`board-${board.id || board.boardId}`);
      if (!boardElement) return false;
      const rect = boardElement.getBoundingClientRect();
      const { scrollLeft, scrollTop } = dashboardRef.current;
      const boardLeft = rect.left + scrollLeft;
      const boardTop = rect.top + scrollTop;
      const boardRight = rect.right + scrollLeft;
      const boardBottom = rect.bottom + scrollTop;
      return (
        boardLeft < Math.max(selectionStart.x, selectionEnd.x) &&
        boardRight > Math.min(selectionStart.x, selectionEnd.x) &&
        boardTop < Math.max(selectionStart.y, selectionEnd.y) &&
        boardBottom > Math.min(selectionStart.y, selectionEnd.y)
      );
    }).map((board) => board.id || board.boardId);
    setSelectedBoards(selectedBoardIds);
  }, [sortedBoards, selectionStart, selectionEnd]);

  const handleMenuOpen = (event, board) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedBoard(board);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedBoard(null);
  };

  const handleToggleFavorite = (boardId) => {
    console.log('Toggle favorite for board:', boardId);
  };

  const handleNewFolder = () => {
    setNewFolderModalOpen(true);
  };

  const handleNewFolderSubmit = (folderName) => {
    dispatch(createNewFolder(folderName));
    setNewFolderModalOpen(false);
  };

  const handleFolderClick = (folderId) => {
    navigate(`/folder/${folderId}`);
    dispatch(getFolderBoards(folderId));
  };

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only left mouse button
    const { clientX, clientY } = e;
    const { scrollLeft, scrollTop } = dashboardRef.current;
    setIsSelecting(true);
    setSelectionStart({ 
      x: clientX + scrollLeft, 
      y: clientY + scrollTop 
    });
    setSelectionEnd({ 
      x: clientX + scrollLeft, 
      y: clientY + scrollTop 
    });
    setSelectedBoards([]);
  }, []);


  const handleMouseMove = useCallback((e) => {
    if (!isSelecting) return;
    const { clientX, clientY } = e;
    const { scrollLeft, scrollTop } = dashboardRef.current;
    setSelectionEnd({ 
      x: clientX + scrollLeft, 
      y: clientY + scrollTop 
    });
    updateSelectedBoards();
  }, [isSelecting, updateSelectedBoards]);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);



  const handleContextMenu = (e) => {
    e.preventDefault();
    if (selectedBoards.length > 0) {
      console.log('Opening context menu for boards:', selectedBoards);
      setMultiSelectMenuPosition({ x: e.clientX, y: e.clientY });
      setMultiSelectMenuOpen(true);
    }
  };

  const handleCloseMultiSelectMenu = () => {
    setMultiSelectMenuOpen(false);
  };

  const renderBoards = () => {
    if (Array.isArray(sortedBoards) && sortedBoards.length > 0) {
      return (
        <Grid container spacing={2}>
          {sortedBoards.map(board => (
            <Grid item xs={12} sm={6} md={3} key={board.id || board.boardId}>
              <BoardCardWrapper
                id={`board-${board.id || board.boardId}`}
                isSelected={selectedBoards.includes(board.id || board.boardId)}
                onContextMenu={handleContextMenu}
              >
                <Link to={`/${user?.username || 'user'}/board/${board.boardId}`} style={{ textDecoration: 'none' }}>
                  <BoardCard background={board.background || 'default.jpg'} />
                  <CardInfo>
                    <CardTitle>{board.title}</CardTitle>
                    <CardSubtitle>{user?.fullName || 'Unknown'} • {getTimeAgo(board.updatedAt)}</CardSubtitle>
                  </CardInfo>
                </Link>
                <MoreButtonWrapper>
                  <IconButton onClick={(e) => handleMenuOpen(e, board)}>
                    <MoreVertIcon />
                  </IconButton>
                </MoreButtonWrapper>
              </BoardCardWrapper>
            </Grid>
          ))}
        </Grid>
      );
    } else {
      return (
        <EmptyStateContainer>
          <StyledSVG />
          <Typography variant="h6" color="textSecondary">
            No boards found in this section.
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Create a new board or check back later!
          </Typography>
        </EmptyStateContainer>
      );
    }
  };

  return (
    <DashboardContainer>
      <Sidebar onNewFolder={handleNewFolder} folders={folders} onFolderClick={handleFolderClick} />
      <MainContent
        ref={dashboardRef}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <SectionTitle variant="h4">
            {getSectionTitle()}
          </SectionTitle>
          <SortButtonsWrapper>
            <SortButton
              onClick={handleSortByName}
              className={sortPreference === 'name' ? 'active' : ''}
            >
              Name
            </SortButton>
            <SortButton
              onClick={handleSortByLastViewed}
              className={sortPreference === 'lastViewed' ? 'active' : ''}
            >
              Last viewed
            </SortButton>
          </SortButtonsWrapper>
        </Box>
        {renderBoards()}
        {isSelecting && (
          <SelectionRect
            style={{
              left: `${Math.min(selectionStart.x, selectionEnd.x) - dashboardRef.current.scrollLeft}px`,
              top: `${Math.min(selectionStart.y, selectionEnd.y) - dashboardRef.current.scrollTop}px`,
              width: `${Math.abs(selectionEnd.x - selectionStart.x)}px`,
              height: `${Math.abs(selectionEnd.y - selectionStart.y)}px`,
            }}
          />
        )}
      </MainContent>
      <BoardOptionsMenu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        board={selectedBoard}
        onToggleFavorite={handleToggleFavorite}
        folders={folders}
      />
      <NewFolderModal
        open={newFolderModalOpen}
        onClose={() => setNewFolderModalOpen(false)}
        onSubmit={handleNewFolderSubmit}
      />
      <MultiSelectBoardMenu
        open={multiSelectMenuOpen}
        onClose={handleCloseMultiSelectMenu}
        selectedBoards={selectedBoards}
        position={multiSelectMenuPosition}
      />
    </DashboardContainer>
  );
};

export default Dashboard;