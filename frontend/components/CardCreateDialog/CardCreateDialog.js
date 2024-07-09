import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    TextField,
    Button,
    Box,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageIcon from '@mui/icons-material/Image';
import AddIcon from '@mui/icons-material/Add';

// Define keyframe animations
const pulse = keyframes`
  0%, 100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Loading animation component
const LoadingAnimation = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100px',
        height: '100px',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '4px solid transparent',
          borderTopColor: '#ff0080',
          borderRadius: '50%',
          animation: `${rotate} 1s linear infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80%',
          height: '80%',
          border: '4px solid transparent',
          borderRightColor: '#00ff80',
          borderRadius: '50%',
          animation: `${rotate} 1.5s linear infinite reverse`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '60%',
          height: '60%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: `${pulse} 1s ease-in-out infinite`,
        }}
      />
    </Box>
  );
};

// Card Create Dialog component
const CardCreateDialog = ({ open, onClose, onPublish, onMinimize, draftId, editCard }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update state when editing an existing card
  useEffect(() => {
    if (editCard) {
      setSubject(editCard.subject || '');
      setContent(editCard.content || '');
      setImage(null);
      setImagePreview(null);
      setIsEditing(true);
    } else {
      setSubject('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      setIsEditing(false);
    }
  }, [editCard]);

  // Handle subject input change
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  // Handle content input change
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setIsProcessing(true);

    // Simulate preprocessing
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }, 2000); // 2 second delay to simulate preprocessing
  };

  // Handle removing uploaded image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Handle publishing or updating card
  const handlePublish = () => {
    if (subject.trim() !== '' || content.trim() !== '' || image !== null) {
      onPublish(subject, content, image, isEditing ? editCard.id : null);
      setSubject('');
      setContent('');
      setImage(null);
      setImagePreview(null);
    }
  };

  const isPublishDisabled = subject.trim() === '' && content.trim() === '' && image === null;

  const showIcons = !imagePreview && !isProcessing;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        style: {
          borderRadius: '20px 20px 0 0',
          margin: 0,
          width: '480px',
          height: '580px',
          position: 'absolute',
          right: 160,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2, 
        borderBottom: '1px solid #eee'
      }}>
        <Box>
          <IconButton onClick={onClose} size="small" sx={{ mr: 1 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onMinimize} size="small">
            <MinimizeIcon fontSize="small" />
          </IconButton>
        </Box>
        <Button 
          onClick={handlePublish}
          disabled={isPublishDisabled}
          sx={{ 
            color: isPublishDisabled ? '#ccc' : 'white',
            backgroundColor: isPublishDisabled ? 'transparent' : '#ff0080',
            fontSize: '0.875rem',
            textTransform: 'none',
            '&:hover': { backgroundColor: isPublishDisabled ? 'transparent' : '#ff0080' } 
          }}
        >
          {isEditing ? 'Update' : 'Publish'}
        </Button>
      </Box>
      <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Subject"
          value={subject}
          onChange={handleSubjectChange}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box 
          sx={{ 
            backgroundColor: '#f0f0f0', 
            backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '10px', 
            p: 10, 
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            minHeight: '200px',
          }}
        >
          {showIcons && (
            <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <IconButton sx={{ backgroundColor: '#e0e0ff', p: 1 }}>
                <InsertDriveFileIcon sx={{ fontSize: 24, color: '#6060ff' }} />
              </IconButton>
              <IconButton sx={{ backgroundColor: '#e0e0ff', p: 1 }}>
                <LinkIcon sx={{ fontSize: 24, color: '#6060ff' }} />
              </IconButton>
              <IconButton sx={{ backgroundColor: '#e0f0ff', p: 1 }}>
                <CameraAltIcon sx={{ fontSize: 24, color: '#4080ff' }} />
              </IconButton>
              <IconButton component="label" sx={{ backgroundColor: '#fff0e0', p: 1 }}>
                <ImageIcon sx={{ fontSize: 24, color: '#ff8040' }} />
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </IconButton>
            </Box>
          )}
          {showIcons && (
            <Button 
              startIcon={<AddIcon />}
              sx={{ 
                color: 'red', 
                backgroundColor: '#ffe0e0',
                minWidth: 0, 
                p: '6px 12px', 
                fontSize: '0.875rem',
                borderRadius: '20px',
              }}
            >
              12
            </Button>
          )}
          {isProcessing && <LoadingAnimation />}
          {imagePreview && (
            <IconButton 
              onClick={handleRemoveImage} 
              sx={{ 
                position: 'absolute', 
                bottom: 8, 
                right: 8, 
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <TextField
          fullWidth
          multiline
          value={content}
          onChange={handleContentChange}
          placeholder="Write something fantastic..."
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ flexGrow: 1, overflow: 'auto' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CardCreateDialog;