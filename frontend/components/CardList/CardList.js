import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { CardItem } from '../CardItem/CardItem';
import './CardList.css';

const CardList = ({ cards, onCreateCard, onUpdateCard, onDeleteCard }) => {
  const [newCardTitle, setNewCardTitle] = useState('');
  const user = useSelector((state) => state.auth.user);

  // Handle creating a new card
  const handleCreateCard = () => {
    if (newCardTitle.trim() !== '') {
      onCreateCard({ title: newCardTitle });
      setNewCardTitle('');
    }
  };

  // Handle drag and drop of cards
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedCards = Array.from(cards);
    const [reorderedCard] = updatedCards.splice(result.source.index, 1);
    updatedCards.splice(result.destination.index, 0, reorderedCard);

    // Here you would typically dispatch an action to update the card order in your state
    // For example: dispatch(updateCardOrder(updatedCards));
  };

  return (
    <div className="card-list">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="card-list">
          {(provided) => (
            <div className="card-list__container" {...provided.droppableProps} ref={provided.innerRef}>
              {cards.map((card, index) => (
                <CardItem
                  key={card._id}
                  card={card}
                  index={index}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={onDeleteCard}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {user && (
        <div className="card-list__create-card">
          <input
            type="text"
            placeholder="Enter card title"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
          />
          <button onClick={handleCreateCard}>Create Card</button>
        </div>
      )}
    </div>
  );
};

export default CardList;