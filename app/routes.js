/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './app.container';
import HomePage from './pages/home/home.container';
import FtpBrowserPage from './pages/ftpBrowser/ftpBrowser.container';
import PendingTransfers from './pages/pendingTransfers/pendingTransfers.container';

export default () => (
  <App>
    <Switch>
      <Route path="/pending" component={PendingTransfers} />
      <Route path="/view" component={FtpBrowserPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
