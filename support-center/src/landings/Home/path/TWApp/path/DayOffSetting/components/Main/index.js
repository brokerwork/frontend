import i18n from 'utils/i18n';
import Tab from 'components/Tab';
import Table from 'components/Table';
import Button from 'components/Button';
import AnimationWrapper from 'components/AnimationWrapper';
import PaginationBar from 'components/PaginationBar';
import DayoffEdit from '../../containers/DayoffEdit';
import { FormattedMessage } from 'react-intl';

import cs from './style.less';

export default class Root extends Component {
  onChange(key) {
    const {
      serverChange,
      getServerDayOffList,
      serverDayOffList,
      getSymbolList
    } = this.props;
    serverChange(key);
    getServerDayOffList({
      serverId: key,
      page: serverDayOffList.pager,
      pageSize: serverDayOffList.size
    });
    getSymbolList(key);
  }
  componentDidMount() {
    const {
      getServer,
      getServerDayOffList,
      serverDayOffList,
      getSymbolList
    } = this.props;
    getServer().then(res => {
      const serverId = res.data[0].serverId;
      getServerDayOffList({
        serverId: serverId,
        page: serverDayOffList.page,
        pageSize: serverDayOffList.pageSize
      });
      getSymbolList(serverId);
    });
  }
  settingOption(type) {
    const { activeServerId, syncSetting, showAddDayoff, showTopAlert, showTipsModal, closeTipsModal } = this.props;
    if (type === 'sync') {
      showTipsModal({
        content: i18n['twapp.dayoffsetting.sync.ask'],
        onConfirm: () => {
          syncSetting(activeServerId).then(res => {
            if (res.result) {
              showTopAlert({
                style: 'success',
                content: i18n['twapp.dayoffsetting.sync.success']
              });
            } else {
              showTopAlert({
                content: i18n['twapp.dayoffsetting.sync.false']
              });
            }
            closeTipsModal();
          });
        }
      });
      return;
    }
    if (type === 'add') {
      showAddDayoff();
    }
  }
  dayoffOption(type, dayoff) {
    if (type === 'edit') {
      const { showEditDayoff } = this.props;
      showEditDayoff(dayoff);
      return;
    }
    if (type === 'enable') {
      const { enableDayoff, disableDayoff, showTipsModal, closeTipsModal } = this.props;
      if (dayoff.enabled) {
        showTipsModal({
          content: i18n['twapp.dayoffsetting.dayoff.disable'],
          onConfirm: () => {
            disableDayoff(dayoff.id).then(() => closeTipsModal());
          }
        });
      } else {
        showTipsModal({
          content: i18n['twapp.dayoffsetting.dayoff.enable'],
          onConfirm: () => {
            enableDayoff(dayoff.id).then(() => closeTipsModal());
          }
        });
      }
      return;
    }
  }
  onPageChange(data) {
    const { activeServerId, getServerDayOffList } = this.props;
    getServerDayOffList({
      serverId: activeServerId,
      page: data.pageNo,
      pageSize: data.pageSize
    });
  }
  render() {
    const { server, activeServerId, serverDayOffList, addDayoff } = this.props;
    const timezoneItem = server && server.find((item) => item.serverId === activeServerId);
    const realTimezone = timezoneItem && timezoneItem.timezone !== undefined ? timezoneItem.timezone : i18n['twapp.trade_time_setting.timezone_undefined'];
    return (
      <div className={cs['day-off']}>
        <header>
          <div className={cs['setting-options']}>
            <Button style="primary" onClick={this.settingOption.bind(this, 'sync')}>{i18n['twapp.dayoffsetting.syncsetting']}</Button>
            <Button style="primary" className={cs['setting-options-add']} onClick={this.settingOption.bind(this, 'add')}>{i18n['twapp.dayoffsetting.addsetting']}</Button>
          </div>
        {
          server.length ? (
          <Tab activeKey={activeServerId} onChange={this.onChange.bind(this)}>
          {
            server.map(val => {
              return (
                <Tab.Panel key={val.serverId} title={`${val.type === 'real' ? i18n['menu.twapp.vendor_setting.real'] : i18n['menu.twapp.vendor_setting.simulator']}${val.vendor}-${val.serverId}`} eventKey={val.serverId} />
              );
            })
          }
          </Tab>): null
        }
        </header>
        {server
          ? <div className={cs['warning']}>
              <FormattedMessage
                id="timezone"
                defaultMessage={i18n['twapp.trade_time_setting.timezone']}
                values={{timezone: `${realTimezone}`}}
                /> 
            </div>
          : undefined
        }
        <Table>
          <Table.Header>
            <th>{i18n['twapp.dayoffsetting.table.id']}</th>
            <th>{i18n['twapp.dayoffsetting.table.name']}</th>
            <th>{i18n['twapp.dayoffsetting.table.date']}</th>
            <th>{i18n['twapp.dayoffsetting.table.time']}</th>
            <th>{i18n['twapp.dayoffsetting.table.symbols']}</th>
            <th>{i18n['twapp.dayoffsetting.table.enabled']}</th>
            <th>{i18n['twapp.dayoffsetting.table.yearRepeat']}</th>
            <th>{i18n['twapp.dayoffsetting.table.options']}</th>
          </Table.Header>
          <Table.Body>
            {
              serverDayOffList.list && serverDayOffList.list.length ? serverDayOffList.list.map(dayoff => {
                return (
                  <tr key={dayoff.id}>
                    <td>{dayoff.id}</td>
                    <td>{dayoff.name}</td>
                    <td>{dayoff.date}</td>
                    <td>{dayoff.start}-{dayoff.end}</td>
                    <td>
                      {
                        dayoff.symbols.map((syb, index) => {
                          return <test key={syb}>{syb}{index + 1 < dayoff.symbols.length ? '; ' : null}</test>;
                        })
                      }
                    </td>
                    <td>{dayoff.enabled ? i18n['twapp.dayoffsetting.table.state.work'] : i18n['twapp.dayoffsetting.table.state.freez']}</td>
                    <td>{dayoff.yearRepeat ? i18n['twapp.dayoffsetting.table.yearRepeat.true'] : i18n['twapp.dayoffsetting.table.yearRepeat.false']}</td>
                    <td>
                      <Button style="primary" onClick={this.dayoffOption.bind(this, 'edit', dayoff)}>{i18n['general.edit']}</Button>
                      <Button style="primary" onClick={this.dayoffOption.bind(this, 'enable', dayoff)}>{dayoff.enabled ? i18n['twapp.dayoffsetting.table.button.freez'] : i18n['twapp.dayoffsetting.table.button.start']}</Button>
                    </td>
                  </tr>
                );
              }) : null
            }
          </Table.Body>
        </Table>
        <PaginationBar
          onPageChange={data => this.onPageChange(data)}
          total={serverDayOffList.total}
          pageSize={serverDayOffList.size}
          pageNo={serverDayOffList.pager}
        />
        <AnimationWrapper>
          {addDayoff
            ? <DayoffEdit />
            : null}
        </AnimationWrapper>
      </div>
    );
  }
}