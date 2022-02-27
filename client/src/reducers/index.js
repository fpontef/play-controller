import { combineReducers } from 'redux';
import alertReducer from './alert';
import authReducer from './auth';
import singerReducer from './singer';

const rootReducer = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  singer: singerReducer
});

export default rootReducer;
