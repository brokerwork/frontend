import Tag from 'components/Tag';
import cs from './TaskInfo.less';
import i18n from 'utils/i18n';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';
import cls from 'utils/class';
import { FormattedMessage } from 'react-intl';
import { TASK_TYPES } from '../../contants';

export default class TaskInfo extends PureComponent {
  state = {
    timeoutTimestamp: moment()
      .subtract(1, 'day')
      .endOf('day')
  };
  render() {
    const {
      data,
      className = '',
      closed,
      tagsClassName = '',
      taskType
    } = this.props;
    const { timeoutTimestamp } = this.state;
    const processUserArray = data.participantInfoSet || [];
    let processUsers = processUserArray.map(v => {
      return v.name;
    });
    processUsers = processUsers.join(',');
    let timeOut = false;
    if (!closed && data.endTime) {
      timeOut = moment(data.endTime).isBefore(timeoutTimestamp);
    }
    let priorityText = '';
    let priorityBsStyle = '';
    switch (`${data.priority}`) {
      case '2':
        priorityBsStyle = 'warning';
        priorityText = i18n['task.object_detail.priority.important'];
        break;
      case '3':
        priorityBsStyle = 'danger';
        priorityText = i18n['task.object_detail.priority.very_important'];
        break;
      default:
        priorityBsStyle = '';
        priorityText = i18n['task.object_detail.priority.normal'];
    }
    return (
      <div
        className={cls`${className}
                      ${closed ? cs['closed'] : ''}
                      ${cs['container']} main-color-hover`}
      >
        <span className={cs['jobName']}>
          {data.jobName ? (
            <FormattedMessage
              id="task.details.task_name"
              defaultMessage={data.jobName}
              values={{
                ta_user:
                  taskType === TASK_TYPES.TA
                    ? i18n['task.details.task_name.ta_user']
                    : i18n['task.details.task_name.agency'],
                account: i18n['task.details.task_name.account'],
                transfer_out: i18n['task.details.task_name.transfer_out'],
                transfer_in: i18n['task.details.task_name.transfer_in']
              }}
            />
          ) : (
            undefined
          )}
        </span>
        {/*<span className={cs['jobName']}>{data.jobName}</span>*/}
        <div className={`${cs['tags']} ${tagsClassName}`}>
          {data.jobNo ? (
            <span className={cs['jobNumber']}>{`ID: ${data.jobNo}`}</span>
          ) : (
            undefined
          )}
          {data.amount ? (
            <Tag
              bsSize="small"
              className={cs['tag']}
              bsStyle={data.payState === 'Finished' ? 'warning' : undefined}
            >
              {`USD ${data.amount}${
                data.payState
                  ? ` (${i18n[`task.form.pay_status.${data.payState}`]})`
                  : ''
              }`}
            </Tag>
          ) : (
            undefined
          )}
          {/*** 被data.amount指派人 结束时间 ***/}
          {processUserArray.length > 0 ? (
            <Tag
              className={cs['tag']}
              bsStyle={timeOut ? 'danger' : ''}
              bsSize="small"
            >
              {`${processUsers} ${
                data.endTime ? moment(data.endTime).format(dateFormatStyle) : ''
              }`}
            </Tag>
          ) : (
            undefined
          )}
          {/*** 所属项目-所属任务组 ***/}
          <Tag bsSize="small" className={cs['tag']}>{`${i18n[
            `task.object_setting.task_setting.task_group_type.${data.jobType}`
          ] || ''} - ${data.itemName || ''}`}</Tag>
          {/*** 优先级 ***/}
          {data.priority > 1 ? (
            <Tag bsSize="small" className={cs['tag']} bsStyle={priorityBsStyle}>
              {priorityText}
            </Tag>
          ) : (
            undefined
          )}
          {data.isMobile &&
          ['JOB_TYPE_TA_OPEN', 'JOB_TYPE_TA_SAME_OPEN'].includes(
            data.jobType
          ) ? (
            <Tag bsSize="small" className={cs['tag']} bsStyle={priorityBsStyle}>
              {i18n['task.object_detail.from_mobile']}
            </Tag>
          ) : (
            undefined
          )}
        </div>
      </div>
    );
  }
}
