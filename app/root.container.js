import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from './routes';

type RootType = {
  store: {},
  history: {}
};

export default function Root({ store, history }: RootType) {
  // if our state does not have a location, go to the intitial page
  if (!store.getState().router.location) {
    history.replace('/');
  }
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
}
