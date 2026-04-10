const PRE_FIX = "ACCOUNT_MENAGEMENT_";

const ActionTypes = {
  SelectAllAccount: `${PRE_FIX}SelectAllAccount`,
  SelectAccount: `${PRE_FIX}SelectAccount`,
  ShowFirstNameError: `${PRE_FIX}ShowFirstNameError`,
  HideFirstNameError: `${PRE_FIX}HideFirstNameError`,
  ShowLastNameError: `${PRE_FIX}ShowLastNameError`,
  HideLastNameError: `${PRE_FIX}HideLastNameError`,
  ShowAccountGroupError: `${PRE_FIX}ShowAccountGroupError`,
  HideAccountGroupError: `${PRE_FIX}HideAccountGroupError`,
  ShowLeverageError: `${PRE_FIX}ShowLeverageError`,
  HideLeverageError: `${PRE_FIX}HideLeverageError`,
  EditAccount: `${PRE_FIX}EditAccount`,
  HideAccountEditor: `${PRE_FIX}HideAccountEditor`,
  ReceiveAccount: `${PRE_FIX}ReceiveAccount`,
  AddAccount: `${PRE_FIX}AddAccount`,
  ReceiveAccountGroup: `${PRE_FIX}ReceiveAccountGroup`,
  ReceiveUserBelongTo: `${PRE_FIX}ReceiveUserBelongTo`,
  ReceiveLeverage: `${PRE_FIX}ReceiveLeverage`,
  ReceiveNationality: `${PRE_FIX}ReceiveNationality`,
  ReceiveFinInfo: `${PRE_FIX}ReceiveFinInfo`,
  InitFinInfo: `${PRE_FIX}InitFinInfo`,
  InitCerInfo: `${PRE_FIX}InitCerInfo`, // 初始化证件信息
  FETCH_CUSTOMERS: `${PRE_FIX}FETCH_CUSTOMERS`,
  ReceiveCustomer: `${PRE_FIX}ReceiveCustomer`,
  SELECTSEVER: `${PRE_FIX}SELECTSEVER`,
  // ReceiveAssetsRange: `${PRE_FIX}ReceiveAssetsRange`, // 总资产、净资产、流动资产、年净收入、投资额度下拉列表
  // ReceiveInvestmentYear: `${PRE_FIX}ReceiveInvestmentYear`, // 投资年限
  // ReceiveKnowledgeLevel: `${PRE_FIX}ReceiveKnowledgeLevel`, // 知识水平
  // ReceiveIncomeSource: `${PRE_FIX}ReceiveIncomeSource`, // 收入来源
  // ReceiveInvestmentExperience: `${PRE_FIX}ReceiveInvestmentExperience`, // 投资经验
  CheckEnable: `${PRE_FIX}CheckEnable`,
  CheckDisable: `${PRE_FIX}CheckDisable`,
  CheckReadOnly: `${PRE_FIX}CheckReadOnly`,
  CheckNotReadOnly: `${PRE_FIX}CheckNotReadOnly`,
  ChangePageSize: `${PRE_FIX}ChangePageSize`,
  DeleteAccount: `${PRE_FIX}DeleteAccount`,
  ReceiveWorkAge: `${PRE_FIX}ReceiveWorkAge`,
  UpdateBaseInfo: `${PRE_FIX}UpdateBaseInfo`, // 更新账户基本资料
  HideEditAccountCard: `${PRE_FIX}HideEditAccountCard`, // 关闭编辑账户
  UpdateFinInfo: `${PRE_FIX}UpdateFinInfo`, // 更新财务信息
  UpdateCertInfo: `${PRE_FIX}UpdateCertInfo`, // 更新证件信息
  ChangeAccountEditorCardTab: `${PRE_FIX}ChangeAccountEditorCardTab`, // 编辑账户tab切换
  ChangeUserSearchType: `${PRE_FIX}ChangeUserSearchType`,
  ChangeDataRange: `${PRE_FIX}ChangeDataRange`,
  FETCH_CERTIFICATES_FIELDS: `${PRE_FIX}FETCH_CERTIFICATES_FIELDS`,
  FETCH_BASIC_FIELDS: `${PRE_FIX}FETCH_BASIC_FIELDS`,
  FETCH_FINANCE_FIELDS: `${PRE_FIX}FETCH_FINANCE_FIELDS`,
  FETCH_ACCOUNT_FIELDS: `${PRE_FIX}FETCH_ACCOUNT_FIELDS`,
  FETCH_ACCOUNT_GROUPS: `${PRE_FIX}FETCH_ACCOUNT_GROUPS`,
  FETCH_PHONE_COUNTRY_CODE: `${PRE_FIX}FETCH_PHONE_COUNTRY_CODE`,
}

export default ActionTypes;
