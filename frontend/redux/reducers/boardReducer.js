import {
  FETCH_BOARDS_REQUEST,
  FETCH_BOARDS_SUCCESS,
  FETCH_BOARDS_FAILURE,
  FETCH_BOARD_REQUEST,
  FETCH_BOARD_SUCCESS,
  FETCH_BOARD_FAILURE,
  CREATE_BOARD_REQUEST,
  CREATE_BOARD_SUCCESS,
  CREATE_BOARD_FAILURE,
  DELETE_BOARD_REQUEST,
  DELETE_BOARD_SUCCESS,
  DELETE_BOARD_FAILURE,
  FETCH_USER_BOARDS_REQUEST,
  FETCH_USER_BOARDS_SUCCESS,
  FETCH_USER_BOARDS_FAILURE,
  UPDATE_BOARD_REQUEST,
  UPDATE_BOARD_SUCCESS,
  UPDATE_BOARD_FAILURE,
  PIN_BOARD_REQUEST,
  PIN_BOARD_SUCCESS,
  PIN_BOARD_FAILURE,
  TOGGLE_SECTIONS,
  ADD_SECTION,
  SET_CURRENT_BOARD,
  UPDATE_SECTIONS_SUCCESS,
  UPDATE_SECTIONS_FAILURE,
  UPDATE_LAST_VIEWED,
  SET_SORT_PREFERENCE,
  INITIALIZE_SORT_PREFERENCE,
  FETCH_SHARED_BOARDS_REQUEST,
  FETCH_SHARED_BOARDS_SUCCESS,
  FETCH_SHARED_BOARDS_FAILURE,
  FETCH_TRASHED_BOARDS_REQUEST,
  FETCH_TRASHED_BOARDS_SUCCESS,
  FETCH_TRASHED_BOARDS_FAILURE,
  FETCH_FAVORITE_BOARDS_REQUEST,
  FETCH_FAVORITE_BOARDS_SUCCESS,
  FETCH_FAVORITE_BOARDS_FAILURE,
  MOVE_TO_TRASH_REQUEST,
  MOVE_TO_TRASH_SUCCESS,
  MOVE_TO_TRASH_FAILURE,
  RESTORE_FROM_TRASH_SUCCESS,
  PERMANENTLY_DELETE_BOARD_SUCCESS,
  TOGGLE_FAVORITE_SUCCESS,
  CREATE_NEW_FOLDER_REQUEST,
  CREATE_NEW_FOLDER_SUCCESS,
  CREATE_NEW_FOLDER_FAILURE,
  FETCH_FOLDERS_REQUEST,
  FETCH_FOLDERS_SUCCESS,
  FETCH_FOLDERS_FAILURE,
  ADD_BOARD_TO_FOLDER_SUCCESS,
  GET_FOLDER_BOARDS_SUCCESS,
  GENERATE_SHARE_TOKEN_SUCCESS,
  REVOKE_SHARE_TOKEN_SUCCESS,
  GET_SHARED_BOARD_REQUEST,
  GET_SHARED_BOARD_SUCCESS,
  GET_SHARED_BOARD_FAILURE,
  UPDATE_BOARD_FORMAT_REQUEST,
  UPDATE_BOARD_FORMAT_SUCCESS,
  UPDATE_BOARD_FORMAT_FAILURE,
  SEARCH_BOARDS,
  RENAME_FOLDER_REQUEST,
  RENAME_FOLDER_SUCCESS,
  RENAME_FOLDER_FAILURE,
  DELETE_FOLDER_REQUEST,
  DELETE_FOLDER_SUCCESS,
  DELETE_FOLDER_FAILURE,
} from '../actions/boardActions';

import {
  REORDER_CARDS_SUCCESS,
  REORDER_CARDS_FAILURE,
} from '../actions/cardActions';

// Initial state for the board reducer
const initialState = {
  boards: [],
  currentBoard: null,
  userBoards: [],
  sharedBoards: [],
  favoriteBoards: [],
  trashedBoards: [],
  folders: [],
  sharedBoard: null,
  loadingSharedBoard: false,
  sharedBoardError: null,
  loading: false,
  error: null,
  sortPreference: 'name',
  searchTerm: '',
};

// Board reducer function
const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    // Handle various request actions
    case FETCH_BOARDS_REQUEST:
    case FETCH_BOARD_REQUEST:
    case CREATE_BOARD_REQUEST:
    case DELETE_BOARD_REQUEST:
    case FETCH_USER_BOARDS_REQUEST:
    case UPDATE_BOARD_REQUEST:
    case PIN_BOARD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // Handle fetching boards success
    case FETCH_BOARDS_SUCCESS:
      return {
        ...state,
        boards: action.payload,
        loading: false,
        error: null,
      };

    // Handle fetching a single board success
    case FETCH_BOARD_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...action.payload,
          dominantColor: action.payload.dominantColor || 'rgba(120, 90, 60, 0.7)'
        },
        loading: false,
        error: null,
      };

    // Handle creating a new board success
    case CREATE_BOARD_SUCCESS:
      return {
        ...state,
        boards: [...state.boards, action.payload],
        userBoards: [...state.userBoards, action.payload].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        }),
        currentBoard: action.payload,
        loading: false,
        error: null,
      };

    // Handle deleting a board success
    case DELETE_BOARD_SUCCESS:
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
        userBoards: state.userBoards.filter((board) => board.id !== action.payload),
        loading: false,
        error: null,
      };

    // Handle fetching user boards success
    case FETCH_USER_BOARDS_SUCCESS:
      return {
        ...state,
        userBoards: action.payload,
        loading: false,
        error: null,
      };

    // Handle updating a board success
    case UPDATE_BOARD_SUCCESS:
      return {
        ...state,
        boards: state.boards.map(board => 
          board.id === action.payload.id ? action.payload : board
        ),
        userBoards: state.userBoards.map(board => 
          board.id === action.payload.id ? action.payload : board
        ).sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        }),
        currentBoard: state.currentBoard && state.currentBoard.id === action.payload.id 
          ? action.payload 
          : state.currentBoard,
        loading: false,
        error: null,
      };

    // Handle pinning a board success
    case PIN_BOARD_SUCCESS:
      return {
        ...state,
        userBoards: state.userBoards.map(board => 
          board.id === action.payload.id ? action.payload : board
        ).sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        }),
        loading: false,
      };

    // Handle various failure actions
    case FETCH_BOARDS_FAILURE:
    case FETCH_BOARD_FAILURE:
    case CREATE_BOARD_FAILURE:
    case DELETE_BOARD_FAILURE:
    case FETCH_USER_BOARDS_FAILURE:
    case UPDATE_BOARD_FAILURE:
    case PIN_BOARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Handle toggling sections
    case TOGGLE_SECTIONS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          sectionsEnabled: action.payload.enabled,
          sections: action.payload.sections,
          allCards: action.payload.allCards
        },
        userBoards: state.userBoards.map(board =>
          board.id === action.payload.boardId
            ? { 
                ...board, 
                sectionsEnabled: action.payload.enabled, 
                sections: action.payload.sections,
                allCards: action.payload.allCards
              }
            : board
        )
      };

    // Handle adding a section
    case ADD_SECTION:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          sections: [...(state.currentBoard.sections || []), action.payload.section]
        },
        userBoards: state.userBoards.map(board =>
          board.id === action.payload.boardId
            ? { ...board, sections: [...(board.sections || []), action.payload.section] }
            : board
        )
      };

    // Handle setting the current board
    case SET_CURRENT_BOARD:
      return {
        ...state,
        currentBoard: action.payload,
      };

    // Handle updating sections success
    case UPDATE_SECTIONS_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          sections: action.payload.sections,
        },
      };

    // Handle updating sections failure
    case UPDATE_SECTIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    // Handle reordering cards success
    case REORDER_CARDS_SUCCESS:
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          cards: action.payload.cards,
        },
      };

    // Handle reordering cards failure
    case REORDER_CARDS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    // Handle updating last viewed
    case UPDATE_LAST_VIEWED:
      return {
        ...state,
        userBoards: state.userBoards.map(board =>
          board.id === action.payload
            ? { ...board, lastViewed: new Date().toISOString() }
            : board
        ).sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed)),
        currentBoard: state.currentBoard && state.currentBoard.id === action.payload
          ? { ...state.currentBoard, lastViewed: new Date().toISOString() }
          : state.currentBoard,
      };

    // Handle setting and initializing sort preference
    case SET_SORT_PREFERENCE:
    case INITIALIZE_SORT_PREFERENCE:
      return {
        ...state,
        sortPreference: action.payload,
      };

    // Handle various request actions for different board types
    case FETCH_TRASHED_BOARDS_REQUEST:
    case FETCH_SHARED_BOARDS_REQUEST:
    case FETCH_FAVORITE_BOARDS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // Handle fetching shared boards success
    case FETCH_SHARED_BOARDS_SUCCESS:
      return {
        ...state,
        sharedBoards: action.payload,
        loading: false,
      };

    // Handle fetching trashed boards success
    case FETCH_TRASHED_BOARDS_SUCCESS:
      return {
        ...state,
        trashedBoards: action.payload,
        loading: false,
      };

    // Handle fetching favorite boards success
    case FETCH_FAVORITE_BOARDS_SUCCESS:
      return {
        ...state,
        favoriteBoards: action.payload,
        loading: false,
      };

    // Handle various failure actions for different board types
    case FETCH_TRASHED_BOARDS_FAILURE:
    case FETCH_SHARED_BOARDS_FAILURE:
    case FETCH_FAVORITE_BOARDS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Handle moving to trash request
    case MOVE_TO_TRASH_REQUEST:
      return {
        ...state,
        loading: true,
      };

    // Handle moving to trash success
    case MOVE_TO_TRASH_SUCCESS:
      return {
        ...state,
        userBoards: state.userBoards.filter(board => board.id !== action.payload.id),
        trashedBoards: [...state.trashedBoards, action.payload],
      };

    // Handle moving to trash failure
    case MOVE_TO_TRASH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Handle restoring from trash success
    case RESTORE_FROM_TRASH_SUCCESS:
      return {
        ...state,
        userBoards: [...state.userBoards, action.payload],
        trashedBoards: state.trashedBoards.filter(board => board.id !== action.payload.id),
      };

    // Handle permanently deleting board success
    case PERMANENTLY_DELETE_BOARD_SUCCESS:
      return {
        ...state,
        trashedBoards: state.trashedBoards.filter(board => board.id !== action.payload),
      };

    // Handle toggling favorite success
    case TOGGLE_FAVORITE_SUCCESS:
      return {
        ...state,
        userBoards: state.userBoards.map(board =>
          board.id === action.payload.id ? action.payload : board
        ),
        favoriteBoards: state.favoriteBoards.some(board => board.id === action.payload.id)
          ? state.favoriteBoards.filter(board => board.id !== action.payload.id)
          : [...state.favoriteBoards, action.payload],
      };

    // Handle creating new folder request
    case CREATE_NEW_FOLDER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    // Handle creating new folder success
    case CREATE_NEW_FOLDER_SUCCESS:
      return {
        ...state,
        folders: [action.payload, ...state.folders],
      };

    // Handle creating new folder failure
    case CREATE_NEW_FOLDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Handle fetching folders request
    case FETCH_FOLDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    // Handle fetching folders success
    case FETCH_FOLDERS_SUCCESS:
      return {
        ...state,
        folders: action.payload,
        loading: false,
      };

    // Handle fetching folders failure
    case FETCH_FOLDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Handle adding board to folder success
    case ADD_BOARD_TO_FOLDER_SUCCESS:
      return {
        ...state,
        userBoards: state.userBoards.map(board =>
          board.boardId === action.payload.boardId ? { ...board, folderId: action.payload.folderId } : board
        ),
      };

    // Handle getting folder boards success
    case GET_FOLDER_BOARDS_SUCCESS:
      return {
        ...state,
        folderBoards: action.payload,
        loading: false,
      };

    // Handle setting folder boards
    case 'SET_FOLDER_BOARDS':
      return {
        ...state,
        folderBoards: action.payload,
      };

    // Handle generating share token success
    case GENERATE_SHARE_TOKEN_SUCCESS:
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? { ...board, shareToken: action.payload.shareToken, isPublic: true }
            : board
        ),
        currentBoard: state.currentBoard && state.currentBoard.id === action.payload.boardId
          ? { ...state.currentBoard, shareToken: action.payload.shareToken, isPublic: true }
          : state.currentBoard
      };

    // Handle revoking share token success
    case REVOKE_SHARE_TOKEN_SUCCESS:
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload
            ? { ...board, shareToken: null, isPublic: false }
            : board
        ),
        currentBoard: state.currentBoard && state.currentBoard.id === action.payload
          ? { ...state.currentBoard, shareToken: null, isPublic: false }
          : state.currentBoard
      };

    // Handle getting shared board request
    case GET_SHARED_BOARD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // Handle getting shared board success
    case GET_SHARED_BOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        sharedBoard: action.payload,
      };

    // Handle getting shared board failure
    case GET_SHARED_BOARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Handle updating board format request
    case UPDATE_BOARD_FORMAT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    // Handle updating board format success
    case UPDATE_BOARD_FORMAT_SUCCESS:
      return {
        ...state,
        loading: false,
        currentBoard: action.payload,
      };

    // Handle updating board format failure
    case UPDATE_BOARD_FORMAT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Handle searching boards
    case SEARCH_BOARDS:
      return {
        ...state,
        searchTerm: action.payload,
      };

    // Handle renaming folder request
    case RENAME_FOLDER_REQUEST:
    case DELETE_FOLDER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    // Handle renaming folder success
    case RENAME_FOLDER_SUCCESS:
      return {
        ...state,
        loading: false,
        folders: state.folders.map(folder =>
          folder.id === action.payload.id ? action.payload : folder
        ),
      };

    // Handle deleting folder success
    case DELETE_FOLDER_SUCCESS:
      return {
        ...state,
        loading: false,
        folders: state.folders.filter(folder => folder.id !== action.payload),
      };

    // Handle renaming or deleting folder failure
    case RENAME_FOLDER_FAILURE:
    case DELETE_FOLDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Default case: return current state
    default:
      return state;
  }
};

export default boardReducer;