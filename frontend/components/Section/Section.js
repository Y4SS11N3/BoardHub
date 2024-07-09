import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Droppable } from 'react-beautiful-dnd';
import CardItem from '../CardItem/CardItem';

// Component to render a single section with its cards
const Section = ({ section, index, cards, onAddCard, onEditCard, onDeleteCard, onPinCard, onChangeCardColor }) => {
  return (
    <Box>
      <Typography variant="h6">{section.title}</Typography>
      <IconButton onClick={() => onAddCard(section.id)}>
        <AddIcon />
      </IconButton>
      <Droppable droppableId={section.id} type="CARD">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
                onPin={onPinCard}
                onChangeColor={onChangeCardColor}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
};

export default Section;