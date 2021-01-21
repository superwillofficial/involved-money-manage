const getItem = (text, parent, extras = {}) => ({ text, parent, ...extras });

module.exports = {
  /**
   *  查询管理
   */

  // 查询申请
  AddQueryApply: getItem('新增查询申请', 'QueryApply'),
  EditQueryApply: getItem('编辑查询申请', 'QueryApply'),
  SaveQueryApply: getItem('保存查询申请', 'QueryApply'),
  SubmitQueryApply: getItem('提交查询申请', 'QueryApply'),
  DeleteQueryApply: getItem('删除查询申请', 'QueryApply'),
  QueryApplyDetail: getItem('查询申请明细', 'QueryApply'),
  QueryApplyResult: getItem('查询申请查询结果', 'QueryApply'),

  // 查询审核
  AuditQueryApply: getItem('审核查询申请', 'QueryAudit'),

  /**
   * 抵押权人备案
   */

  // 备案信息
  AddMortgageeRecord: getItem('新增备案信息', 'MortgageeRecord'),
  EditMortgageeRecord: getItem('编辑备案信息', 'MortgageeRecord'),
  DeleteMortgageeRecord: getItem('删除备案信息', 'MortgageeRecord'),

  /**
   * 抵押管理
   */

  // 抵押登记申请
  MortgageRegisterApplyBefore: getItem('抵押登记前查询', 'MortgageRegisterApply'),
  SaveMortgageRegisterApply: getItem('保存抵押登记申请', 'MortgageRegisterApply'),
  SubmitMortgageRegisterApply: getItem('登记抵押登记申请', 'MortgageRegisterApply'),

  // 抵押登记查询
  EditMortgageRegisterQuery: getItem('编辑抵押登记', 'MortgageRegisterQuery'),
  DeleteMortgageRegisterQuery: getItem('删除抵押登记', 'MortgageRegisterQuery'),
  MortgageRegisterQueryDetail: getItem('抵押登记详情', 'MortgageRegisterQuery'),

  // 抵押登记审核
  AuditMortgageRegisterAudit: getItem('审核抵押登记', 'MortgageRegisterAudit'),
  MortgageRegisterAuditDetail: getItem('抵押登记详情', 'MortgageRegisterAudit'),

  // 抵押提交申请
  UploadMortgageSubmitApply: getItem('上传影像', 'MortgageSubmitApply'),
  MortgageSubmitApplyDetail: getItem('抵押详情', 'MortgageSubmitApply'),

  // 上传影像
  UploadMortgageUploadVideo: getItem('上传影像', 'MortgageUploadVideo'),
  SaveMortgageUploadVideo: getItem('保存申请', 'MortgageUploadVideo'),
  SubmitMortgageUploadVideo: getItem('提交申请', 'MortgageUploadVideo'),
  UploadMortgageAttachment: getItem('上传附件', 'MortgageUploadVideo'),
  PreviewMortgageAttachment: getItem('预览附件', 'MortgageUploadVideo'),
  DownloadMortgageAttachment: getItem('下载附件', 'MortgageUploadVideo'),
  DeleteMortgageAttachment: getItem('删除附件', 'MortgageUploadVideo'),

  // 抵押提交审核
  AuditMortgageSubmit: getItem('审核', 'MortgageSubmitAudit'),
  SubmitMortgageApply: getItem('提交申请', 'MortgageSubmitAudit'),
  MortgageSubmitDetail: getItem('详情', 'MortgageSubmitAudit'),
  SubmitMortgageSubmit: getItem('提交', 'MortgageSubmitAudit'),
  ReviewMortgageSubmitAttachement: getItem('附件预览', 'MortgageSubmitAudit'),

  // 办理进度查询
  GenerateELicense: getItem('生成电子证照', 'MortgageSchedule'),

  // 电子证照
  DownloadELicense: getItem('下载电子证照', 'ELicense'),

  /**
   * 解押管理
   */

  // 解押登记申请
  ReMortgageRegisterApplyBefore: getItem('解押登记前查询', 'ReMortgageRegisterApply'),
  SaveReMortgageRegisterApply: getItem('保存解押登记申请', 'ReMortgageRegisterApply'),
  SubmitReMortgageRegisterApply: getItem('登记解押登记申请', 'ReMortgageRegisterApply'),

  // 解押登记查询
  EditReMortgageRegisterQuery: getItem('编辑解押登记', 'ReMortgageRegisterQuery'),
  DeleteReMortgageRegisterQuery: getItem('删除解押登记', 'ReMortgageRegisterQuery'),
  ReMortgageRegisterQueryDetail: getItem('解押登记详情', 'ReMortgageRegisterQuery'),

  // 解押登记审核
  AuditReMortgageRegisterAudit: getItem('审核解押登记', 'ReMortgageRegisterAudit'),
  ReMortgageRegisterAuditDetail: getItem('解押登记详情', 'ReMortgageRegisterAudit'),

  // 解押提交申请
  UploadReMortgageSubmitApply: getItem('上传影像', 'ReMortgageSubmitApply'),
  ReMortgageSubmitApplyDetail: getItem('解押详情', 'ReMortgageSubmitApply'),

  // 上传影像
  UploadReMortgageUploadVideo: getItem('上传影像', 'ReMortgageUploadVideo'),
  SaveReMortgageUploadVideo: getItem('保存申请', 'ReMortgageUploadVideo'),
  SubmitReMortgageUploadVideo: getItem('提交申请', 'ReMortgageUploadVideo'),
  UploadReMortgageAttachment: getItem('上传附件', 'ReMortgageUploadVideo'),
  PreviewReMortgageAttachment: getItem('预览附件', 'ReMortgageUploadVideo'),
  DownloadReMortgageAttachment: getItem('下载附件', 'ReMortgageUploadVideo'),
  DeleteReMortgageAttachment: getItem('删除附件', 'ReMortgageUploadVideo'),

  // 解押提交审核
  AuditReMortgageSubmit: getItem('审核', 'ReMortgageSubmitAudit'),
  SubmitReMortgageApply: getItem('提交申请', 'ReMortgageSubmitAudit'),
  ReMortgageSubmitDetail: getItem('详情', 'ReMortgageSubmitAudit'),
  SubmitReMortgageSubmit: getItem('提交', 'ReMortgageSubmitAudit'),
  ReviewReMortgageSubmitAttachement: getItem('附件预览', 'ReMortgageSubmitAudit'),

  // 办理进度查询
  GenerateELicense: getItem('生成电子证照', 'ReMortgageSchedule'),

  /**
   * 移交管理
   */

  //  抵押移交清册
  AddMortgaeInventory: getItem('新增抵押移交清册', 'MortgageTransferInventory'),
  EditMortgaeInventory: getItem('编辑抵押移交清册', 'MortgageTransferInventory'),
  DeleteMortgaeInventory: getItem('删除抵押移交清册', 'MortgageTransferInventory'),
  MortgaeInventoryDetail: getItem('抵押移交清册详情', 'MortgageTransferInventory'),
  SaveMortgaeInventory: getItem('保存抵押移交清册', 'MortgageTransferInventoryAdd'),
  SubmitMortgaeInventoryApply: getItem('提交抵押移交清册申请', 'MortgageTransferInventoryAdd'),
  AddMortgaeInventoryReacord: getItem('新增清册记录', 'MortgageTransferInventoryAdd'),
  EditMortgaeInventoryRecord: getItem('编辑清册记录', 'MortgageTransferInventoryAdd'),
  SaveMortgaeInventoryRecord: getItem('保存清册记录', 'MortgageTransferInventoryAdd'),
  DeleteMortgaeInventoryRecord: getItem('删除清册记录', 'MortgageTransferInventoryAdd'),
  PrintMortgaeInventoryRecord: getItem('打印清册记录', 'MortgageTransferInventoryAdd'),

  //  解押移交清册
  AddReMortgaeInventory: getItem('新增解押移交清册', 'ReMortgageTransferInventory'),
  EditReMortgaeInventory: getItem('编辑解押移交清册', 'ReMortgageTransferInventory'),
  DeleteReMortgaeInventory: getItem('删除解押移交清册', 'ReMortgageTransferInventory'),
  ReMortgaeInventoryDetail: getItem('解押移交清册详情', 'ReMortgageTransferInventory'),
  SaveReMortgaeInventory: getItem('保存解押移交清册', 'ReMortgageTransferInventoryAdd'),
  SubmitReMortgaeInventoryApply: getItem('提交解押移交清册申请', 'ReMortgageTransferInventoryAdd'),
  AddReMortgaeInventoryReacord: getItem('新增清册记录', 'ReMortgageTransferInventoryAdd'),
  EditReMortgaeInventoryRecord: getItem('编辑清册记录', 'ReMortgageTransferInventoryAdd'),
  SaveReMortgaeInventoryRecord: getItem('保存清册记录', 'ReMortgageTransferInventoryAdd'),
  DeleteReMortgaeInventoryRecord: getItem('删除清册记录', 'ReMortgageTransferInventoryAdd'),
  PrintReMortgaeInventoryRecord: getItem('打印清册记录', 'ReMortgageTransferInventoryAdd'),

  /**
   * 系统管理
   */

  // 机构管理
  AddOrganizationManagement: getItem('新增机构', 'OrganizationManagement'),
  EditOrganizationManagement: getItem('编辑机构', 'OrganizationManagement'),
  DeleteOrganizationManagement: getItem('删除机构', 'OrganizationManagement'),

  // 角色权限管理
  AddRoleManagement: getItem('新增角色', 'RoleManagement'),
  EditRoleManagement: getItem('编辑角色', 'RoleManagement'),
  DeleteRoleManagement: getItem('删除角色', 'RoleManagement'),
  SaveMenuPermission: getItem('保存菜单权限', 'RoleManagement'),
  SavePowerPermission: getItem('保存功能权限', 'RoleManagement'),

  // 用户管理
  AddUserManagement: getItem('新增用户', 'UserManagement'),
  EditUserManagement: getItem('编辑用户', 'UserManagement'),
  DeleteUserManagement: getItem('删除用户', 'UserManagement'),
}
