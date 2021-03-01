import React, { Fragment } from 'react';
import { useObserver } from 'mobx-react-lite';

import { useStore } from '../store';
import SubAccount from './SubAccount';
import MainAccount from './MainAccount';

export default () => useObserver(() => {
  const store = useStore();
  return (
    <Fragment>
      {
        store.accountType === 'main' ?
          <MainAccount /> : <SubAccount />
      }
    </Fragment>
  );
});