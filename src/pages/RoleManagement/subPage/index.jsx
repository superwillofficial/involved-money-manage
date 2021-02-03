import React from 'react';
import Role from './Role';
import Actions from './Actions';

export default () => {
  return (
    <div className="content-block-box clearfix">

      {/* 角色列表 */}
      <Role />

      {/* 权限 */}
      <Actions />

    </div>
  );
};
