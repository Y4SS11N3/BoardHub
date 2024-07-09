import {
  FETCH_CARDS_REQUEST,
  FETCH_CARDS_SUCCESS,
  FETCH_CARDS_FAILURE,
  FETCH_CARD_REQUEST,
  FETCH_CARD_SUCCESS,
  FETCH_CARD_FAILURE,
  CREATE_CARD_REQUEST,
  CREATE_CARD_SUCCESS,
  CREATE_CARD_FAILURE,
  DELETE_CARD_REQUEST,
  DELETE_CARD_SUCCESS,
  DELETE_CARD_FAILURE,
  FETCH_USER_CARDS_REQUEST,
  FETCH_USER_CARDS_SUCCESS,
  FETCH_USER_CARDS_FAILURE,
  UPDATE_CARD_REQUEST,
  UPDATE_CARD_SUCCESS,
  UPDATE_CARD_FAILURE,
  PIN_CARD_REQUEST,
  PIN_CARD_SUCCESS,
  PIN_CARD_FAILURE,
  TOGGLE_CARD_SECTIONS,
  ADD_CARD_SECTION,
  SET_CURRENT_CARD,
} from '../actions/cardActions';

// Initial state for the card reducer
const initialState = {
  cards: [],
  currentCard: null,
  userCards: [],
  loading: false,
  error: null,
};

// Card reducer function
const cardReducer = (state = initialState, action) => {
  switch (action.type) {
    // Handle various request actions
    case FETCH_CARDS_REQUEST:
    case FETCH_CARD_REQUEST:
    case CREATE_CARD_REQUEST:
    case DELETE_CARD_REQUEST:
    case FETCH_USER_CARDS_REQUEST:
    case UPDATE_CARD_REQUEST:
    case PIN_CARD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // Handle fetching cards success
    case FETCH_CARDS_SUCCESS:
      return {
        ...state,
        cards: action.payload,
        loading: false,
        error: null,
      };

    // Handle fetching a single card success
    case FETCH_CARD_SUCCESS:
      return {
        ...state,
        currentCard: action.payload,
        loading: false,
        error: null,
      };

    // Handle creating a new card success
    case CREATE_CARD_SUCCESS:
      return {
        ...state,
        cards: [...state.cards, { ...action.payload, color: action.payload.color || 'white' }],
        userCards: [...state.userCards, action.payload].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        }),
        currentCard: action.payload,
        loading: false,
        error: null,
      };

    // Handle deleting a card success
    case DELETE_CARD_SUCCESS:
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== action.payload),
        userCards: state.userCards.filter((card) => card.id !== action.payload),
        loading: false,
        error: null,
      };

    // Handle fetching user cards success
    case FETCH_USER_CARDS_SUCCESS:
      return {
        ...state,
        userCards: action.payload,
        loading: false,
        error: null,
      };

    // Handle updating a card success
    case UPDATE_CARD_SUCCESS:
      return {
        ...state,
        cards: state.cards.map(card => 
          card.id === action.payload.id ? { ...action.payload, color: action.payload.color || card.color } : card
        ),
        userCards: state.userCards.map(card => 
          card.id === action.payload.id ? action.payload : card
        ).sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        }),
        currentCard: state.currentCard && state.currentCard.id === action.payload.id 
          ? action.payload 
          : state.currentCard,
        loading: false,
        error: null,
      };

    // Handle pinning a card success
    case PIN_CARD_SUCCESS:
      return {
        ...state,
        userCards: state.userCards.map(card => 
          card.id === action.payload.id 
            ? { ...action.payload }
            : card.isPinned === action.payload.isPinned
              ? { ...card, position: card.position + (action.payload.isPinned ? 1 : -1) }
              : card
        ).sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return a.position - b.position;
        }),
        loading: false,
      };

    // Handle various failure actions
    case FETCH_CARDS_FAILURE:
    case FETCH_CARD_FAILURE:
    case CREATE_CARD_FAILURE:
    case DELETE_CARD_FAILURE:
    case FETCH_USER_CARDS_FAILURE:
    case UPDATE_CARD_FAILURE:
    case PIN_CARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Handle toggling card sections
    case TOGGLE_CARD_SECTIONS:
      return {
        ...state,
        userCards: state.userCards.map(card =>
          card.id === action.payload.cardId
            ? { ...card, sectionsEnabled: action.payload.enabled }
            : card
        ),
        currentCard: state.currentCard && state.currentCard.id === action.payload.cardId
          ? { ...state.currentCard, sectionsEnabled: action.payload.enabled }
          : state.currentCard,
      };

    // Handle adding a card section
    case ADD_CARD_SECTION:
      return {
        ...state,
        userCards: state.userCards.map(card =>
          card.id === action.payload.cardId
            ? { ...card, sections: [...(card.sections || []), action.payload.section] }
            : card
        ),
        currentCard: state.currentCard && state.currentCard.id === action.payload.cardId
          ? { ...state.currentCard, sections: [...(state.currentCard.sections || []), action.payload.section] }
          : state.currentCard,
      };

    // Handle setting the current card
    case SET_CURRENT_CARD:
      return {
        ...state,
        currentCard: action.payload,
      };

    // Handle toggle sections and add section errors
    case 'TOGGLE_SECTIONS_ERROR':
    case 'ADD_SECTION_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    // Default case: return current state
    default:
      return state;
  }
};

export default cardReducer;