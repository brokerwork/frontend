import i18n from 'utils/i18n';
import cs from './TimeList.less';
import Table from 'components/Table';
import Button from 'components/Button';
import SynchronizeModal from '../../containers/SynchronizeModal';
const dateInfo = {
  '1': i18n['twapp.trade_time_setting.monday'],
  '2': i18n['twapp.trade_time_setting.tuesday'],
  '3': i18n['twapp.trade_time_setting.wednesday'],
  '4': i18n['twapp.trade_time_setting.thursday'],
  '5': i18n['twapp.trade_time_setting.friday'],
  '6': i18n['twapp.trade_time_setting.saturday'],
  '7': i18n['twapp.trade_time_setting.sunday']
};

export default class TimeList extends PureComponent {
  state = {
    showSynchronizeModal: false
  }
  showModal = (toggle) => {
    this.setState({
      showSynchronizeModal: toggle
    });
  }

  saveTime = (data) => {

  }
  
  render() { 
    const {timeInfo, activeKey} = this.props;
    const {showSynchronizeModal} = this.state;
    return (
      <div>
        <Table>
          <Table.Header>
            <th>{i18n['twapp.trade_time_setting.day']}</th>
            <th>{i18n['twapp.trade_time_setting.time']}</th>
            <th>
              <Button style="primary" onClick={this.showModal.bind(this, true)}>{i18n[
                'general.edit'
              ]}</Button>
            </th>
          </Table.Header>
          <Table.Body>
            {timeInfo.hours && timeInfo.hours.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{dateInfo[item.date]}</td>
                  <td>{item.start}~{item.end}</td>
                  <td></td>
                </tr>
              );
            })}
          </Table.Body>
        </Table>
        {showSynchronizeModal
          ? <SynchronizeModal
              onClose={this.showModal.bind(this, false)}
              onSave={this.saveTime}
              activeKey={activeKey}
             />
          : undefined
        }
      </div>
    );
  }
}