import {
  ADD_COLLABORATOR,
  REMOVE_COLLABORATOR,
  UPDATE_COLLABORATOR_ROLE,
  SET_COLLABORATORS,
  SET_USER_COLLABORATIONS,
  SEARCH_USERS,
  SEARCH_USERS_ERROR
} from '../actions/collaborationActions';

const initialState = {
  collaborators: {},
  userCollaborations: [],
  searchResults: [],
  searchError: null
};

// Handles collaboration-related state changes
const collaborationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COLLABORATOR:
      return {
        ...state,
        collaborators: {
          ...state.collaborators,
          [action.payload.boardId]: [
            ...(state.collaborators[action.payload.boardId] || []),
            action.payload,
          ],
        },
      };
    case REMOVE_COLLABORATOR:
      return {
        ...state,
        collaborators: {
          ...state.collaborators,
          [action.payload.boardId]: state.collaborators[action.payload.boardId].filter(
            (collaborator) => collaborator.userId !== action.payload.userId
          ),
        },
      };
    case UPDATE_COLLABORATOR_ROLE:
      return {
        ...state,
        collaborators: {
          ...state.collaborators,
          [action.payload.boardId]: state.collaborators[action.payload.boardId].map(
            (collaborator) =>
              collaborator.userId === action.payload.userId
                ? { ...collaborator, role: action.payload.role }
                : collaborator
          ),
        },
      };
    case SET_COLLABORATORS:
      return {
        ...state,
        collaborators: {
          ...state.collaborators,
          [action.payload.boardId]: action.payload.collaborators,
        },
      };
    case SET_USER_COLLABORATIONS:
      return {
        ...state,
        userCollaborations: action.payload,
      };
    case SEARCH_USERS:
      return {
        ...state,
        searchResults: action.payload,
        searchError: null
      };
    case SEARCH_USERS_ERROR:
      return {
        ...state,
        searchResults: [],
        searchError: action.payload
      };
    default:
      return state;
  }
};

export default collaborationReducer;