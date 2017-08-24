import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './pages/counter/counter.reducer';
import sftp from './services/sftp/sftp.reducer';

const rootReducer = combineReducers({
  counter,
  sftp,
  router,
});

export default rootReducer;
