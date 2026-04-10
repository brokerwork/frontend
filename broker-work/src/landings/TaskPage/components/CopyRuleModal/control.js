import { createAction, handleActions } from 'redux-actions';
import { get, post, all } from 'utils/ajax';

const PRE_FIX = 'TASK_COPY_RULES_MODAL_';
const GET_RULES = `${PRE_FIX}GET_RULES`;
const COPY_RULE = `${PRE_FIX}COPY_RULE`;

export const actions = {};
export const reducers = {};

const getRules = createAction(GET_RULES, (type) => {
  return Promise.resolve({
    result: true,
    data: [
      {id: 1, name: "已配置流程1"},
      {id: 2, name: "已配置流程2"},
      {id: 3, name: "已配置流程3"},
      {id: 4, name: "已配置流程4"},
    ]
  })
});
actions['getRules'] = getRules;

const rules = handleActions({
  [GET_RULES]: (_, {payload}) => payload
}, []);
reducers['rules'] = rules;

const copyRule =  createAction(COPY_RULE, (id) => {
  return Promise.resolve({
    result: true
  });
});
actions['copyRule'] = copyRule;

