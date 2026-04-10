import i18n from 'utils/i18n';
import { Button, Collapse } from 'lean-ui';
import { FormattedMessage } from 'react-intl';
import DatePicker from 'components/v2/DatePicker';
import cs from './TaskDetails.less';
import DropdownForCode from 'components/v2/DropdownForCode';
import moment from 'moment';

const Panel = Collapse.Item;

class EditTask extends PureComponent {
  disabledDate = current => {
    if (moment.isMoment(current)) {
      return Number(current.format('x')) <= this.currentDate;
    }
    return false;
  };
  getCurrentDate = () => {
    return Number(
      moment()
        .startOf('day')
        .format('x')
    );
  };
  currentDate = this.getCurrentDate();
  render() {
    const { data, onCancel, options } = this.props;
    const { endTime, priority, processorList } = this.state;
    let __endTime = endTime && moment(endTime);

    const title = data.jobName ? (
      <FormattedMessage
        id="task.details.task_name"
        defaultMessage={data.jobName}
        values={{
          ta_user: i18n['task.details.task_name.ta_user'],
          account: i18n['task.details.task_name.account'],
          transfer_out: i18n['task.details.task_name.transfer_out'],
          transfer_in: i18n['task.details.task_name.transfer_in']
        }}
      />
    ) : (
      undefined
    );
    return (
      <Collapse activeKey={'0'}>
        <Panel title={title} disabled>
          <div className={`form-horizontal ${cs['form-content']}`}>
            <div className="form-group">
              <label className="control-label col-sm-2">{`${
                i18n['task.object_setting.edit_task_group.assign']
              }:`}</label>
              <div className="col-sm-4">
                <DropdownForCode
                  className={cs['dropdown-width']}
                  value={processorList}
                  data={options.taskMembers}
                  onChange={this.modifyFieldValue.bind(this, 'processorList')}
                />
              </div>
              <label className="control-label col-sm-2">{`${
                i18n['task.object_setting.edit_task_group.task_end_time']
              }:`}</label>
              <div className="col-sm-4">
                <DatePicker
                  onChange={this.modifyFieldValue.bind(this, 'endTime')}
                  disabledDate={this.disabledDate}
                  value={__endTime}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2">{`${
                i18n['task.object_setting.edit_task_group.priority']
              }:`}</label>
              <div className="col-sm-4">
                <DropdownForCode
                  className={cs['dropdown-width']}
                  onChange={this.modifyFieldValue.bind(this, 'priority')}
                  value={priority}
                  data={options.priorityOptions}
                />
              </div>
            </div>
          </div>
          <div className={`text-right ${cs['edit-btns']}`}>
            <Button onClick={this.onSubmit} type="primary">
              {i18n['general.confirm']}
            </Button>
            <Button onClick={onCancel} type="default">
              {i18n['general.cancel']}
            </Button>
          </div>
        </Panel>
      </Collapse>
    );
  }
  onSubmit = () => {
    const { onSubmit } = this.props;
    const { processorList, endTime, priority } = this.state;
    let __processorList;
    if (processorList) {
      __processorList = [
        {
          handle: false,
          userId: processorList
        }
      ];
    }
    onSubmit({
      endTime,
      priority,
      processorList: __processorList
    });
  };
  constructor(props) {
    super(props);
    const {
      data: { endTime, priority, processorList }
    } = props;
    let __processorListArray;
    if (Array.isArray(processorList) && processorList.length > 0) {
      __processorListArray = processorList[0].value;
    }
    this.state = {
      priority,
      endTime,
      processorList: __processorListArray
    };
  }
  modifyFieldValue(field, e) {
    const __obj = {};
    if (field === 'endTime') {
      __obj[field] = Number(e.format('x'));
      // } else if (field === 'processorList') {
      // console.log(field, e);
      // __obj[field] = e.toISOString();
    } else {
      __obj[field] = e;
    }
    // console.log('options', this.props.options);
    // console.log(field, e, __obj);
    this.setState(__obj);
  }
}

export default EditTask;
