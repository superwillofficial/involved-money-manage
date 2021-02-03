import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { NotFound } from '@pages';
import {
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import * as pages from '@pages';

const renderRoute = (route) => {
  const props = {
    key: route.key,
    exact: route.exact,
    path: route.path,
  };
  if (route.redirect) {
    return (<Route {...props}><Redirect to={route.redirect} /></Route>);
  } else {
    props.component = pages[route.component];
  }
  return <Route {...props} />;
};

export default ({ routerList = [] }) => {
  const history = useHistory();
  // 本地存储中存在路由值 则使用路由重定向
  useEffect(() => {
    const cacheRoutePath = localStorage.getItem('route');
    history.push(cacheRoutePath);
  }, []);
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => <Redirect to="/home" />}
      />
      { routerList.map(renderRoute) }
      <Route path="*"><NotFound /></Route>
    </Switch>
  );
};
