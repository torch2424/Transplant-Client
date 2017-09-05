/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './app.container';
import HomePage from './pages/home/home.container';
import FtpBrowserPage from './pages/ftpBrowser/ftpBrowser.container';
import PendingTransfers from './pages/pendingTransfers/pendingTransfers.container';
import Settings from './pages/settings/settings.container';

export default () => (
  <App>
    <Switch>
      <Route path="/settings" component={Settings} />
      <Route path="/pending" component={PendingTransfers} />
      <Route path="/view" component={FtpBrowserPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
