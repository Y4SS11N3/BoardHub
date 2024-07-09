import {
  RENAME_FOLDER_REQUEST,
  RENAME_FOLDER_SUCCESS,
  RENAME_FOLDER_FAILURE,
  FETCH_FOLDERS_SUCCESS,
  DELETE_FOLDER_REQUEST,
  DELETE_FOLDER_SUCCESS,
  DELETE_FOLDER_FAILURE,
} from '../actions/folderActions';

const initialState = {
  folders: [],
  loading: false,
  error: null,
};

// Handles folder-related state changes
const folderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FOLDERS_SUCCESS:
      return {
        ...state,
        folders: action.payload,
        loading: false,
      };

    case RENAME_FOLDER_REQUEST:
    case DELETE_FOLDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case RENAME_FOLDER_SUCCESS:
      return {
        ...state,
        loading: false,
        folders: state.folders.map(folder =>
          folder.id === action.payload.id ? { ...folder, ...action.payload } : folder
        ),
      };

    case DELETE_FOLDER_SUCCESS:
      return {
        ...state,
        loading: false,
        folders: state.folders.filter(folder => folder.id !== action.payload),
      };

    case RENAME_FOLDER_FAILURE:
    case DELETE_FOLDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default folderReducer;