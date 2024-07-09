import api from '../../services/api';
import { formatCardData } from '../../utils/cardUtils';
import { getBoard } from './boardActions';

// Action type constants
export const FETCH_CARDS_REQUEST = 'FETCH_CARDS_REQUEST';
export const FETCH_CARDS_SUCCESS = 'FETCH_CARDS_SUCCESS';
export const FETCH_CARDS_FAILURE = 'FETCH_CARDS_FAILURE';
export const FETCH_CARD_REQUEST = 'FETCH_CARD_REQUEST';
export const FETCH_CARD_SUCCESS = 'FETCH_CARD_SUCCESS';
export const FETCH_CARD_FAILURE = 'FETCH_CARD_FAILURE';
export const CREATE_CARD_REQUEST = 'CREATE_CARD_REQUEST';
export const CREATE_CARD_SUCCESS = 'CREATE_CARD_SUCCESS';
export const CREATE_CARD_FAILURE = 'CREATE_CARD_FAILURE';
export const DELETE_CARD_REQUEST = 'DELETE_CARD_REQUEST';
export const DELETE_CARD_SUCCESS = 'DELETE_CARD_SUCCESS';
export const DELETE_CARD_FAILURE = 'DELETE_CARD_FAILURE';
export const FETCH_USER_CARDS_REQUEST = 'FETCH_USER_CARDS_REQUEST';
export const FETCH_USER_CARDS_SUCCESS = 'FETCH_USER_CARDS_SUCCESS';
export const FETCH_USER_CARDS_FAILURE = 'FETCH_USER_CARDS_FAILURE';
export const UPDATE_CARD_REQUEST = 'UPDATE_CARD_REQUEST';
export const UPDATE_CARD_FAILURE = 'UPDATE_CARD_FAILURE';
export const UPDATE_CARD_SUCCESS = 'UPDATE_CARD_SUCCESS';
export const PIN_CARD = 'PIN_CARD';
export const PIN_CARD_REQUEST = 'PIN_CARD_REQUEST';
export const PIN_CARD_SUCCESS = 'PIN_CARD_SUCCESS';
export const PIN_CARD_FAILURE = 'PIN_CARD_FAILURE';
export const TOGGLE_CARD_SECTIONS = 'TOGGLE_CARD_SECTIONS';
export const ADD_CARD_SECTION = 'ADD_CARD_SECTION';
export const SET_CURRENT_CARD = 'SET_CURRENT_CARD';
export const REORDER_CARDS = 'REORDER_CARDS';
export const REORDER_CARDS_SUCCESS = 'REORDER_CARDS_SUCCESS';
export const REORDER_CARDS_FAILURE = 'REORDER_CARDS_FAILURE';

// Reorder cards in a board
export const reorderCards = (boardId, cardIds) => async (dispatch) => {
  try {
    const response = await api.put(`/boards/${boardId}/reorder-cards`, { cardIds });
    dispatch({
      type: REORDER_CARDS_SUCCESS,
      payload: { boardId, cards: response.data },
    });
    dispatch(getBoard(boardId));
    return response.data;
  } catch (error) {
    dispatch({
      type: REORDER_CARDS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Toggle card sections
export const toggleCardSections = (cardId, enabled) => async (dispatch) => {
  try {
    const response = await api.patch(`/cards/${cardId}/toggle-sections`, { enabled });
    dispatch({
      type: TOGGLE_CARD_SECTIONS,
      payload: { cardId, enabled: response.data.sectionsEnabled },
    });
  } catch (error) {
    dispatch({ 
      type: 'TOGGLE_SECTIONS_ERROR',
      payload: error.message
    });
  }
};

// Add a section to a card
export const addCardSection = (cardId) => async (dispatch) => {
  try {
    const response = await api.post(`/cards/${cardId}/sections`);
    dispatch({
      type: ADD_CARD_SECTION,
      payload: { cardId, section: response.data },
    });
  } catch (error) {
    dispatch({ 
      type: 'ADD_SECTION_ERROR',
      payload: error.message
    });
  }
};

// Set the current card
export const setCurrentCard = (card) => ({
  type: SET_CURRENT_CARD,
  payload: card,
});

// Action creators
export const pinCardRequest = () => ({ type: PIN_CARD_REQUEST });
export const pinCardSuccess = (card) => ({
  type: PIN_CARD_SUCCESS,
  payload: card,
});
export const pinCardFailure = (error) => ({
  type: PIN_CARD_FAILURE,
  payload: error,
});

export const updateCardRequest = () => ({ type: UPDATE_CARD_REQUEST });
export const updateCardSuccess = (card) => ({
  type: UPDATE_CARD_SUCCESS,
  payload: card,
});
export const updateCardFailure = (error) => ({
  type: UPDATE_CARD_FAILURE,
  payload: error,
});

export const fetchCardsRequest = () => ({ type: FETCH_CARDS_REQUEST });
export const fetchCardsSuccess = (cards) => ({
  type: FETCH_CARDS_SUCCESS,
  payload: cards,
});
export const fetchCardsFailure = (error) => ({
  type: FETCH_CARDS_FAILURE,
  payload: error,
});

export const fetchCardRequest = () => ({ type: FETCH_CARD_REQUEST });
export const fetchCardSuccess = (card) => ({
  type: FETCH_CARD_SUCCESS,
  payload: card,
});
export const fetchCardFailure = (error) => ({
  type: FETCH_CARD_FAILURE,
  payload: error,
});

export const createCardRequest = () => ({ type: CREATE_CARD_REQUEST });
export const createCardSuccess = (card) => ({
  type: CREATE_CARD_SUCCESS,
  payload: card,
});
export const createCardFailure = (error) => ({
  type: CREATE_CARD_FAILURE,
  payload: error,
});

export const deleteCardRequest = () => ({ type: DELETE_CARD_REQUEST });
export const deleteCardSuccess = (cardId) => ({
  type: DELETE_CARD_SUCCESS,
  payload: cardId,
});
export const deleteCardFailure = (error) => ({
  type: DELETE_CARD_FAILURE,
  payload: error,
});

export const fetchUserCardsRequest = () => ({
  type: FETCH_USER_CARDS_REQUEST,
});
export const fetchUserCardsSuccess = (cards) => ({
  type: FETCH_USER_CARDS_SUCCESS,
  payload: cards,
});
export const fetchUserCardsFailure = (error) => ({
  type: FETCH_USER_CARDS_FAILURE,
  payload: error,
});

// Fetch all cards for a board
export const fetchCards = (boardId) => {
  return async (dispatch) => {
    dispatch(fetchCardsRequest());
    try {
      const response = await api.get(`/boards/${boardId}/cards`);
      dispatch(fetchCardsSuccess(response.data));
    } catch (error) {
      dispatch(fetchCardsFailure(error.response.data.error));
    }
  };
};

// Fetch a single card
export const fetchCard = (cardId) => {
  return async (dispatch) => {
    dispatch(fetchCardRequest());
    try {
      const response = await api.get(`/cards/${cardId}`);
      dispatch(fetchCardSuccess(response.data));
    } catch (error) {
      dispatch(fetchCardFailure(error.response.data.error));
    }
  };
};

// Create a new card
export const createCard = (cardData) => async (dispatch) => {
  dispatch({ type: CREATE_CARD_REQUEST });
  try {
    const formData = new FormData();
    for (let key in cardData) {
      if (cardData[key] !== null && cardData[key] !== undefined) {
        formData.append(key, cardData[key]);
      }
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const response = await api.post('/cards', formData, config);
    const newCard = formatCardData(response.data);
    dispatch({ type: CREATE_CARD_SUCCESS, payload: newCard });
    
    dispatch(getBoard(cardData.boardId));
    
    return newCard;
  } catch (error) {
    const errorMessage = error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : 'An error occurred while creating the card';
    dispatch({ type: CREATE_CARD_FAILURE, payload: errorMessage });
    throw new Error(errorMessage);
  }
};

// Get user cards for a board
export const getUserCards = (boardId) => async (dispatch) => {
  dispatch({ type: FETCH_USER_CARDS_REQUEST });
  try {
    const response = await api.get(`/boards/${boardId}/cards`);
    dispatch({ type: FETCH_USER_CARDS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: FETCH_USER_CARDS_FAILURE, payload: error.message });
    throw error;
  }
};

// Delete a card
export const deleteCard = (cardId) => {
  return async (dispatch) => {
    dispatch(deleteCardRequest());
    try {
      await api.delete(`/cards/${cardId}`);
      dispatch(deleteCardSuccess(cardId));
    } catch (error) {
      dispatch(deleteCardFailure(error.response?.data?.error || 'An error occurred while deleting the card'));
    }
  };
};

// Update a card
export const updateCard = (cardId, updateData) => async (dispatch) => {
  dispatch(updateCardRequest());
  try {
    const formData = new FormData();
    for (let key in updateData) {
      if (updateData[key] !== null && updateData[key] !== undefined) {
        formData.append(key, updateData[key]);
      }
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.put(`/cards/${cardId}`, formData, config);
    const updatedCard = formatCardData(response.data);
    dispatch(updateCardSuccess(updatedCard));
    return updatedCard;
  } catch (error) {
    dispatch(updateCardFailure(error.response?.data?.error || 'An error occurred while updating the card'));
    throw error;
  }
};

// Pin or unpin a card
export const pinCard = (cardId, isPinned) => async (dispatch, getState) => {
  dispatch(pinCardRequest());
  try {
    const { card, board } = getState();
    const cardToUpdate = card.userCards.find(c => c.id === cardId);
    const boardId = board.currentBoard?.boardId;
    
    if (!boardId) {
      throw new Error('Board ID is undefined');
    }

    const updatedCard = await api.patch(`/cards/${cardId}/pin`, { isPinned, boardId });
    
    dispatch(pinCardSuccess(updatedCard.data));
    
    dispatch(getBoard(boardId));
    
    return updatedCard.data;
  } catch (error) {
    dispatch(pinCardFailure(error.response?.data?.error || error.message));
    throw error;
  }
};