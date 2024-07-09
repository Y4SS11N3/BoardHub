import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Box, 
  IconButton, 
  Typography, 
  AppBar, 
  Toolbar, 
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getBoard, getSharedBoard } from '../../redux/actions/boardActions';
import ShareDialog from '../../components/ShareDialog/ShareDialog';

// Function to lighten a color
const lightenColor = (color, amount) => {
  if (!color) return 'rgb(200, 200, 200)';
  const rgbValues = color.slice(4, -1).split(',').map(Number);
  const lightenedColor = rgbValues.map(value => Math.min(255, value + amount));
  return `rgb(${lightenedColor.join(',')})`;
};

const SlideShowPage = () => {
  const { username, boardId, type, id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [fetchedBoard, setFetchedBoard] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef(null);
  const [showScrollIcon, setShowScrollIcon] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const isSharedSlideshow = location.pathname.includes('shared-slideshow');
  const shareToken = isSharedSlideshow ? location.pathname.split('/').pop() : null;

  // Fetch board data
  useEffect(() => {
    const fetchData = async () => {
      try {
        let board;
        if (isSharedSlideshow) {
          board = await dispatch(getSharedBoard(shareToken));
        } else {
          board = await dispatch(getBoard(boardId));
        }

        if (!board.dominantColor) {
          board.dominantColor = 'rgb(148, 84, 192)'; // Default color
        }

        setFetchedBoard(board);

        if (board) {
          const newSlides = [
            { type: 'title', content: board },
            ...(board.cards || []).map(card => ({ type: 'card', content: card }))
          ];
          setSlides(newSlides);
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, [dispatch, boardId, shareToken, isSharedSlideshow]);

  // Set initial slide index
  useEffect(() => {
    if (slides.length > 0) {
      const index = slides.findIndex(slide => 
        (slide.type === type && slide.content.id === id) ||
        (type === undefined && id === undefined && slide.type === 'title')
      );
      setCurrentSlideIndex(index !== -1 ? index : 0);
    }
  }, [slides, type, id]);

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        setShowScrollIcon(scrollHeight > clientHeight);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    return () => window.removeEventListener('resize', checkScrollable);
  }, [slides, currentSlideIndex]);

  // Handle next slide
  const handleNext = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  // Handle previous slide
  const handlePrev = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  // Handle close slideshow
  const handleClose = () => {
    window.close();
  };

  // Handle content scroll
  const handleScroll = () => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  // Handle fullscreen toggle
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle share click
  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Render current slide
  const renderSlide = useCallback(() => {
    const slide = slides[currentSlideIndex];
    if (!slide) return null;

    const getFullImageUrl = (imagePath) => {
      if (!imagePath) return null;
      return `${process.env.REACT_APP_BACKEND_URL}/uploads/${imagePath}`;
    };

    const dominantColor = fetchedBoard?.dominantColor || 'rgb(148, 84, 192)';
    const lightBackgroundColor = lightenColor(dominantColor, 40);

    switch (slide.type) {
      case 'title':
        return (
          <Box 
            className="grid h-full w-full" 
            sx={{
              gridTemplateRows: '60% 40%',
              backgroundImage: `url(/board-backgrounds/${slide.content.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Box />
            <Box 
              sx={{
                backgroundColor: dominantColor,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 4,
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{
                  color: 'white',
                  fontSize: '1.5rem',
                  marginBottom: 2,
                }}
              >
                {slide.content.user?.username || username}
              </Typography>
              <Typography 
                variant="h2" 
                sx={{
                  color: 'white',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                }}
              >
                {slide.content.title}
              </Typography>
            </Box>
          </Box>
        );
      case 'card':
        const imageUrl = getFullImageUrl(slide.content.image);
        return (
          <Box 
            className={`grid h-full w-full ${imageUrl ? 'grid-cols-2' : ''}`}
            sx={{
              backgroundColor: lightBackgroundColor,
              position: 'relative',
            }}
          >
            {imageUrl ? (
              <>
                <Box className="p-12 flex flex-col justify-center" sx={{ position: 'relative', height: '100%' }}>
                  <Box className="mb-8">
                    <Typography 
                      variant="h3" 
                      sx={{
                        color: fetchedBoard?.dominantColor,
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: 4,
                      }}
                    >
                      {slide.content.subject}
                    </Typography>
                  </Box>
                  <Box 
                    ref={contentRef}
                    sx={{
                      overflowY: 'auto',
                      maxHeight: '300px',
                      borderRadius: '8px',
                      padding: '16px',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: '#111111',
                        fontSize: '1.25rem',
                      }}
                    >
                      {slide.content.content}
                    </Typography>
                  </Box>
                  {showScrollIcon && (
                    <IconButton
                      onClick={handleScroll}
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                      }}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                  )}
                </Box>
                <Box className="p-8 flex items-center justify-center">
                  <img 
                    src={imageUrl}
                    alt={slide.content.subject}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Box>
              </>
            ) : (
              <Box className="p-8 flex flex-col justify-center items-center" sx={{ position: 'relative', height: '100%' }}>
                <Typography 
                  variant="h3" 
                  sx={{
                    color: fetchedBoard?.dominantColor,
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: 4,
                    textAlign: 'center',
                  }}
                >
                  {slide.content.subject}
                </Typography>
                <Box 
                  ref={contentRef}
                  sx={{
                    overflowY: 'auto',
                    maxHeight: '300px',
                    width: '80%',
                    borderRadius: '8px',
                    padding: '16px',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{
                      color: '#111111',
                      fontSize: '1.25rem',
                      textAlign: 'center',
                    }}
                  >
                    {slide.content.content}
                  </Typography>
                </Box>
                {showScrollIcon && (
                  <IconButton
                    onClick={handleScroll}
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                    }}
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                )}
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  }, [slides, currentSlideIndex, fetchedBoard, username, showScrollIcon, handleScroll]);

  if (!fetchedBoard) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box 
      className="relative" 
      sx={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      <Box 
        className="absolute inset-0 flex items-center justify-center"
        sx={{ zIndex: 1 }}
      >
        {renderSlide()}
      </Box>
      <AppBar 
        position="absolute" 
        elevation={0}
        sx={{
          top: 'auto',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'auto',
          maxWidth: '90%',
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', padding: '8px 16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={handleShareClick}
              sx={{ 
                color: 'common.white', 
                marginRight: 1,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <ShareIcon sx={{ fontSize: 24 }} />
            </IconButton>
            <IconButton 
              onClick={handleFullscreen}
              sx={{ 
                color: 'common.white', 
                marginRight: 2,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <FullscreenIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
          <Box className="flex justify-between items-center">
            <IconButton 
              onClick={handlePrev} 
              disabled={slides.length <= 1} 
              sx={{ 
                color: 'common.white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <Typography sx={{ color: 'common.white', fontSize: 18, mx: 2 }}>
            {`${currentSlideIndex + 1} / ${slides.length}`}
            </Typography>
            <IconButton 
              onClick={handleNext} 
              disabled={slides.length <= 1} 
              sx={{ 
                color: 'common.white',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              color: 'common.white', 
              marginLeft: 2,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        boardId={boardId}
        existingShareToken={fetchedBoard?.shareToken}
        isSlideshow={true}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        sx={{ bottom: { xs: 90, sm: 0 } }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SlideShowPage;