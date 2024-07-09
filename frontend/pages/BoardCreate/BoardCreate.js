// Import necessary dependencies and components
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Drawer
} from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BoardSidebar from '../../components/Sidebar/BoardSidebar';
import CardCreateDialog from '../../components/CardCreateDialog/CardCreateDialog';
import { CardItem } from '../../components/CardItem/CardItem';
import CollaboratorList from '../../components/CollaboratorList/CollaboratorList';
import ShareDialog from '../../components/ShareDialog/ShareDialog';
import { 
  createCard, 
  updateCard, 
  deleteCard, 
  pinCard
} from '../../redux/actions/cardActions';
import { 
  getBoard, 
  updateBoard,
  deleteBoard,
  toggleSections,
  addSection,
  updateBoardFormat,
} from '../../redux/actions/boardActions';

// Styled components
const Root = styled(Box)(({ theme, background }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 64px)', // Subtract header height
  paddingRight: '60px',
  overflow: 'hidden',
  backgroundImage: `url(/board-backgrounds/${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  marginTop: '44px', // Add margin to account for header height
}));

const Content = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  paddingLeft: theme.spacing(6), // Add more padding to the left
  paddingRight: '80px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
}));

const UsernameTimestamp = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '1rem',
  marginLeft: theme.spacing(2), // Add left margin
}));

const BoardTitle = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  color: 'white',
  fontSize: '2rem',
  marginLeft: theme.spacing(2), // Add left margin
}));

const AddButton = styled(IconButton)(({ theme, bgcolor }) => ({
  position: 'fixed',
  bottom: '50px',
  right: '45px',
  backgroundColor: bgcolor || '#ff9800',
  color: 'white',
  width: '70px',
  height: '70px',
  '&:hover': {
    backgroundColor: bgcolor ? `${bgcolor}dd` : '#f57c00',
  },
  zIndex: 1200,
}));

// Main component
const BoardCreate = () => {
  // Hook calls
  const { username, boardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const user = useSelector((state) => state.auth.user);
  const board = useSelector((state) => state.board.currentBoard);
  const userCards = useSelector((state) => state.card.userCards);
  const boardError = useSelector((state) => state.board.error);

  // Local state
  const [elapsedTime, setElapsedTime] = useState('0m');
  const [boardTitle, setBoardTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [sortedCards, setSortedCards] = useState([]);
  const [sections, setSections] = useState([]);
  const [background, setBackground] = useState('');
  const [collaboratorDrawerOpen, setCollaboratorDrawerOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [dominantColor, setDominantColor] = useState(null);

  // Utility functions
  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const sortCards = useCallback((cards) => {
    return [...cards].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.position - b.position;
    });
  }, []);

  // Handler functions
  const handleChangeColor = useCallback(async (cardId, color) => {
    try {
      await dispatch(updateCard(cardId, { color }));
      showSnackbar('Card color updated successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'An error occurred while updating the card color', 'error');
    }
  }, [dispatch, showSnackbar]);

  const handleFormatChange = useCallback(async (format) => {
    try {
      await dispatch(updateBoardFormat(boardId, format));
      showSnackbar('Board format updated successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to update board format', 'error');
    }
  }, [boardId, dispatch, showSnackbar]);

  // Fetch board data
  const fetchBoardData = useCallback(async () => {
    if (boardId) {
      try {
        const boardResponse = await dispatch(getBoard(boardId));
        
        if (boardResponse) {
          setBoardTitle(boardResponse.title || 'Untitled Board');
          setDominantColor(boardResponse.dominantColor);
          
          const sortedCards = sortCards(boardResponse.cards || []);
          
          if (boardResponse.sectionsEnabled && boardResponse.sections) {
            setSections(boardResponse.sections);
          } else {
            setSections([{ id: 'default', title: 'All Cards', cards: [] }]);
          }
          
          setSortedCards(sortedCards);
        }
      } catch (error) {
        showSnackbar('Failed to load board data. Please try again.', 'error');
        setSections([{ id: 'default', title: 'All Cards', cards: [] }]);
        setSortedCards([]);
      }
    }
  }, [boardId, dispatch, showSnackbar, sortCards]);

  // Effects
  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  useEffect(() => {
    // Set up elapsed time counter
    const startTime = new Date();
  
    const updateElapsedTime = () => {
      const now = new Date();
      const diff = now - startTime;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
  
      if (days > 0) {
        setElapsedTime(`${days}d`);
      } else if (hours > 0) {
        setElapsedTime(`${hours}h`);
      } else if (minutes > 0) {
        setElapsedTime(`${minutes}m`);
      } else {
        setElapsedTime('0m');
      }
    };
  
    updateElapsedTime();
    const intervalId = setInterval(updateElapsedTime, 60000);
  
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Update local state when board data changes
    if (board) {
      setBoardTitle(board.title || 'Untitled Board');
      if (board.sectionsEnabled && board.sections) {
        setSections(board.sections);
      } else {
        setSections([{ id: 'default', title: 'All Cards', cards: board.cards || [] }]);
      }
      setBackground(board.background || '');
    }
  }, [board]);

  useEffect(() => {
    // Sort cards when userCards change
    const sortedCards = [...userCards].sort((a, b) => a.position - b.position);
    setSortedCards(sortedCards);
  }, [userCards]);

  // More handler functions
  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event) => {
    setBoardTitle(event.target.value);
  };

  const handleTitleBlur = async () => {
    setIsEditing(false);
    if (board && boardTitle !== board.title) {
      try {
        await dispatch(updateBoard(boardId, { title: boardTitle }));
        showSnackbar('Board title updated successfully', 'success');
      } catch (error) {
        showSnackbar(error.response?.data?.error || 'Failed to update board title', 'error');
        setBoardTitle(board.title);
      }
    }
  };

  const handleAddButtonClick = () => {
    setEditingCard(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCard(null);
  };

  const handlePublish = async (subject, content, image, cardId = null) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
  
    try {
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
  
      let sectionId = null;
      if (board.sectionsEnabled) {
        if (sections.length === 0) {
          const defaultSection = await dispatch(addSection(board.boardId, 'Section 1'));
          setSections([defaultSection]);
          sectionId = defaultSection.id;
        } else {
          sectionId = sections[sections.length - 1].id;
        }
      }
  
      const cardData = {
        subject,
        content,
        image,
        userId: user.id,
        boardId,
        sectionId
      };
  
      let updatedCard;
      if (cardId) {
        updatedCard = await dispatch(updateCard(cardId, cardData));
        showSnackbar('Card updated successfully', 'success');
      } else {
        updatedCard = await dispatch(createCard(cardData));
        showSnackbar('Card created successfully', 'success');
      }
      
      setSortedCards(prevCards => {
        const cardIndex = prevCards.findIndex(card => card.id === updatedCard.id);
        if (cardIndex !== -1) {
          const newCards = [...prevCards];
          newCards[cardIndex] = updatedCard;
          return sortCards(newCards);
        } else {
          return sortCards([...prevCards, updatedCard]);
        }
      });
      setIsDialogOpen(false);
      setEditingCard(null);
    } catch (error) {
      showSnackbar(error.message || 'An error occurred while creating/updating the card', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCard = useCallback((cardId) => {
    const cardToEdit = sortedCards.find(card => card.id === cardId);
    if (cardToEdit) {
      setEditingCard(cardToEdit);
      setIsDialogOpen(true);
    }
  }, [sortedCards]);

  const handleDeleteCard = useCallback(async (cardId) => {
    try {
      await dispatch(deleteCard(cardId));
      setSortedCards(prevCards => sortCards(prevCards.filter(card => card.id !== cardId)));
      showSnackbar('Card deleted successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'An error occurred while deleting the card', 'error');
    }
  }, [dispatch, showSnackbar, sortCards]);

  const handlePinCard = useCallback(async (cardId, isPinned) => {
    if (!boardId) {
      return;
    }
    try {
      await dispatch(pinCard(cardId, isPinned));
      showSnackbar(`Card ${isPinned ? 'pinned' : 'unpinned'} successfully`, 'success');
    } catch (error) {
      showSnackbar(error.message || 'An error occurred while pinning/unpinning the card', 'error');
    }
  }, [boardId, dispatch, showSnackbar]);

  const onDragEnd = useCallback((result) => {
    const { source, destination, draggableId } = result;
  
    if (!destination) {
      return;
    }
  
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
  
    // Remove the 'card-' prefix from draggableId
    const cardId = draggableId.replace('card-', '');
    const draggedCard = sortedCards.find(card => card.id === cardId);
  
    if (!draggedCard) {
      return;
    }
  
    // Create a new array of cards
    const newCards = Array.from(sortedCards);
    // Remove the dragged card from its original position
    newCards.splice(newCards.findIndex(card => card.id === cardId), 1);
    // Insert the dragged card at its new position
    newCards.splice(destination.index, 0, draggedCard);
  
    // Update positions for all affected cards
    const updatedCards = newCards.map((card, index) => ({
      ...card,
      position: index,
      sectionId: card.id === cardId ? destination.droppableId : card.sectionId
    }));
  
    // Update the Redux store and backend
    const updatePromises = updatedCards.map(card => 
      dispatch(updateCard(card.id, { 
        position: card.position, 
        sectionId: card.sectionId 
      }))
    );
  
    Promise.all(updatePromises)
      .then(() => {
        // Update local state
        setSortedCards(updatedCards);
  
        // Refresh the board data after drag and drop
        return dispatch(getBoard(boardId));
      })
      .catch(error => {
        showSnackbar('Failed to move card. Please try again.', 'error');
      });
  
    }, [sortedCards, boardId, dispatch, showSnackbar]);

    const handleToggleSections = async (enabled) => {
      if (board) {
        try {
          const updatedBoard = await dispatch(toggleSections(board.boardId, enabled));
    
          if (enabled) {
            if (!updatedBoard.sections || updatedBoard.sections.length === 0) {
              const defaultSection = { id: 'default', title: 'Section 1', cards: [] };
              updatedBoard.sections = [defaultSection];
            }
    
            const updatedCards = sortedCards.map(card => ({
              ...card,
              sectionId: card.sectionId || updatedBoard.sections[0].id
            }));
    
            await Promise.all(updatedCards.map(card => 
              dispatch(updateCard(card.id, { sectionId: card.sectionId }))
            ));
    
            setSortedCards(updatedCards);
          } else {
            const updatedCards = sortedCards.map(card => ({ ...card, sectionId: null }));
            await Promise.all(updatedCards.map(card => 
              dispatch(updateCard(card.id, { sectionId: null }))
            ));
            setSortedCards(updatedCards);
          }
    
          setSections(updatedBoard.sections || []);
          dispatch(getBoard(board.boardId));
          
          showSnackbar(`Sections ${enabled ? 'enabled' : 'disabled'} successfully`, 'success');
        } catch (error) {
          showSnackbar(error.message || 'An error occurred while toggling sections', 'error');
        }
      }
    };
  
    const handleAddSection = async () => {
      if (board) {
        try {
          await dispatch(addSection(board.boardId));
          // Fetch the updated board data after adding a section
          await fetchBoardData();
          showSnackbar('Section added successfully', 'success');
        } catch (error) {
          showSnackbar(error.message || 'An error occurred while adding a section', 'error');
        }
      }
    };
  
    const renderSectionsAndCards = useCallback(() => {
      if (!board || !sections || sections.length === 0) {
        return <Typography>No data available</Typography>;
      }
    
      return (
        <DragDropContext onDragEnd={onDragEnd}>
          <Box display="flex" flexDirection="column" gap={2}>
            {board.sectionsEnabled ? (
              // Render sections
              sections.map((section) => (
                <Droppable droppableId={section.id} key={section.id} direction="vertical">
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        width: '100%',
                        minHeight: 100,
                        padding: 2,
                        backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : '#f5f5f5',
                        borderRadius: 2,
                        transition: 'background-color 0.2s ease',
                      }}
                      >
                      <Typography variant="h6" mb={2}>{section.title}</Typography>
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {sortedCards.filter(card => card.sectionId === section.id).map((card, index) => (
                          <CardItem
                            key={card.id}
                            card={card}
                            index={index}
                            onEdit={handleEditCard}
                            onDelete={handleDeleteCard}
                            onPin={handlePinCard}
                            onChangeColor={handleChangeColor}
                          />
                        ))}
                      </Box>
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              ))
            ) : (
              // Render unsectioned cards
              <Droppable droppableId="all-cards" direction="vertical">
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
                      backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {sortedCards.map((card, index) => (
                      <CardItem
                        key={card.id}
                        card={card}
                        index={index}
                        onEdit={handleEditCard}
                        onDelete={handleDeleteCard}
                        onPin={handlePinCard}
                        onChangeColor={handleChangeColor}
                      />
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            )}
          </Box>
        </DragDropContext>
      );
    }, [board, sections, sortedCards, onDragEnd, handleEditCard, handleDeleteCard, handlePinCard, handleChangeColor]);
  
    const handleDeleteBoard = async () => {
      if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
        try {
          await dispatch(deleteBoard(boardId));
          showSnackbar('Board deleted successfully', 'success');
          navigate('/boards');
        } catch (error) {
          showSnackbar(error.message || 'An error occurred while deleting the board', 'error');
        }
      }
    };
  
    const toggleCollaboratorDrawer = () => {
      setCollaboratorDrawerOpen(!collaboratorDrawerOpen);
    };
  
    const handleShareClick = () => {
      setShareDialogOpen(true);
    };
  
    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };
  
    if (!user) {
      return <Typography>Please log in to view this board.</Typography>;
    }
  
    if (boardError) {
      return <Typography color="error">{boardError}</Typography>;
    }
  
    return (
      <Root>
        <Content>
          <UsernameTimestamp variant="body2">
            {username || user.fullName || 'Guest'} • {elapsedTime}
          </UsernameTimestamp>
          {isEditing ? (
            <input
              value={boardTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              autoFocus
              style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '100%' }}
            />
          ) : (
            <BoardTitle variant="h5" onClick={handleTitleClick}>
              {boardTitle || 'Loading...'}
            </BoardTitle>
          )}
          {renderSectionsAndCards()}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Content>
        <BoardSidebar
          boardId={boardId}
          onToggleSections={handleToggleSections}
          onAddSection={handleAddSection}
          onDeleteBoard={handleDeleteBoard}
          username={user.username}
          onShareClick={handleShareClick}
          selectedFormat={board ? board.format : 'Wall'}
          onFormatChange={handleFormatChange}
          dominantColor={dominantColor}
          onCollaboratorClick={toggleCollaboratorDrawer}
          board={board}
        />
        <AddButton 
          onClick={handleAddButtonClick} 
          disabled={isLoading}
          bgcolor={dominantColor}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : <AddIcon />}
        </AddButton>
  
        <CardCreateDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          onPublish={handlePublish}
          onMinimize={handleDialogClose}
          editCard={editingCard}
        />
        <Drawer
          anchor="right"
          open={collaboratorDrawerOpen}
          onClose={toggleCollaboratorDrawer}
        >
          <Box sx={{ width: 500, padding: 2 }}>
            <CollaboratorList boardId={boardId} />
          </Box>
        </Drawer>
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
        <ShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          boardId={boardId}
          existingShareToken={board?.shareToken}
        />
      </Root>
    );
  };
  
  export default BoardCreate;