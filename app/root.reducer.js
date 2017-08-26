import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import sftp from './services/sftp/sftp.reducer';

const rootReducer = combineReducers({
  sftp,
  router,
});

export default rootReducer;
