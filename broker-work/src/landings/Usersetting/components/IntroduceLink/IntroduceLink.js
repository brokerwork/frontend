import cs from './IntroduceLink.less';
import i18n from 'utils/i18n';
import CopyToClipboard from 'react-copy-to-clipboard';
import NoDataView from 'components/v2/NoDataView';
import { Table, Button, Popover } from 'lean-ui';
import selectText from 'utils/selectInputValue';
export default class IntroduceLink extends PureComponent {
  constructor(props) {
    super(props);
    props.getIntroduceLink();
  }
  onCopy = () => {
    const { showTopAlert } = this.props;

    showTopAlert({
      bsStyle: 'success',
      content: i18n['general.clip_success']
    });
  };

  getQrcode = item => {
    const { getMyLinkQrcode } = this.props;

    getMyLinkQrcode(item.id);
  };
  selectText = (e) => {
    const dom = e.target
    selectText(dom)
  }
  columns = [
    {
      name: i18n['runmgmt.app_content.column.banner.name'],
      dataIndex: 'name',
      key: 'name'
    },
    {
      name: i18n['navigation.user_tools.user_introducelink'],
      dataIndex: 'displayUrl',
      key: 'displayUrl'
    },
    {
      name: i18n['customer.bill.invoice.action'],
      dataIndex: 'operate',
      key: 'operate'
    }
  ];
  renderCell = ({ key, data, index, rowData }) => {
    const { myLinkQrcode } = this.props;
    const Td = Table.Td;
    if (key === 'operate') {
      const popover = (
        <div id={rowData.id} className={cs['qrcode-box']}>
          <img src={myLinkQrcode} className={cs['qrcode']} />
          <div>
            <a
              href={myLinkQrcode}
              download
              className={`lean-btn lean-btn-primary ${cs['downloadBtn']}`}
            >
              {i18n['settings.link_setting.download_qrcode']}
            </a>
          </div>
        </div>
      );
      return (
        <Td key={index}>
          <Popover
            content={popover}
            trigger="click"
            onVisibleChange={visible => {
              if (visible) {
                this.getQrcode(rowData);
              }
            }}
          >
            <i className={`fa fa-qrcode main-color ${cs['icon']}`} />
          </Popover>
          <CopyToClipboard text={rowData.displayUrl} onCopy={this.onCopy}>
            <i className={`fa fa-copy main-color ${cs['icon']}`} />
          </CopyToClipboard>
        </Td>
      );
    } else if (key === 'displayUrl') {
      return (
        <Td key={index}>
          <a href={data} target="_blank">
            <textarea style={{border: 0, padding: 10, width: '100%',resize: 'vertical'}} onClick={this.selectText} type="text" value={data}/>
          </a>
        </Td>
      );
    }
    return <Td key={index}>{data}</Td>;
  };
  render() {
    const { introduceLink, myLinkQrcode } = this.props;
    return (
      <div className={cs['container']}>
        <div className={cs['title']}>{i18n['introduce.link_modal_title']}</div>
        <Table
          columns={this.columns}
          data={introduceLink}
          renderCell={this.renderCell}
        />
        {introduceLink.length === 0 ? <NoDataView /> : undefined}
      </div>
    );
  }
}
