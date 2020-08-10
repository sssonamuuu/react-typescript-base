import * as React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Layout from 'pages/Layout';
import asyncLoadComponent from 'utils/asyncLoadComponent';

export default function App () {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/"
          component={() => (
            <Layout>
              <Route path="/" exact component={asyncLoadComponent(() => import(/* webpackChunkName: "page-home" */ 'pages/Home'))} />
            </Layout>
          )} />
      </Switch>
    </BrowserRouter>
  );
}
