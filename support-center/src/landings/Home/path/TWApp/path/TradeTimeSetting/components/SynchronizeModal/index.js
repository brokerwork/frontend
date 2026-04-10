import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import TimeForm, {TIME_FROM} from '../TimeForm/index.js';
import cs from './SynchronizeModal.less';

export default class SynchronizeModal extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(TIME_FROM);
  }

  onSubmit = (values) => {
    const {activeKey, saveTimeSingle, showTopAlert, onClose, getTimeInfo} = this.props;
    const copyData = [];
    for (let key in values) {  
      let start = values[key].start;
      let end = values[key].end;
      copyData.push({date: key, start: start, end: end});
    } 
    Promise.resolve(saveTimeSingle(activeKey, copyData)).then((res) => {
      if (res.result) {
        showTopAlert({
          content: i18n['general.save_success'],
          style: 'success'
        });
        getTimeInfo(activeKey);
        onClose();
      }
    });
  }
  parseTime = (data) => {
    let copyData = {};
    data.hours && data.hours.forEach((item) => {
      copyData[item.date] = {start: item.start, end: item.end};
    });
    return copyData;
  }
  render() {
    const {onClose, timeInfo} = this.props;
    const data = this.parseTime(timeInfo);
    return (
      <Modal onClose={onClose}>
      <Modal.Header>
        {i18n['menu.twapp.trade_time_setting']}
      </Modal.Header>
      <Modal.Body>
        <div className={cs['select_tips']}>{i18n['twapp.trade_time_setting.time_select_tips']}</div>
        <TimeForm 
        initialValues={data || {}} 
        onChange={this.onFormChange}
        onSubmit={this.onSubmit}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button style="primary" onClick={this.onSave}>{i18n['app.btn.save']}</Button>
        <Button onClick={onClose}>{i18n['app.btn.cancel']}</Button>
      </Modal.Footer>
    </Modal>
    );
  }
}
