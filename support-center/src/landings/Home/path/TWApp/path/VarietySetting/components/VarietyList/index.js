import i18n from 'utils/i18n';
import cs from './VarietyList.less';
import Table from 'components/Table';
import Button from 'components/Button';
import UpdateVariety from '../../containers/UpdateVariety.js';
import PaginationBar from 'components/PaginationBar';
import { FormattedMessage } from 'react-intl';
import Tips from 'components/Tips';


export default class VarietyList extends PureComponent {
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

  onSaveServer = (data) => {

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
  render() { 
    const {showModal, serverData} = this.state;
    const {activeKey, serverInfo} = this.props;   
    return (
      <div>
        <Table className={cs['variety-table']}>
          <Table.Header>
            <th>{i18n['twapp.variety_setting.platform']}</th>
            <th>{i18n['twapp.variety_setting.name']}</th>
            <th>{i18n['twapp.variety_setting.code']}</th>
            <th>{i18n['twapp.variety_setting.type']}</th>
            <th>{i18n['twapp.variety_setting.comment']}</th>
            <th>{i18n['twapp.variety_setting.aciton']}</th>
          </Table.Header>
          <Table.Body>
          {serverInfo.list && serverInfo.list.map((server, idx) => {
            const varietyList = server.profitMode === 0 
                                  ? server.advises 
                                    ? <div className={cs['error-mode']}>
                                        <FormattedMessage
                                          id="twapp.variety_setting.type_undefined"
                                          defaultMessage={i18n['twapp.variety_setting.type_undefined']}
                                          values={{ varietyList: server.advises.join(i18n['twapp.variety_setting.or']) }}
                                        />
                                      </div>
                                    : '' 
                                  :  server.profitMode === 1 ? undefined : <span className={cs['error-mode']}>{i18n['twapp.variety_setting.type_error']}</span>;
            return (
              <tr key={idx}>
                <td>
                  {server.originSymbol}
                </td>
                <td>
                  {server.symbolName}
                </td>
                <td>
                  {server.symbol}
                </td>
                <td>
                  {server.profitMode === 0 
                    ? <span className={cs[`${server.advises ? 'error-mode' : '' }`]}>{i18n['twapp.variety_setting.foreign_currency']}</span>
                    : server.profitMode === 1 ? 'CFD' : <span className={cs['error-mode']}>{i18n['twapp.variety_setting.other']}</span>
                  }
                </td>
                <td className='free-hidden-td'>
                   <div className={cs['variety-error-td']}>{varietyList}</div>
                   { server.profitMode === 0 && server.advises 
                      ? <Tips>
                          {varietyList}
                        </Tips>
                      : undefined }
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
          ? <UpdateVariety
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