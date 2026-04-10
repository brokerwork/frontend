// 日志/评论

import TimeLine from 'components/v2/TimeLine';
import cs from './TaskLogAndComment.less';
import { FormattedMessage } from 'react-intl';
import { Button } from 'lean-ui';
import i18n from 'utils/i18n';
import { TASK_TYPES } from '../../../contants';

export default class TaskComment extends PureComponent {
  state = {
    commentContent: ''
  };
  commentContentChange = e => {
    const v = e.target.value;
    this.setState({
      commentContent: v
    });
  };
  addComment = () => {
    const { addComment, getComments, userInfo } = this.props;
    const { commentContent } = this.state;
    addComment({
      content: commentContent,
      reviewer: {
        key: userInfo.pubUserId,
        name: userInfo.name
      }
    }).then(({ result }) => {
      if (!result) return;
      getComments();
      this.setState({
        commentContent: ''
      });
    });
  };
  clearComment = () => {
    this.setState({
      commentContent: ''
    });
  };
  render() {
    const { data, userInfo, taskType } = this.props;
    const { commentContent } = this.state;
    return (
      <div>
        <div className={cs.timelineBox}>
          <TimeLine data={data} format={format.bind(this, taskType)} />
        </div>
        <div className={cs['add-comment-box']}>
          <div className={cs['user-image']}>
            <img src={userInfo.headImage} />
          </div>
          <div className={cs['comment-content']}>
            <input
              type="text"
              onChange={this.commentContentChange}
              className={'form-control'}
              value={commentContent}
            />
          </div>
        </div>
        <div className={cs['comment-btns']}>
          <Button type="primary" onClick={this.addComment}>
            {i18n['general.release']}
          </Button>
          <Button type="default" onClick={this.clearComment}>
            {i18n['general.cancel']}
          </Button>
        </div>
      </div>
    );
  }
}

function format(taskType, v) {
  const __taskType =
    taskType === TASK_TYPES.AGENCY ? `.${taskType.toLowerCase()}` : '';
  return (
    <FormattedMessage
      id="task.details.log"
      defaultMessage={v}
      values={{
        create: i18n[`task.details.log.create${__taskType}`],
        edit: i18n['task.details.log.edit'],
        claim: i18n['task.details.log.claim'],
        finish: i18n['task.details.log.finish'],
        finish_auto: i18n['task.details.log.finish_auto'],
        close: i18n['task.details.log.close'],
        reject_reason: i18n['task.details.log.reason'],
        stop: i18n[`task.details.log.stop${__taskType}`],
        assign: i18n['task.details.log.assign'],
        endtime: i18n['task.details.log.endtime'],
        priority: i18n['task.details.log.priority'],
        priority_very_important:
          i18n['task.details.log.priority_very_important'],
        priority_important: i18n['task.details.log.priority_important'],
        priority_none: i18n['task.details.log.priority_none'],
        business: i18n['task.details.log.business'],
        business_server_group: i18n['task.details.log.business_server_group'],
        business_associated: i18n['task.details.log.business_associated'],
        business_mt_group: i18n['task.details.log.business_mt_group'],
        business_account_group: i18n['task.details.log.business_account_group'],
        business_account_ownership:
          i18n['task.details.log.business_account_ownership'],
        look: i18n['task.details.log.look'],
        confirm: i18n['task.details.log.confirm'],
        reject: i18n['task.details.log.reject'],
        refuse: i18n['task.details.log.refuse'],
        race: i18n['task.details.log.race'],
        edit_endtime: i18n['task.details.log.edit_endtime'],
        edit_priority: i18n['task.details.log.edit_priority'],
        edit_business: i18n['task.details.log.edit_business'],
        edit_other: i18n['task.details.log.edit_other'],
        comment: i18n['task.details.log.comment'],
        other: i18n['task.details.log.other']
      }}
    />
  );
}
