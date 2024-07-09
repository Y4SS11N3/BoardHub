import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Snackbar, 
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getSharedBoard } from '../../redux/actions/boardActions';
import SharedCardItem from '../../components/SharedCardItem/SharedCardItem';

// Styled components
const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 79px)',
  paddingRight: '60px',
  overflow: 'hidden',
}));

const Content = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  paddingRight: '80px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
}));

const BoardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  color: 'white',
  fontSize: '2rem',
}));

const SharedBoard = () => {
  const { shareToken } = useParams();
  const dispatch = useDispatch();
  const sharedBoard = useSelector((state) => state.board.sharedBoard);
  const [sortedCards, setSortedCards] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [isLoading, setIsLoading] = useState(true);

  // Show snackbar message
  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  // Fetch shared board data
  useEffect(() => {
    const fetchSharedBoard = async () => {
      try {
        setIsLoading(true);
        await dispatch(getSharedBoard(shareToken));
        setIsLoading(false);
      } catch (error) {
        // Handle error
        showSnackbar('Failed to load shared board', 'error');
        setIsLoading(false);
      }
    };
    fetchSharedBoard();
  }, [dispatch, shareToken, showSnackbar]);

  // Sort cards when sharedBoard changes
  useEffect(() => {
    if (sharedBoard && sharedBoard.cards) {
      const sorted = [...sharedBoard.cards].sort((a, b) => a.position - b.position);
      setSortedCards(sorted);
    } else {
      setSortedCards([]);
    }
  }, [sharedBoard]);

  // Render cards
  const renderCards = useCallback(() => {
    if (sortedCards.length === 0) {
      return <Typography>No cards available for this board.</Typography>;
    }

    return (
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="all-cards" direction="horizontal">
          {(provided, snapshot) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                minHeight: 100,
                padding: 2,
                backgroundColor: snapshot.isDraggingOver ? 'rgba(227, 242, 253, 0.7)' : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              {sortedCards.map((card, index) => (
                <SharedCardItem
                  key={card.id}
                  card={card}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    );
  }, [sortedCards]);

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 79px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if board not found
  if (!sharedBoard) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 79px)' }}>
        <Typography>Board not found or failed to load.</Typography>
      </Box>
    );
  }

  return (
    <Root background={sharedBoard?.background}>
      <Content>
        <BoardTitle variant="h5">
          {sharedBoard?.title || 'Shared Board'}
        </BoardTitle>
        {renderCards()}
      </Content>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Root>
  );
};

export default SharedBoard;