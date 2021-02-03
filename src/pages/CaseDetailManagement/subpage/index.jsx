import React, { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Collapse } from "antd";
import BackButton from './BackButton';
import CaseInfo from './CaseInfo';
import SuspectInfo from './SuspectInfo';
import { useStore } from '../store';

export default () => {
  const store = useStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      store
        .setValue('id', id)
        .getCaseDetail(id);
    }
  }, []);
  return (
    <Fragment>

      <BackButton />

      <Collapse defaultActiveKey={['1', '2']}>

        <Collapse.Panel header="案件基本信息" key="1">
          <CaseInfo />
        </Collapse.Panel>

        <Collapse.Panel header="当事人信息" key="2">
          <SuspectInfo />
        </Collapse.Panel>

      </Collapse>

    </Fragment>
  );
};
