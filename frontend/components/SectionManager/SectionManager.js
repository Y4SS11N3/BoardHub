import React from 'react';
import { Box, Typography, CardContent } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { CardItem } from '../CardItem/CardItem';

// Component to manage and render sections and cards
const SectionManager = ({
  board,
  sections,
  sortedCards,
  handleEditCard,
  handleDeleteCard,
  handlePinCard,
  handleChangeCardColor,
}) => {
  // Function to render sections and cards based on whether sections are enabled
  const renderSectionsAndCards = () => {
    if (board?.sectionsEnabled) {
      return sections.map((section) => (
        <Droppable droppableId={section.id} key={section.id}>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              <Typography variant="h6">{section.title}</Typography>
              <CardContent>
                {section.cards.map((cardId, index) => {
                  const card = sortedCards.find(c => c.id === cardId);
                  return card ? (
                    <Draggable 
                      key={card.id} 
                      draggableId={card.id.toString()} 
                      index={index}
                      disableInteractiveElementBlocking={true}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <CardItem
                            card={card}
                            onEdit={handleEditCard}
                            onDelete={handleDeleteCard}
                            onPin={handlePinCard}
                            onChangeColor={handleChangeCardColor}
                          />
                        </div>
                      )}
                    </Draggable>
                  ) : null;
                })}
                {provided.placeholder}
              </CardContent>
            </Box>
          )}
        </Droppable>
      ));
    } else {
      return (
        <CardContent>
          {sortedCards.map((card, index) => (
            <CardItem
              key={`${card.id}-${index}`}
              card={card}
              index={index}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
              onPin={handlePinCard}
              onChangeColor={handleChangeCardColor}
            />
          ))}
        </CardContent>
      );
    }
  };

  return renderSectionsAndCards();
};

export default SectionManager;