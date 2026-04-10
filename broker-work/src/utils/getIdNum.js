export const CARD_LABEL_REGEXP = {
  idNum: ['身份证', 'ID Card', '身份證', '身分証明書', 'ID card', 'id card']
};
//type : 'idNum' 身份证 目前只有身份证， 后续可能有港澳通行证
export default (data, fields, type = 'idNum') => {
  const ID_TYPE_KEY = 'idType';
  const fieldsIdTypeItem =
    fields && fields.find && fields.find(item => item.key === ID_TYPE_KEY);
  const fieldsIdtypeOptions = fieldsIdTypeItem && fieldsIdTypeItem.optionList;
  const idTypeValue = data && data[ID_TYPE_KEY];
  const idTypeValueMatchedOption =
    fieldsIdtypeOptions &&
    fieldsIdtypeOptions.find(item => item.value === idTypeValue);
  const idTypeLabel =
    idTypeValueMatchedOption && idTypeValueMatchedOption.label;
  const matchType = CARD_LABEL_REGEXP[type];
  let isLabelMatched = false;
  if (idTypeLabel && matchType) {
    isLabelMatched = matchType.includes(idTypeLabel);
  }
  if (isLabelMatched) {
    return data.idNum;
  }
};
