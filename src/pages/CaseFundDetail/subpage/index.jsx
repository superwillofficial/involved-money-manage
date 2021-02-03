import React, { Fragment, useEffect } from 'react';
import { Divider } from "antd";
import CaseInfo from './CaseInfo';
import Party from './Party';
import FundManagementPlan from './FundManagementPlan';
import CaseProcedure from './CaseProcedure';
import VictimModal from './VictimModal';
import FundSplittingModal from './FundSplittingModal';
import RecheckModal from './RecheckModal';
import UploadModal from './UploadModal';
import { useStore } from '../store';
import BackButton from './BackButton';

export default () => {
  const store = useStore();

  useEffect(() => {
    const id = store.caseStore.case.id;
    if (id) {
      store
        .setValue('id', id)
        .getCaseDetail(id);
      store.getCaseFundDetail(id);
    }
  }, []);
  return (
    <Fragment>

      <BackButton />

      <CaseInfo />

      <Divider />

      <Party />

      <FundManagementPlan />

      <CaseProcedure />

      <VictimModal />

      <FundSplittingModal />

      <RecheckModal />

      <UploadModal />
    </Fragment>
  );
};
