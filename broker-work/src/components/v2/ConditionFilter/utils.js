export const formatterFieldCondition = item => {
  const value = (type => {
    if (type.additions && type.additions.checkbox) {
      return [];
    } else {
      return '';
    }
  })(item);
  return {
    field: item.value,
    condition: item.conditions && item.conditions[0],
    value
  };
};
