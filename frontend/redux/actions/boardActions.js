import api from '../../services/api';
import { formatBoardData } from '../../utils/boardUtils';
import { v4 as uuidv4 } from 'uuid'; 
import { getUserCards } from './cardActions';
import * as shareService from '../../services/shareService';
import * as boardService from '../../services/boardService';
import * as folderService from '../../services/folderService';

// Action type constants
export const FETCH_BOARDS_REQUEST = 'FETCH_BOARDS_REQUEST';
export const FETCH_BOARDS_SUCCESS = 'FETCH_BOARDS_SUCCESS';
export const FETCH_BOARDS_FAILURE = 'FETCH_BOARDS_FAILURE';
export const FETCH_BOARD_REQUEST = 'FETCH_BOARD_REQUEST';
export const FETCH_BOARD_SUCCESS = 'FETCH_BOARD_SUCCESS';
export const FETCH_BOARD_FAILURE = 'FETCH_BOARD_FAILURE';
export const CREATE_BOARD_REQUEST = 'CREATE_BOARD_REQUEST';
export const CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
export const CREATE_BOARD_FAILURE = 'CREATE_BOARD_FAILURE';
export const DELETE_BOARD_REQUEST = 'DELETE_BOARD_REQUEST';
export const DELETE_BOARD_SUCCESS = 'DELETE_BOARD_SUCCESS';
export const DELETE_BOARD_FAILURE = 'DELETE_BOARD_FAILURE';
export const FETCH_USER_BOARDS_REQUEST = 'FETCH_USER_BOARDS_REQUEST';
export const FETCH_USER_BOARDS_SUCCESS = 'FETCH_USER_BOARDS_SUCCESS';
export const FETCH_USER_BOARDS_FAILURE = 'FETCH_USER_BOARDS_FAILURE';
export const UPDATE_BOARD_REQUEST = 'UPDATE_BOARD_REQUEST';
export const UPDATE_BOARD_FAILURE = 'UPDATE_BOARD_FAILURE';
export const UPDATE_BOARD_SUCCESS = 'UPDATE_BOARD_SUCCESS';
export const PIN_BOARD = 'PIN_BOARD';
export const PIN_BOARD_REQUEST = 'PIN_BOARD_REQUEST';
export const PIN_BOARD_SUCCESS = 'PIN_BOARD_SUCCESS';
export const PIN_BOARD_FAILURE = 'PIN_BOARD_FAILURE';
export const TOGGLE_SECTIONS = 'TOGGLE_SECTIONS';
export const ADD_SECTION = 'ADD_SECTION';
export const SET_CURRENT_BOARD = 'SET_CURRENT_BOARD';
export const UPDATE_SECTIONS = 'UPDATE_SECTIONS';
export const UPDATE_SECTIONS_SUCCESS = 'UPDATE_SECTIONS_SUCCESS';
export const UPDATE_SECTIONS_FAILURE = 'UPDATE_SECTIONS_FAILURE';
export const UPDATE_LAST_VIEWED = 'UPDATE_LAST_VIEWED';
export const SET_SORT_PREFERENCE = 'SET_SORT_PREFERENCE';
export const INITIALIZE_SORT_PREFERENCE = 'INITIALIZE_SORT_PREFERENCE';
export const FETCH_SHARED_BOARDS_REQUEST = 'FETCH_SHARED_BOARDS_REQUEST';
export const FETCH_SHARED_BOARDS_SUCCESS = 'FETCH_SHARED_BOARDS_SUCCESS';
export const FETCH_SHARED_BOARDS_FAILURE = 'FETCH_SHARED_BOARDS_FAILURE';
export const FETCH_TRASHED_BOARDS_REQUEST = 'FETCH_TRASHED_BOARDS_REQUEST';
export const FETCH_TRASHED_BOARDS_SUCCESS = 'FETCH_TRASHED_BOARDS_SUCCESS';
export const FETCH_TRASHED_BOARDS_FAILURE = 'FETCH_TRASHED_BOARDS_FAILURE';
export const FETCH_FAVORITE_BOARDS_REQUEST = 'FETCH_FAVORITE_BOARDS_REQUEST';
export const FETCH_FAVORITE_BOARDS_SUCCESS = 'FETCH_FAVORITE_BOARDS_SUCCESS';
export const FETCH_FAVORITE_BOARDS_FAILURE = 'FETCH_FAVORITE_BOARDS_FAILURE';
export const MOVE_TO_TRASH_REQUEST = 'MOVE_TO_TRASH_REQUEST';
export const MOVE_TO_TRASH_SUCCESS = 'MOVE_TO_TRASH_SUCCESS';
export const MOVE_TO_TRASH_FAILURE = 'MOVE_TO_TRASH_FAILURE';
export const TOGGLE_FAVORITE_REQUEST = 'TOGGLE_FAVORITE_REQUEST';
export const TOGGLE_FAVORITE_SUCCESS = 'TOGGLE_FAVORITE_SUCCESS';
export const TOGGLE_FAVORITE_FAILURE = 'TOGGLE_FAVORITE_FAILURE';
export const RESTORE_FROM_TRASH_REQUEST = 'RESTORE_FROM_TRASH_REQUEST';
export const RESTORE_FROM_TRASH_SUCCESS = 'RESTORE_FROM_TRASH_SUCCESS';
export const RESTORE_FROM_TRASH_FAILURE = 'RESTORE_FROM_TRASH_FAILURE';
export const PERMANENTLY_DELETE_BOARD_REQUEST = 'PERMANENTLY_DELETE_BOARD_REQUEST';
export const PERMANENTLY_DELETE_BOARD_SUCCESS = 'PERMANENTLY_DELETE_BOARD_SUCCESS';
export const PERMANENTLY_DELETE_BOARD_FAILURE = 'PERMANENTLY_DELETE_BOARD_FAILURE';
export const CREATE_NEW_FOLDER_REQUEST = 'CREATE_NEW_FOLDER_REQUEST';
export const CREATE_NEW_FOLDER_SUCCESS = 'CREATE_NEW_FOLDER_SUCCESS';
export const CREATE_NEW_FOLDER_FAILURE = 'CREATE_NEW_FOLDER_FAILURE';
export const FETCH_FOLDERS_REQUEST = 'FETCH_FOLDERS_REQUEST';
export const FETCH_FOLDERS_SUCCESS = 'FETCH_FOLDERS_SUCCESS';
export const FETCH_FOLDERS_FAILURE = 'FETCH_FOLDERS_FAILURE';
export const ADD_BOARD_TO_FOLDER_REQUEST = 'ADD_BOARD_TO_FOLDER_REQUEST';
export const ADD_BOARD_TO_FOLDER_SUCCESS = 'ADD_BOARD_TO_FOLDER_SUCCESS';
export const ADD_BOARD_TO_FOLDER_FAILURE = 'ADD_BOARD_TO_FOLDER_FAILURE';
export const GET_FOLDER_BOARDS_REQUEST = 'GET_FOLDER_BOARDS_REQUEST';
export const GET_FOLDER_BOARDS_SUCCESS = 'GET_FOLDER_BOARDS_SUCCESS';
export const GET_FOLDER_BOARDS_FAILURE = 'GET_FOLDER_BOARDS_FAILURE';
export const GENERATE_SHARE_TOKEN_REQUEST = 'GENERATE_SHARE_TOKEN_REQUEST';
export const GENERATE_SHARE_TOKEN_SUCCESS = 'GENERATE_SHARE_TOKEN_SUCCESS';
export const GENERATE_SHARE_TOKEN_FAILURE = 'GENERATE_SHARE_TOKEN_FAILURE';
export const REVOKE_SHARE_TOKEN_REQUEST = 'REVOKE_SHARE_TOKEN_REQUEST';
export const REVOKE_SHARE_TOKEN_SUCCESS = 'REVOKE_SHARE_TOKEN_SUCCESS';
export const REVOKE_SHARE_TOKEN_FAILURE = 'REVOKE_SHARE_TOKEN_FAILURE';
export const GET_SHARED_BOARD_REQUEST = 'GET_SHARED_BOARD_REQUEST';
export const GET_SHARED_BOARD_SUCCESS = 'GET_SHARED_BOARD_SUCCESS';
export const GET_SHARED_BOARD_FAILURE = 'GET_SHARED_BOARD_FAILURE';
export const UPDATE_BOARD_FORMAT_REQUEST = 'UPDATE_BOARD_FORMAT_REQUEST';
export const UPDATE_BOARD_FORMAT_SUCCESS = 'UPDATE_BOARD_FORMAT_SUCCESS';
export const UPDATE_BOARD_FORMAT_FAILURE = 'UPDATE_BOARD_FORMAT_FAILURE';
export const SEARCH_BOARDS = 'SEARCH_BOARDS';
export const RENAME_FOLDER_REQUEST = 'RENAME_FOLDER_REQUEST';
export const RENAME_FOLDER_SUCCESS = 'RENAME_FOLDER_SUCCESS';
export const RENAME_FOLDER_FAILURE = 'RENAME_FOLDER_FAILURE';
export const DELETE_FOLDER_REQUEST = 'DELETE_FOLDER_REQUEST';
export const DELETE_FOLDER_SUCCESS = 'DELETE_FOLDER_SUCCESS';
export const DELETE_FOLDER_FAILURE = 'DELETE_FOLDER_FAILURE';

// Rename a folder
export const renameFolder = (folderId, newName) => async (dispatch) => {
  dispatch({ type: RENAME_FOLDER_REQUEST });
  try {
    const response = await folderService.renameFolder(folderId, newName);
    dispatch({
      type: RENAME_FOLDER_SUCCESS,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: RENAME_FOLDER_FAILURE,
      payload: error.message,
    });
  }
};

// Delete a folder
export const deleteFolder = (folderId) => async (dispatch) => {
  dispatch({ type: DELETE_FOLDER_REQUEST });
  try {
    await api.delete(`/folders/${folderId}`);
    dispatch({
      type: DELETE_FOLDER_SUCCESS,
      payload: folderId,
    });
  } catch (error) {
    dispatch({
      type: DELETE_FOLDER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Search boards
export const searchBoards = (searchTerm) => ({
  type: SEARCH_BOARDS,
  payload: searchTerm,
});

// Update board format
export const updateBoardFormat = (boardId, format) => async (dispatch) => {
  dispatch({ type: UPDATE_BOARD_FORMAT_REQUEST });
  try {
    const updatedBoard = await boardService.updateBoardFormat(boardId, format);
    dispatch({ 
      type: UPDATE_BOARD_FORMAT_SUCCESS, 
      payload: updatedBoard 
    });
    return updatedBoard;
  } catch (error) {
    dispatch({ 
      type: UPDATE_BOARD_FORMAT_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Get a shared board
export const getSharedBoard = (shareToken) => async (dispatch) => {
  dispatch({ type: GET_SHARED_BOARD_REQUEST });
  try {
    const response = await boardService.getPublicBoard(shareToken);
    if (response && typeof response === 'object') {
      dispatch({
        type: GET_SHARED_BOARD_SUCCESS,
        payload: response,
      });
      return response;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    dispatch({
      type: GET_SHARED_BOARD_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Generate a share token for a board
export const generateShareToken = (boardId) => async (dispatch) => {
  dispatch({ type: GENERATE_SHARE_TOKEN_REQUEST });
  try {
    const shareToken = await shareService.generateShareToken(boardId);
    dispatch({ 
      type: GENERATE_SHARE_TOKEN_SUCCESS, 
      payload: { boardId, shareToken } 
    });
    return shareToken;
  } catch (error) {
    dispatch({ 
      type: GENERATE_SHARE_TOKEN_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Revoke a share token for a board
export const revokeShareToken = (boardId) => async (dispatch) => {
  dispatch({ type: REVOKE_SHARE_TOKEN_REQUEST });
  try {
    await shareService.revokeShareToken(boardId);
    dispatch({ 
      type: REVOKE_SHARE_TOKEN_SUCCESS, 
      payload: boardId 
    });
  } catch (error) {
    dispatch({ 
      type: REVOKE_SHARE_TOKEN_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Get boards in a folder
export const getFolderBoards = (folderId) => async (dispatch) => {
  dispatch({ type: GET_FOLDER_BOARDS_REQUEST });
  try {
    const response = await api.get(`/boards/folders/${folderId}`);
    dispatch({ type: GET_FOLDER_BOARDS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_FOLDER_BOARDS_FAILURE, payload: error.message });
  }
};

// Add a board to a folder
export const addBoardToFolder = (boardId, folderId) => async (dispatch) => {
  dispatch({ type: ADD_BOARD_TO_FOLDER_REQUEST });
  try {
    const response = await api.put(`/boards/${boardId}/folder`, { folderId });
    dispatch({
      type: ADD_BOARD_TO_FOLDER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: ADD_BOARD_TO_FOLDER_FAILURE,
      payload: error.message,
    });
  }
};

// Create a new folder
export const createNewFolder = (folderName) => async (dispatch) => {
  dispatch({ type: CREATE_NEW_FOLDER_REQUEST });
  try {
    const response = await api.post('/boards/folders', { name: folderName });
    dispatch({
      type: CREATE_NEW_FOLDER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_NEW_FOLDER_FAILURE,
      payload: error.message,
    });
  }
};

// Fetch all folders
export const fetchFolders = () => async (dispatch) => {
  dispatch({ type: FETCH_FOLDERS_REQUEST });
  try {
    const response = await api.get('/boards/folders');
    dispatch({
      type: FETCH_FOLDERS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_FOLDERS_FAILURE,
      payload: error.message,
    });
  }
};

// Restore boards from trash
export const restoreFromTrash = (boardIds) => async (dispatch) => {
  dispatch({ type: RESTORE_FROM_TRASH_REQUEST });
  try {
    const boardIdArray = Array.isArray(boardIds) ? boardIds : [boardIds];
    const results = await Promise.all(
      boardIdArray.map(async (boardId) => {
        try {
          const response = await api.put(`/boards/${boardId}/restore`);
          return { boardId, success: true, data: response.data };
        } catch (error) {
          return { boardId, success: false, error: error.response?.data?.error || error.message };
        }
      })
    );

    const successfulRestores = results.filter((result) => result.success);
    const failedRestores = results.filter((result) => !result.success);

    if (successfulRestores.length > 0) {
      dispatch({
        type: RESTORE_FROM_TRASH_SUCCESS,
        payload: successfulRestores.map((result) => result.data),
      });
    }

    if (failedRestores.length > 0) {
      dispatch({
        type: RESTORE_FROM_TRASH_FAILURE,
        payload: failedRestores.map((result) => result.error).join(', '),
      });
    }

    dispatch(getUserBoards());
    dispatch(getTrashedBoards());

    return results;
  } catch (error) {
    dispatch({
      type: RESTORE_FROM_TRASH_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

// Permanently delete boards
export const permanentlyDeleteBoard = (boardIds) => async (dispatch) => {
  dispatch({ type: PERMANENTLY_DELETE_BOARD_REQUEST });
  try {
    const boardIdArray = Array.isArray(boardIds) ? boardIds : [boardIds];
    const results = await Promise.all(
      boardIdArray.map(async (boardId) => {
        try {
          await api.delete(`/boards/${boardId}`);
          return { boardId, success: true };
        } catch (error) {
          return { boardId, success: false, error: error.response?.data?.error || error.message };
        }
      })
    );

    const successfulDeletes = results.filter((result) => result.success);
    const failedDeletes = results.filter((result) => !result.success);

    if (successfulDeletes.length > 0) {
      dispatch({
        type: PERMANENTLY_DELETE_BOARD_SUCCESS,
        payload: successfulDeletes.map((result) => result.boardId),
      });
    }

    if (failedDeletes.length > 0) {
      dispatch({
        type: PERMANENTLY_DELETE_BOARD_FAILURE,
        payload: failedDeletes.map((result) => result.error).join(', '),
      });
    }

    dispatch(getTrashedBoards());

    return results;
  } catch (error) {
    dispatch({
      type: PERMANENTLY_DELETE_BOARD_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

// Move boards to trash
export const moveToTrash = (boardIds) => async (dispatch) => {
  dispatch({ type: MOVE_TO_TRASH_REQUEST });
  try {
    const boardIdArray = Array.isArray(boardIds) ? boardIds : [boardIds];
    const results = await Promise.all(
      boardIdArray.map(async (boardId) => {
        try {
          const response = await api.put(`/boards/${boardId}/trash`);
          return { boardId, success: true, data: response.data };
        } catch (error) {
          return { boardId, success: false, error: error.response?.data?.error || error.message };
        }
      })
    );

    const successfulMoves = results.filter((result) => result.success);
    const failedMoves = results.filter((result) => !result.success);

    if (successfulMoves.length > 0) {
      dispatch({
        type: MOVE_TO_TRASH_SUCCESS,
        payload: successfulMoves.map((result) => result.boardId),
      });
    }

    if (failedMoves.length > 0) {
      dispatch({
        type: MOVE_TO_TRASH_FAILURE,
        payload: failedMoves.map((result) => result.error).join(', '),
      });
    }

    dispatch(getUserBoards());
    dispatch(getTrashedBoards());

    return results;
  } catch (error) {
    dispatch({
      type: MOVE_TO_TRASH_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

// Get trashed boards
export const getTrashedBoards = () => async (dispatch) => {
  dispatch({ type: FETCH_TRASHED_BOARDS_REQUEST });
  try {
    const response = await api.get('/boards/trashed');
    dispatch({
      type: FETCH_TRASHED_BOARDS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TRASHED_BOARDS_FAILURE,
      payload: error.message,
    });
  }
};

// Get shared boards
export const getSharedBoards = () => async (dispatch) => {
  dispatch({ type: FETCH_SHARED_BOARDS_REQUEST });
  try {
    const response = await api.get('/boards/shared');
    dispatch({
      type: FETCH_SHARED_BOARDS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
    dispatch({
      type: FETCH_SHARED_BOARDS_FAILURE,
      payload: errorMessage,
    });
  }
};

// Get favorite boards
export const getFavoriteBoards = () => async (dispatch) => {
  dispatch({ type: FETCH_FAVORITE_BOARDS_REQUEST });
  try {
    const response = await api.get('/boards/favorites');
    dispatch({
      type: FETCH_FAVORITE_BOARDS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_FAVORITE_BOARDS_FAILURE,
      payload: error.message,
    });
  }
};

// Toggle favorite status of boards
export const toggleFavorite = (boardIds) => async (dispatch) => {
  dispatch({ type: TOGGLE_FAVORITE_REQUEST });
  try {
    const boardIdArray = Array.isArray(boardIds) ? boardIds : [boardIds];
    const results = await Promise.all(
      boardIdArray.map(async (boardId) => {
        try {
          const response = await api.patch(`/boards/${boardId}/toggle-favorite`);
          return { boardId, success: true, data: response.data };
        } catch (error) {
          return { boardId, success: false, error: error.response?.data?.error || error.message };
        }
      })
    );

    const successfulToggles = results.filter((result) => result.success);
    const failedToggles = results.filter((result) => !result.success);

    if (successfulToggles.length > 0) {
      dispatch({
        type: TOGGLE_FAVORITE_SUCCESS,
        payload: successfulToggles.map((result) => result.data),
      });
    }

    if (failedToggles.length > 0) {
      dispatch({
        type: TOGGLE_FAVORITE_FAILURE,
        payload: failedToggles.map((result) => result.error).join(', '),
      });
    }

    return results;
  } catch (error) {
    dispatch({
      type: TOGGLE_FAVORITE_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

// Initialize sort preference
export const initializeSortPreference = () => {
  const savedPreference = localStorage.getItem('sortPreference') || 'name';
  return {
    type: INITIALIZE_SORT_PREFERENCE,
    payload: savedPreference,
  };
};

// Set sort preference
export const setSortPreference = (preference) => ({
  type: SET_SORT_PREFERENCE,
  payload: preference,
});

// Update last viewed timestamp for a board
export const updateLastViewed = (boardId) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_LAST_VIEWED,
      payload: boardId,
    });
  } catch (error) {
    // Handle error
  }
};

// Update sections of a board
export const updateSections = (boardId, sections) => async (dispatch) => {
  try {
    const response = await api.put(`/boards/${boardId}/sections`, { sections });
    dispatch({
      type: UPDATE_SECTIONS_SUCCESS,
      payload: { boardId, sections: response.data.sections },
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: UPDATE_SECTIONS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Toggle sections for a board
export const toggleSections = (boardId, enabled) => async (dispatch) => {
  try {
    const response = await api.patch(`/boards/${boardId}/toggle-sections`, { enabled });
    const updatedBoard = response.data;

    dispatch({
      type: TOGGLE_SECTIONS,
      payload: { 
        boardId, 
        enabled: updatedBoard.sectionsEnabled, 
        sections: updatedBoard.sections,
        allCards: updatedBoard.allCards
      },
    });
    
    dispatch(setCurrentBoard(updatedBoard));
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

// Add a section to a board
export const addSection = (boardId) => async (dispatch) => {
  try {
    const response = await api.post(`/boards/${boardId}/sections`);
    dispatch({
      type: ADD_SECTION,
      payload: { boardId, section: response.data },
    });
    await dispatch(getBoard(boardId));
    return response.data;
  } catch (error) {
    dispatch({ 
      type: 'ADD_SECTION_ERROR',
      payload: error.message
    });
    throw error;
  }
};

// Set the current board
export const setCurrentBoard = (board) => ({
  type: SET_CURRENT_BOARD,
  payload: board,
});

// Action creators for board operations
export const pinBoardRequest = () => ({ type: PIN_BOARD_REQUEST });
export const pinBoardSuccess = (board) => ({
  type: PIN_BOARD_SUCCESS,
  payload: board,
});
export const pinBoardFailure = (error) => ({
  type: PIN_BOARD_FAILURE,
  payload: error,
});

export const updateBoardRequest = () => ({ type: UPDATE_BOARD_REQUEST });
export const updateBoardSuccess = (board) => ({
  type: UPDATE_BOARD_SUCCESS,
  payload: board,
});
export const updateBoardFailure = (error) => ({
  type: UPDATE_BOARD_FAILURE,
  payload: error,
});

export const fetchBoardsRequest = () => ({ type: FETCH_BOARDS_REQUEST });
export const fetchBoardsSuccess = (boards) => ({
  type: FETCH_BOARDS_SUCCESS,
  payload: boards,
});
export const fetchBoardsFailure = (error) => ({
  type: FETCH_BOARDS_FAILURE,
  payload: error,
});

export const fetchBoardRequest = () => ({ type: FETCH_BOARD_REQUEST });
export const fetchBoardSuccess = (board) => ({
  type: FETCH_BOARD_SUCCESS,
  payload: board,
});
export const fetchBoardFailure = (error) => ({
  type: FETCH_BOARD_FAILURE,
  payload: error,
});

export const createBoardRequest = () => ({ type: CREATE_BOARD_REQUEST });
export const createBoardSuccess = (board) => ({
  type: CREATE_BOARD_SUCCESS,
  payload: board,
});
export const createBoardFailure = (error) => ({
  type: CREATE_BOARD_FAILURE,
  payload: error,
});

export const deleteBoardRequest = () => ({ type: DELETE_BOARD_REQUEST });
export const deleteBoardSuccess = (boardId) => ({
  type: DELETE_BOARD_SUCCESS,
  payload: boardId,
});
export const deleteBoardFailure = (error) => ({
  type: DELETE_BOARD_FAILURE,
  payload: error,
});

export const fetchUserBoardsRequest = () => ({
  type: FETCH_USER_BOARDS_REQUEST,
});
export const fetchUserBoardsSuccess = (boards) => ({
  type: FETCH_USER_BOARDS_SUCCESS,
  payload: boards,
});
export const fetchUserBoardsFailure = (error) => ({
  type: FETCH_USER_BOARDS_FAILURE,
  payload: error,
});

// Fetch all boards
export const fetchBoards = () => {
  return async (dispatch) => {
    dispatch(fetchBoardsRequest());
    try {
      const response = await api.get('/boards');
      dispatch(fetchBoardsSuccess(response.data));
    } catch (error) {
      dispatch(fetchBoardsFailure(error.response.data.error));
    }
  };
};

// Fetch a single board
export const fetchBoard = (boardId) => {
  return async (dispatch) => {
    dispatch(fetchBoardRequest());
    try {
      if (boardId === 'new' || boardId === 'create') {
        dispatch(fetchBoardSuccess(null));
        return;
      }
      
      const response = await api.get(`/boards/${boardId}`);
      const board = response.data;

      if (board.sectionsEnabled && board.sections) {
        board.sections = board.sections.map(section => ({
          ...section,
          cards: section.cards || []
        }));
      } else {
        board.sections = [{
          id: 'default',
          title: 'All Cards',
          cards: board.cards || []
        }];
      }

      dispatch(fetchBoardSuccess(board));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        dispatch(fetchBoardFailure('Board not found'));
      } else {
        dispatch(fetchBoardFailure(error.response?.data?.error || 'An error occurred while fetching the board'));
      }
    }
  };
};

// Create a new board
export const createBoard = (boardData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_BOARD_REQUEST });
  try {
    const state = getState();
    const boardId = uuidv4().slice(0, 13);
    const boardWithId = {
      ...boardData,
      boardId,
      subject: boardData.subject || 'New Board',
      content: boardData.content || '',
      userId: state.auth.user?.id,
    };

    const response = await api.post('/boards', boardWithId);

    if (response.data) {
      const formattedBoard = formatBoardData(response.data);
      dispatch({ type: CREATE_BOARD_SUCCESS, payload: formattedBoard });
      dispatch(getUserBoards());
      return formattedBoard;
    } else {
      throw new Error('No data received from server');
    }
  } catch (error) {
    dispatch({ type: CREATE_BOARD_FAILURE, payload: error.message });
    throw error;
  }
};

// Get user boards
export const getUserBoards = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_USER_BOARDS_REQUEST });
  try {
    const response = await api.get('/boards/user');
    
    if (response.data && Array.isArray(response.data)) {
      const nonTrashedBoards = response.data.filter(board => !board.trashed);
      const sortedBoards = nonTrashedBoards.sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed));
      dispatch({ type: FETCH_USER_BOARDS_SUCCESS, payload: sortedBoards });
    } else {
      dispatch({ type: FETCH_USER_BOARDS_FAILURE, payload: 'Invalid response format' });
    }
  } catch (error) {
    dispatch({ type: FETCH_USER_BOARDS_FAILURE, payload: error.message });
  }
};

// Delete a board
export const deleteBoard = (boardId) => {
  return async (dispatch) => {
    dispatch(deleteBoardRequest());
    try {
      await api.delete(`/boards/${boardId}`);
      dispatch(deleteBoardSuccess(boardId));
    } catch (error) {
      dispatch(deleteBoardFailure(error.response.data.error));
    }
  };
};

// Update a board
export const updateBoard = (boardId, updateData) => async (dispatch, getState) => {
  dispatch(updateBoardRequest());
  try {
    const state = getState();
    const token = state.auth.token;

    const response = await api.put(`/boards/${boardId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const updatedBoard = formatBoardData(response.data);
    
    dispatch(updateBoardSuccess(updatedBoard));
    return updatedBoard;
  } catch (error) {
    dispatch(updateBoardFailure(error.response?.data?.error || 'Failed to update board'));
    throw error;
  }
};

// Pin or unpin a board
export const pinBoard = (boardId) => async (dispatch) => {
  dispatch(pinBoardRequest());
  try {
    const response = await api.patch(`/boards/${boardId}/pin`);
    dispatch(pinBoardSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(pinBoardFailure(error.response?.data?.message || error.message));
    throw error;
  }
};

// Get a board
export const getBoard = (boardId) => {
  return async (dispatch) => {
    dispatch(fetchBoardRequest());
    try {
      const boardResponse = await api.get(`/boards/${boardId}`);
      const board = boardResponse.data;

      if (board.sectionsEnabled && board.sections) {
        board.sections = board.sections.map(section => ({
          ...section,
          cards: section.cards || []
        }));
      } else {
        board.sections = [{
          id: 'default',
          title: 'All Cards',
          cards: board.cards || []
        }];
      }

      dispatch(fetchBoardSuccess(board));
      dispatch(setCurrentBoard(board));
      dispatch(updateLastViewed(boardId));

      // Fetch cards separately
      const cards = await dispatch(getUserCards(boardId));
      
      return { ...board, cards };
    } catch (error) {
      dispatch(fetchBoardFailure(error.response?.data?.error || 'An error occurred while fetching the board'));
      throw error;
    }
  }
};

// Reorder cards in a board
export const reorderCards = (boardId, cardIds) => async (dispatch) => {
  try {
    const response = await api.put(`/boards/${boardId}/reorder`, { cardIds });
    dispatch({
      type: 'REORDER_CARDS_SUCCESS',
      payload: response.data,
    });
    // Fetch the updated board data after reordering
    dispatch(getBoard(boardId));
    return response.data;
  } catch (error) {
    dispatch({
      type: 'REORDER_CARDS_FAILURE',
      payload: error.message,
    });
    throw error;
  }
};

// Utility function to format board data
const formatBoardData = (board) => {
  return board;
};