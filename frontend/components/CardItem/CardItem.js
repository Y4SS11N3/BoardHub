import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckIcon from '@mui/icons-material/Check';
import { Draggable } from 'react-beautiful-dnd';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme, isPinned, isDragging, color }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
  border: isPinned ? '2px solid #3498db' : 'none',
  position: 'relative',
  backgroundColor: isDragging ? 'rgba(255, 255, 255, 0.9)' : color || 'white',
  backdropFilter: isDragging ? 'blur(5px)' : 'none',
  width: '300px',
  minHeight: '100px',
  margin: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
  },
  '& .MuiMenuItem-root': {
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
    },
  },
}));

// ColorCircle component for color selection
const ColorCircle = ({ color, onClick, isSelected }) => (
  <Box
    onClick={onClick}
    sx={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      backgroundColor: color,
      margin: '0 4px',
      cursor: 'pointer',
      border: `2px solid ${isSelected ? '#3498db' : 'transparent'}`,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      },
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {isSelected && (
      <CheckIcon 
        sx={{ 
          color: '#ffffff', 
          fontSize: 16,
          position: 'absolute',
          filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))',
        }} 
      />
    )}
  </Box>
);

// CardItem component
export const CardItem = React.memo(({ card, index, onEdit, onDelete, onPin, onChangeColor, isSharedView }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle opening the menu
  const handleMenuOpen = useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  // Handle closing the menu
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Handle editing the card
  const handleEdit = useCallback(() => {
    onEdit(card.id);
    handleMenuClose();
  }, [card.id, onEdit, handleMenuClose]);

  // Handle deleting the card
  const handleDelete = useCallback(() => {
    onDelete(card.id);
    handleMenuClose();
  }, [card.id, onDelete, handleMenuClose]);

  // Handle pinning/unpinning the card
  const handlePin = useCallback(() => {
    onPin(card.id, !card.isPinned);
    handleMenuClose();
  }, [card, onPin, handleMenuClose]);

  // Handle changing the card color
  const handleChangeColor = useCallback((color) => {
    onChangeColor(card.id, color);
    handleMenuClose();
  }, [card.id, onChangeColor, handleMenuClose]);

  return (
    <Draggable draggableId={`card-${card.id}`} index={index} isDragDisabled={isSharedView}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <StyledCard
            isPinned={card.isPinned}
            isDragging={snapshot.isDragging}
            color={card.color}
          >
            <PushPinIcon
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: card.isPinned ? '#3498db' : 'transparent',
                transform: card.isPinned ? 'rotate(45deg)' : 'none',
                transition: 'all 0.3s ease-in-out',
              }}
            />
            <CardContent sx={{ padding: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    color: '#34495e',
                  }}
                >
                  {card.subject}
                </Typography>
                {!isSharedView && (
                  <IconButton 
                    size="small" 
                    onClick={handleMenuOpen} 
                    sx={{ 
                      marginLeft: '8px', 
                      marginTop: '-4px', 
                      flexShrink: 0,
                      color: '#7f8c8d',
                      '&:hover': {
                        color: '#34495e',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                      },
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </Box>
              <CardMedia
                component="img"
                height="140"
                image={`${process.env.REACT_APP_BACKEND_URL}/uploads/${card.image}`}
                alt={card.subject}
                sx={{ objectFit: 'cover', marginBottom: '8px', borderRadius: '8px' }}
              />
              {card.content && (
                <Typography
                  variant="body2"
                  sx={{
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    color: '#7f8c8d',
                  }}
                >
                  {card.content}
                </Typography>
              )}
            </CardContent>
            {!isSharedView && (
              <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <OpenInNewIcon fontSize="small" sx={{ marginRight: 1, color: '#3498db' }} />
                  Open card
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" sx={{ marginRight: 1, color: '#2ecc71' }} />
                  Edit card
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <DeleteIcon fontSize="small" sx={{ marginRight: 1, color: '#e74c3c' }} />
                  Delete card
                </MenuItem>
                <MenuItem onClick={handlePin}>
                  <PushPinIcon fontSize="small" sx={{ marginRight: 1, color: '#f39c12' }} />
                  {card.isPinned ? 'Unpin card' : 'Pin card'}
                </MenuItem>
                <MenuItem>
                  <PaletteIcon fontSize="small" sx={{ marginRight: 1, color: '#9b59b6' }} />
                  Change color
                  <Box display="flex" ml={1}>
                    {['#ffffff', '#ffdada', '#fff4ce', '#ffeb3b', '#deffdd', '#bbeaff', '#eed8ff'].map((color) => (
                      <ColorCircle
                        key={color}
                        color={color}
                        onClick={() => handleChangeColor(color)}
                        isSelected={card.color === color}
                      />
                    ))}
                  </Box>
                </MenuItem>
              </StyledMenu>
            )}
          </StyledCard>
        </div>
      )}
    </Draggable>
  );
});

export default CardItem;