import { Table } from 'lean-ui';
import PaginationBar from 'components/v2/PaginationBar';
import i18n from 'utils/i18n';
import cs from './List.less';

const TTd = Table.Td;

export default class Logs extends PureComponent {
  modifyPagination = ({ pageNo, pageSize }) => {
    const { modifyParams, params } = this.props;
    const __obj = {
      pageSize,
      page: pageSize == params.pageSize ? pageNo : 1
    };
    modifyParams({
      ...params,
      ...__obj
    });
  };

  renderCell = ({ key, data, index }) => {
    return <TTd key={index}>{data}</TTd>;
  };

  render() {
    const { paginationInfo } = this.props;
    let data = [];
    this.props.data &&
      this.props.data.forEach((item, index) => {
        data.push({
          key1: item.userName,
          key2: item.operationTime,
          key3: item.clientIp,
          key4: i18n['setting.operation.log.' + item.event],
          key5: i18n['setting.operation.log.' + item.type],
          key6: item.objectId,
          key7: item.objectName,
          key8: (
            <div className={cs['addOnText']} title={item.addOn}>
              {item.addOn}
            </div>
          )
        });
      });
    const columns = [
      { key: 'key1', name: i18n['setting.log.operator'] },
      { key: 'key2', name: i18n['setting.log.time'] },
      { key: 'key3', name: i18n['setting.log.ip'] },
      { key: 'key4', name: i18n['setting.log.opType'] },
      { key: 'key5', name: i18n['setting.log.opObj'] },
      { key: 'key6', name: i18n['setting.log.objId'] },
      { key: 'key7', name: i18n['setting.log.opName'] },
      { key: 'key8', name: i18n['setting.log.extraInfo'] }
    ];
    return (
      <div className={cs.wrapper}>
        <div className={cs.r1}>
          <div className={cs.r2}>
            <Table
              data={data}
              fixedHeader
              columns={columns}
              renderCell={this.renderCell}
            />
          </div>
        </div>
        <PaginationBar
          {...paginationInfo}
          onPageChange={this.modifyPagination}
        />
      </div>
    );
  }
}
