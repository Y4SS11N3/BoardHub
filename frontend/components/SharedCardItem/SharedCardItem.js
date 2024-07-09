import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { Draggable } from 'react-beautiful-dnd';
import PushPinIcon from '@mui/icons-material/PushPin';

// Styled components
const StyledCard = styled(Card)(({ theme, isPinned, isDragging, color }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out, border 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  border: isPinned ? '2px solid #ff9800' : 'none',
  position: 'relative',
  backgroundColor: isDragging ? '#f5f5f5' : color || 'white',
  width: '300px',
  minHeight: '100px',
  margin: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const StyledSubject = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '8px',
  wordWrap: 'break-word',
  wordBreak: 'break-word',
});

const StyledContent = styled(Typography)({
  wordWrap: 'break-word',
  wordBreak: 'break-word',
});

const PinIcon = styled(PushPinIcon)(({ theme, isPinned }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  color: isPinned ? '#ff9800' : 'transparent',
  transform: isPinned ? 'rotate(45deg)' : 'none',
  transition: 'color 0.2s ease-in-out, transform 0.2s ease-in-out',
}));

// SharedCardItem component
const SharedCardItem = React.memo(({ card, index }) => {
  return (
    <Draggable draggableId={String(card.id)} index={index} isDragDisabled={true}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <StyledCard isPinned={card.isPinned} isDragging={snapshot.isDragging} color={card.color}>
            <PinIcon isPinned={card.isPinned} />
            <StyledCardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <StyledSubject variant="subtitle1">
                  {card.subject}
                </StyledSubject>
              </Box>
              {card.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={`${process.env.REACT_APP_BACKEND_URL}/uploads/${card.image}`}
                  alt={card.subject}
                  sx={{ objectFit: 'cover', marginBottom: '8px', borderRadius: '4px' }}
                />
              )}
              {card.content && (
                <StyledContent variant="body2" color="text.secondary">
                  {card.content}
                </StyledContent>
              )}
            </StyledCardContent>
          </StyledCard>
        </div>
      )}
    </Draggable>
  );
});

export default SharedCardItem;