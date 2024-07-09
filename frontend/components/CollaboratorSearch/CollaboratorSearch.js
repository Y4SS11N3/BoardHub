import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, List, ListItem, ListItemText, Typography, Alert } from '@mui/material';
import { searchUsers, addCollaborator } from '../../redux/actions/collaborationActions';

const CollaboratorSearch = ({ boardId, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const searchResults = useSelector(state => state.collaboration.searchResults);
  const searchError = useSelector(state => state.collaboration.searchError);

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (searchTerm.length < 2) {
      setLocalError('Search term must be at least 2 characters long');
      return;
    }
    try {
      await dispatch(searchUsers(searchTerm));
    } catch (error) {
      // Handle error
      setLocalError('An error occurred while searching. Please try again.');
    }
  };

  // Handle adding a collaborator
  const handleAddCollaborator = async (user) => {
    try {
      await dispatch(addCollaborator(boardId, user.email, 'editor'));
      onClose();
    } catch (error) {
      // Handle error
      setLocalError('Failed to add collaborator. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for users by username or email"
          fullWidth
          margin="normal"
          error={!!localError}
          helperText={localError}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>
      
      {searchError && <Alert severity="error" sx={{ mt: 2 }}>{searchError}</Alert>}
      
      {!searchError && searchResults.length === 0 && searchTerm.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No users found matching "{searchTerm}". Try a different search term.
        </Alert>
      )}
      
      {searchResults.length > 0 && (
        <List>
          {searchResults.map(user => (
            <ListItem key={user.id} button onClick={() => handleAddCollaborator(user)}>
              <ListItemText primary={user.username} secondary={user.email} />
            </ListItem>
          ))}
        </List>
      )}
      
      {!searchResults.length && !searchError && !localError && (
        <Typography sx={{ mt: 2 }}>
          Enter a username or email to search for collaborators
        </Typography>
      )}
    </div>
  );
};

export default CollaboratorSearch;