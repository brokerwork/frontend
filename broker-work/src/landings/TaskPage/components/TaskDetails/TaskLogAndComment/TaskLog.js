// 审批流程

import TimeLine from 'components/v2/TimeLine';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import { TASK_TYPES } from '../../../contants';
import cs from './TaskLogAndComment.less';
export default ({ data, taskType }) => {
  const d = Array.isArray(data)
    ? data.map(item => ({
        ...item,
        user: format(item.user)
      }))
    : [];

  return (
    <div className={cs.timelineBox}>
      <TimeLine data={d} type="2" />
    </div>
  );
};

function format(v) {
  return (
    <FormattedMessage
      id="task.details.log"
      defaultMessage={v}
      values={{
        apply: i18n[`task.details.log.apply`],
        claim: i18n[`task.details.log.claim`],
        assign: i18n[`task.details.log.assign`],
        refuse: i18n[`task.details.log.refuse`],
        reject: i18n[`task.details.log.reject`],
        confirm: i18n[`task.details.log.confirm`],
        send: i18n[`task.details.log.send`],
        wprocess: i18n[`task.details.log.wprocess`],
        wsend: i18n[`task.details.log.wsend`],
        wclaim: i18n[`task.details.log.wclaim`],
        approval_finish: i18n['task.details.log.approval_finish']
      }}
    />
  );
}
