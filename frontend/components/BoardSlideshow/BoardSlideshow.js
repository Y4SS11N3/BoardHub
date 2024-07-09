import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, IconButton, Typography, Box } from '@mui/material';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';

const BoardSlideshow = ({ open, onClose, boardId }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const board = useSelector(state => state.board.currentBoard);
  const cards = useSelector(state => state.card.userCards);

  // Reset current slide when the slideshow opens or board/cards change
  useEffect(() => {
    setCurrentSlide(0);
  }, [open, boardId, board, cards]);

  // Return null if there's no board or cards
  if (!board || !cards.length) {
    return null;
  }

  // Create slides array with board title and cards
  const slides = [
    { type: 'title', content: board },
    ...cards.map(card => ({ type: 'card', content: card }))
  ];

  // Handle moving to the previous slide
  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  // Handle moving to the next slide
  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  // Render the current slide
  const renderSlide = (slide) => {
    if (slide.type === 'title') {
      return (
        <Box className="flex flex-col items-center justify-center h-full">
          <Typography variant="h2" className="mb-4">{slide.content.title}</Typography>
          <Typography variant="h4">{slide.content.user?.username}</Typography>
        </Box>
      );
    } else {
      const card = slide.content;
      return (
        <Box className="flex h-full">
          <Box className="w-1/2 p-4 flex items-center justify-center">
            {card.image && (
              <img src={card.image} alt={card.subject} className="max-w-full max-h-full object-contain" />
            )}
          </Box>
          <Box className="w-1/2 p-4 flex flex-col justify-center">
            <Typography variant="h4" className="mb-4">{card.subject}</Typography>
            <Typography variant="body1">{card.content}</Typography>
          </Box>
        </Box>
      );
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <Box className="relative w-full h-full bg-gray-100 flex items-center justify-center">
        <IconButton
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <Close />
        </IconButton>
        <IconButton
          onClick={handlePrevSlide}
          className="absolute left-4 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={handleNextSlide}
          className="absolute right-4 text-gray-600 hover:text-gray-800"
        >
          <ChevronRight />
        </IconButton>
        <Box className="w-full h-full p-8">
          {renderSlide(slides[currentSlide])}
        </Box>
      </Box>
    </Dialog>
  );
};

export default BoardSlideshow;