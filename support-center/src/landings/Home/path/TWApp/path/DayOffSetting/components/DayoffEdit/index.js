import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import DayoffEditForm, { DAYOFF_EDIT_FORM } from '../Form/DayoffEditForm.js';
import moment from 'moment';

export default class DayoffEdit extends PureComponent {
  onClose() {
    const { closeDayoff } = this.props;
    closeDayoff();
  }
  onSave() {
    const { submitForm } = this.props;
    submitForm(DAYOFF_EDIT_FORM);
  }
  onSubmit(datas) {
    let { start, end } = datas.time;
    datas.time.start = start = this.timeFomat(start);
    datas.time.end = end = this.timeFomat(end);
    const sub = Number(end.replace(':', '')) - Number(start.replace(':', ''));
    if (sub < 0) {
      const { showTopAlert } = this.props;
      showTopAlert({
        content: i18n['twapp.dayoffsetting.dayoff.start>end'] 
      });
      return;
    }
    const { activeServerId, addDayOffSubmit, editDayOffSubmit } = this.props;
    const submitData = this.assemblyData(datas);
    if (submitData.id) {
      editDayOffSubmit(activeServerId, submitData).then(res => this.dayOffSubmitProcess(res));
      return;
    }
    addDayOffSubmit(activeServerId, submitData).then(res => this.dayOffSubmitProcess(res));
  }
  timeFomat(time) {
    let newTime = '';
    if (moment.isMoment(time)) {
      newTime = time.format('HH:mm');
    } else {
      newTime = time;
    }
    return newTime;
  }
  dayOffSubmitProcess(res) {
    const { activeServerId, getServerDayOffList, serverDayOffList, closeDayoff } = this.props;
    if (res.result) {
      closeDayoff();
      getServerDayOffList({
        serverId: activeServerId,
        page: serverDayOffList.page,
        pageSize: serverDayOffList.pageSize
      });
    }
  }
  assemblyData(data) {
    let temp = {
      date: data.date.format('YYYY-MM-DD'),
      enabled: data.enabled,
      start: data.time.start,
      end: data.time.end,
      name: data.name,
      symbols: data.symbols,
      yearRepeat: data.yearRepeat
    };
    if (data.id) {
      temp.id = data.id;
    }
    return temp;
  }
  formatData(data) {
    let temp = {
      date: moment(data.date),
      enabled: data.enabled,
      time: { start: data.start, end: data.end },
      name: data.name,
      symbols: data.symbols,
      yearRepeat: data.yearRepeat
    };
    if (data.id) temp.id = data.id;
    return temp;
  }
  render() {
    const { symbolList, dayoffEditData } = this.props;
    const initialVal = this.formatData(dayoffEditData);
    return (
      <Modal onClose={this.onClose.bind(this)}>
        <Modal.Header>
          {i18n['twapp.dayoffsetting.dayoffedit.title']}
        </Modal.Header>
        <Modal.Body>
          <DayoffEditForm
            initialValues={initialVal}
            symbolList={symbolList}
            onSubmit={this.onSubmit.bind(this)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave.bind(this)}>
            {i18n['general.save']}
          </Button>
          <Button onClick={this.onClose.bind(this)}>
            {i18n['general.cancel']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}