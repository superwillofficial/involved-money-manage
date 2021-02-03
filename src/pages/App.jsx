import React, { useEffect } from 'react';
import { Switch, HashRouter as Router, Route } from 'react-router-dom';

import * as pages from '@pages';
import { useStore } from '@stores/';

const App = () => {
  const changeRootFontSize = () => {
    let curScrollWidth = document.body.scrollWidth;
    let fontSize = null;
    if (curScrollWidth <= 480) {
      fontSize = curScrollWidth / 750 * 75;
    } else if (curScrollWidth <= 750) {
      fontSize = 48;
    } else if (curScrollWidth <= 1200) {
      fontSize = 56;
    } else {
      fontSize = curScrollWidth / 1920 * 75;
    }
    document.querySelector('html').style.fontSize = `${fontSize}px`;
  };

  useEffect(() => {
    changeRootFontSize();
    window.addEventListener('resize', changeRootFontSize);
    return () => window.removeEventListener('resize', changeRootFontSize);
  });

  const store = useStore();
  const routeHelper = store.appStore.routeHelper;
  const routeList = routeHelper.getComponentRouteList('Root', { cascade: false });
  return (
    <Router>
      <Switch>
        {
          routeList.map(({ path, exact, component }, idx) => {
            return (
              <Route key={idx} path={path} exact={exact} component={pages[component]} />
            );
          })
        }
      </Switch>
    </Router>
  );
};

export default App;
