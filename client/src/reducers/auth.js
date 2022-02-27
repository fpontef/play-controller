import { 
  REGISTER_SUCCESS, 
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../actions/actionTypes';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthed: null,
  isLoading: true,
  user: { isAdmin: false }
};

const authReducer = (state = initialState, action) => {
  switch(action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthed: true,
        isLoading: false,
        user: {
          ...action.payload
        }
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthed: false,
        isLoading: false,
        user: { isAdmin: false }
      };
    case LOGIN_SUCCESS:
      // payload will get: payload : { token: 'CODIGO' }
      // instead of payload: { 'CODIGO' }.
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthed: true,
        isLoading: false
      };
    default:
      return state;
  }
}

export default authReducer;
