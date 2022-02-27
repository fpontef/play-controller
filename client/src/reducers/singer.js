import {
  GET_SINGERS,
  SINGER_ERROR
} from '../actions/actionTypes';

const initialState = {
  singers: [],
  singer: null,
  isLoading: true,
  error: {}
}

const singerReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_SINGERS:
      return {
        ...state,
        singers: action.payload,
        isLoading: false
      };
    case SINGER_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}

export default singerReducer;
