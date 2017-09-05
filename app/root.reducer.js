import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import transplant from './services/transplant/transplant.reducer';

const rootReducer = combineReducers({
  transplant,
  router,
});

export default rootReducer;
