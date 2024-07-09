import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, IconButton, Popover, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShareIcon from '@mui/icons-material/Share';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import { updateBoard } from '../../redux/actions/boardActions';
import BoardFormatSelector from '../BoardFormatSelector/BoardFormatSelector';
import SectionToggle from '../SectionToggle/SectionToggle';
import PublicPrivateToggle from '../PublicPrivateToggle/PublicPrivateToggle';
import UserAvatar from '../UserAvatar/UserAvatar';

// Utility function to convert RGB to HSL
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Utility function to convert HSL to RGB
const hslToRgb = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// Utility function to lighten a color
const lightenColor = (color, amount) => {
  if (!color) return 'rgb(200, 200, 200)'; // Default light grey if no color provided

  const rgbValues = color.slice(4, -1).split(',').map(Number);
  
  let [h, s, l] = rgbToHsl(...rgbValues);
  
  l = Math.min(100, l + amount);
  
  const [r, g, b] = hslToRgb(h, s, l);
  
  return `rgb(${r}, ${g}, ${b})`;
};

// Styled components
const SidebarContainer = styled(Box)(({ theme, backgroundColor }) => ({
  position: 'fixed',
  right: 0,
  top: 0,
  bottom: 0,
  width: '80px',
  backgroundColor: lightenColor(backgroundColor, 20),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  zIndex: 1200,
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: '45px',
  height: '45px',
  borderRadius: '15px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const UserAvatarContainer = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  padding: 0,
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

// Main BoardSidebar component
const BoardSidebar = ({ 
  boardId,
  onToggleSections,
  onAddSection,
  onDeleteBoard,
  username,
  onShareClick,
  selectedFormat,
  onFormatChange,
  dominantColor,
  onCollaboratorClick,
  board
}) => {
  const dispatch = useDispatch();
  const [formatAnchorEl, setFormatAnchorEl] = useState(null);
  const [sectionAnchorEl, setSectionAnchorEl] = useState(null);
  const [visibilityAnchorEl, setVisibilityAnchorEl] = useState(null);
  const [avatarColor, setAvatarColor] = useState(null);
  const user = useSelector(state => state.user.user);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        // Handle error
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch((err) => {
          // Handle error
        });
      }
    }
  };

  // Effect to handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle format icon click
  const handleFormatClick = (event) => {
    setFormatAnchorEl(event.currentTarget);
  };

  // Handle format popover close
  const handleFormatClose = () => {
    setFormatAnchorEl(null);
  };

  // Handle section icon click
  const handleSectionClick = (event) => {
    setSectionAnchorEl(event.currentTarget);
  };

  // Handle section popover close
  const handleSectionClose = () => {
    setSectionAnchorEl(null);
  };

  // Handle avatar color generation
  const handleColorGenerated = (color) => {
    setAvatarColor(color);
  };

  // Handle visibility change
  const handleVisibilityChange = (event) => {
    if (board && boardId) {
      dispatch(updateBoard(boardId, { isPublic: event.target.checked }));
    }
  };

  // Handle visibility icon click
  const handleVisibilityClick = (event) => {
    setVisibilityAnchorEl(event.currentTarget);
  };

  // Handle visibility popover close
  const handleVisibilityClose = () => {
    setVisibilityAnchorEl(null);
  };

  // Effect to set avatar color on component mount
  useEffect(() => {
    const storedColor = localStorage.getItem(`userAvatarColor_${username}`);
    if (storedColor) {
      setAvatarColor(storedColor);
    }
  }, [username]);

  // Handle slideshow open
  const handleSlideshowOpen = () => {
    window.open(`/${username}/board/${boardId}/slideshow`, '_blank');
  };

  const formatOpen = Boolean(formatAnchorEl);
  const sectionOpen = Boolean(sectionAnchorEl);
  const visibilityOpen = Boolean(visibilityAnchorEl);
  
  return (
    <SidebarContainer backgroundColor={dominantColor}>
      <UserAvatarContainer>
        <UserAvatar
          name={username}
          width="32px"
          height="32px"
          fontSize="16px"
          onColorGenerated={handleColorGenerated}
          avatarUrl={user?.avatarUrl}
        />
      </UserAvatarContainer>
      <IconContainer>
        <StyledIconButton onClick={onShareClick}>
          <ShareIcon />
        </StyledIconButton>
      </IconContainer>
      <IconContainer>
        <StyledIconButton onClick={handleVisibilityClick}>
          <LockIcon />
        </StyledIconButton>
      </IconContainer>
      <IconContainer>
        <StyledIconButton onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </StyledIconButton>
      </IconContainer>
      <IconContainer>
        <StyledIconButton onClick={handleSlideshowOpen}>
          <PlayArrowIcon />
        </StyledIconButton>
      </IconContainer>
      <IconContainer>
        <StyledIconButton onClick={handleFormatClick}>
          <FormatPaintIcon />
        </StyledIconButton>
      </IconContainer>
      <IconContainer>
        <StyledIconButton onClick={handleSectionClick}>
          <ViewColumnIcon />
        </StyledIconButton>
      </IconContainer>
      <IconContainer>
        <StyledIconButton onClick={onCollaboratorClick}>
          <PeopleIcon />
        </StyledIconButton>
      </IconContainer>
      <Popover
        open={formatOpen}
        anchorEl={formatAnchorEl}
        onClose={handleFormatClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <BoardFormatSelector
            selectedFormat={selectedFormat}
            onFormatChange={(format) => {
              onFormatChange(format);
              handleFormatClose();
            }}
          />
        </Box>
      </Popover>
      <Popover
        open={sectionOpen}
        anchorEl={sectionAnchorEl}
        onClose={handleSectionClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <SectionToggle
            boardId={boardId}
            onToggle={onToggleSections}
            onAddSection={onAddSection}
          />
        </Box>
      </Popover>
      <Popover
        open={visibilityOpen}
        anchorEl={visibilityAnchorEl}
        onClose={handleVisibilityClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <PublicPrivateToggle boardId={boardId} />
        </Box>
      </Popover>
    </SidebarContainer>
  );
};

export default BoardSidebar;