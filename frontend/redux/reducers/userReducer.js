import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  UPLOAD_AVATAR_REQUEST,
  UPLOAD_AVATAR_SUCCESS,
  UPLOAD_AVATAR_FAILURE,
  FETCH_USER_PROFILE_REQUEST,
  FETCH_USER_PROFILE_SUCCESS,
  FETCH_USER_PROFILE_FAILURE,
  FETCH_USER_BOARDS_REQUEST,
  FETCH_USER_BOARDS_SUCCESS,
  FETCH_USER_BOARDS_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAILURE,
  UPDATE_PROFILE_USER,
} from '../actions/userActions';

// Initial state for the user reducer
const initialState = {
  user: null,
  profileUser: null,
  boards: [],
  loading: false,
  error: null,
  passwordUpdateSuccess: false,
  passwordUpdateError: null,
  avatarUploading: false,
};

// User reducer function
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Handle various request actions
    case FETCH_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST:
    case UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        passwordUpdateSuccess: false,
        passwordUpdateError: null,
      };

    // Handle fetching and updating user success
    case FETCH_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    // Handle deleting user success
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };

    // Handle updating password success
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        passwordUpdateSuccess: true,
        passwordUpdateError: null,
      };

    // Handle various failure actions
    case FETCH_USER_FAILURE:
    case UPDATE_USER_FAILURE:
    case DELETE_USER_FAILURE:
    case UPDATE_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        passwordUpdateSuccess: false,
        passwordUpdateError: action.payload,
      };

    // Handle avatar upload request
    case UPLOAD_AVATAR_REQUEST:
      return {
        ...state,
        avatarUploading: true,
        error: null,
      };

    // Handle avatar upload success
    case UPLOAD_AVATAR_SUCCESS:
      return {
        ...state,
        avatarUploading: false,
        user: {
          ...state.user,
          avatarUrl: action.payload,
        },
      };

    // Handle avatar upload failure
    case UPLOAD_AVATAR_FAILURE:
      return {
        ...state,
        avatarUploading: false,
        error: action.payload,
      };

    // Handle user profile and boards request
    case FETCH_USER_PROFILE_REQUEST:
    case FETCH_USER_BOARDS_REQUEST:
      return { ...state, loading: true, error: null };

    // Handle fetching user profile success
    case FETCH_USER_PROFILE_SUCCESS:
      return { ...state, loading: false, user: action.payload };

    // Handle fetching user boards success
    case FETCH_USER_BOARDS_SUCCESS:
      return { ...state, loading: false, boards: action.payload };

    // Handle user profile and boards failure
    case FETCH_USER_PROFILE_FAILURE:
    case FETCH_USER_BOARDS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Handle updating profile user
    case UPDATE_PROFILE_USER:
      return {
        ...state,
        user: action.payload,
        profileUser: action.payload,
      };

    // Default case: return current state
    default:
      return state;
  }
};

export default userReducer;