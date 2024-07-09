import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemAvatar, ListItemText, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import debounce from 'lodash/debounce';
import api from '../../services/api';
import UserAvatar from '../UserAvatar/UserAvatar';

// Styled components
const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  marginBottom: theme.spacing(2),
}));

const SearchResultsList = styled(List)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius,
  zIndex: 1,
  maxHeight: '300px',
  overflowY: 'auto',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(52, 73, 94, 0.2)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(52, 73, 94, 0.3)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#3498db',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const UserSearch = ({ onSelectUser, onSearchError }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  // Handle color generation for UserAvatar
  const handleColorGenerated = (color) => {
    // Color generation logic here if needed
  };

  // Debounced search function
  const debouncedSearch = debounce(async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      setError(null);
      onSearchError(null);
      return;
    }

    try {
      const response = await api.get(`/users/search?term=${term}`);
      setSearchResults(response.data);
      setError(null);
      if (response.data.length === 0) {
        const errorMessage = `No users found matching "${term}"`;
        setError(errorMessage);
        onSearchError(errorMessage);
      } else {
        onSearchError(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred while searching users';
      setSearchResults([]);
      setError(errorMessage);
      onSearchError(errorMessage);
    }
  }, 300);

  // Effect to trigger search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle user selection
  const handleSelectUser = (user) => {
    onSelectUser(user);
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
    onSearchError(null);
  };

  return (
    <SearchContainer>
      <StyledTextField
        fullWidth
        variant="outlined"
        label="Search users"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Enter username or email"
        error={!!error}
        helperText={error}
        InputProps={{
          style: { color: '#34495e' },
        }}
        InputLabelProps={{
          style: { color: '#7f8c8d' },
        }}
      />
      {searchResults.length > 0 && (
        <SearchResultsList>
          {searchResults.map((user) => (
            <StyledListItem
              key={user.id}
              button
              onClick={() => handleSelectUser(user)}
            >
              <ListItemAvatar>
                <UserAvatar
                  name={user.fullName}
                  width="40px"
                  height="40px"
                  fontSize="16px"
                  avatarUrl={user.avatarUrl}
                  onColorGenerated={handleColorGenerated}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" style={{ color: '#34495e', fontWeight: 'bold' }}>
                    {user.fullName}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      style={{ color: '#7f8c8d' }}
                    >
                      @{user.username}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      style={{ color: '#95a5a6' }}
                    >
                      {" — "}{user.email}
                    </Typography>
                  </React.Fragment>
                }
              />
            </StyledListItem>
          ))}
        </SearchResultsList>
      )}
    </SearchContainer>
  );
};

export default UserSearch;