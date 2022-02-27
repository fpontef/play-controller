import axios from 'axios';
import { setAlert } from './alert';
import { 
  REGISTER_SUCCESS, 
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './actionTypes';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
  if(localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch(err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
}

// Register User
export const setRegister = ({ name, login, password, isAdmin }) => 
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = JSON.stringify({ name, login, password, isAdmin });

    try {
      //const res = await axios.post('/api/users', body, config);
      // On original proposal the user would register and already login.
      // But on this app, to register, the user must be already an admin/moderator.
      await axios.post('/api/users', body, config);

      dispatch({ type: REGISTER_SUCCESS });
      dispatch(setAlert(`Usuário ${login}, cadastrado com sucesso.`, 'success'));
    } catch (err) {
      const errors = err.response.data.errors;

      if(errors) {
        errors.forEach( (error) => dispatch(setAlert(error.msg, 'danger')) );
      }

      dispatch({
        type: REGISTER_FAIL
      })
    }
  }

// User Login
export const setLogin = ({ login, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ login, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());

  } catch (err) {
    const errors = err.response.data.errors;

    if(errors) {
      errors.forEach( (error) => dispatch(setAlert(error.msg, 'danger')) );
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout
export const setLogout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
}

