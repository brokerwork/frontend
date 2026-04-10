import i18n from 'utils/i18n';
import cs from './IntervalForm.less';
import Table from 'components/Table';
import Button from 'components/Button';
import PaginationBar from 'components/PaginationBar';
import UpdateInterval from '../../containers/UpdateInterval';


export default class IntervalForm extends PureComponent {
  state = {
    showModal: false,
    serverData: undefined,
    pageNo: 1,
    pageSize: 10
  }
  showModal = (data, toggle) => {
    this.setState({
      showModal: toggle,
      serverData: toggle ? data : undefined
    });
  }
  onPageChange = ({ pageNo, pageSize }) => {
    this.setState({
      pageNo,
      pageSize
    }, () => {
      this.getServerInfo();
    });
  }
  getServerInfo = () => {
    const {pageNo, pageSize} = this.state;
    const {activeKey, getServerInfo} = this.props;
    getServerInfo(activeKey, pageNo, pageSize);
  }
  onSaveServer = (data) => {
    const {activeKey, updateSingleIntervalInfo, showTopAlert, getServerInfo} = this.props;
    const {pageNo, pageSize} = this.state;
    updateSingleIntervalInfo(activeKey, data.originSymbol, data.period|| '').then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        this.setState({
          showModal: false
        });
        getServerInfo(activeKey, pageNo, pageSize);
      }
    });
  }
  render() { 
    const {serverData, showModal} = this.state;
    const {activeKey, serverInfo, defaultedInterval } = this.props;  
    return (
      <div>
        <Table>
          <Table.Header>
            <th>{i18n['twapp.variety_setting.platform']}</th>
            <th>{i18n['twapp.quotationinterval.interval']}</th>
            <th>{i18n['twapp.variety_setting.aciton']}</th>
          </Table.Header>
          <Table.Body>
          {serverInfo.list && serverInfo.list.map((server, idx) => {
            return (
              <tr key={idx}>
                <td>
                  {server.originSymbol}
                </td>
                <td>
                  {server.period || defaultedInterval}
                </td>
                <td>
                  <Button style="primary" icon onClick={this.showModal.bind(this, server, true)}>
                    <i className="fa fa-pencil"></i>
                  </Button>
                </td>
              </tr>
            );
          })} 
          </Table.Body>
        </Table>
        {showModal
          ? <UpdateInterval
            data={serverData}
            activeKey={activeKey}
            onSave={this.onSaveServer}
            onClose={this.showModal.bind(this, undefined, false)}
          />
          : undefined}
          <PaginationBar
          onPageChange={this.onPageChange}
          total={serverInfo.total}
          pageSize={serverInfo.size}
          pageNo={serverInfo.pager}
        ></PaginationBar>
      </div>
    );
  }
}