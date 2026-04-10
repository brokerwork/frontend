import { Table, Icon, Popover } from 'lean-ui';
import PaginationBar from 'components/v2/PaginationBar';
import ResendEmailModal from '../../../../components/ResendEmailModal';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import cs from './List.less';

const TTd = Table.Td;

export default class Logs extends PureComponent {
  modifyPagination = ({ pageNo, pageSize }) => {
    const { modifyParams, params } = this.props;
    const __obj = {
      pageSize,
      page: pageSize === params.pageSize ? pageNo : 1
    };
    modifyParams({
      ...params,
      ...__obj
    });
  };

  componentDidMount() {
    const { getEmailList } = this.props;
    getEmailList();
  }

  state = {
    resendEmailData: null,
    showResendEmailModal: false
  };

  modifyresendEmailData = id => {
    const { resendEmailData } = this.state;
    this.setState({
      resendEmailData: {
        ...resendEmailData,
        value: id
      }
    });
  };

  cancelRsendEmail = () => {
    this.setState({
      resendEmailData: null,
      showResendEmailModal: false
    });
  };

  resendEmail = () => {
    const {
      resendEmailData: { value, objectId }
    } = this.state;
    const { resendEmail, showTopAlert } = this.props;
    resendEmail(objectId, value).then(res => {
      if (!res.result) {
        return Promise.resolve(res);
      }
      showTopAlert({
        content: i18n['setting.log.message.resend_success'],
        bsStyle: 'success'
      });
      this.cancelRsendEmail();
    });
  };

  displayResendEmailModal({ objectId, configId, status }) {
    this.setState({
      showResendEmailModal: true,
      resendEmailData: { value: configId, status, objectId }
    });
  }

  renderCell = ({ key, data, index }) => {
    return <TTd key={index}>{data}</TTd>;
  };

  render() {
    const {
      paginationInfo,
      params: { type },
      emails
    } = this.props;
    const { resendEmailData, showResendEmailModal } = this.state;
    let data = [];
    this.props.data &&
      this.props.data.forEach((item, index) => {
        const addOnText = `${
          !!item.error
            ? `${i18n['setting.log.fail_reason']}: ${item.error} ${item.addOn}`
            : item.addOn || ''
        }`;
        data.push({
          key1: item.userName ? (
            <FormattedMessage
              id="setting.log.system_sms"
              defaultMessage={item.userName}
              values={{
                from_name_sys_sms: i18n['setting.log.system_sms']
              }}
            />
          ) : (
            ''
          ),
          key2: item.operationTime,
          key3: i18n['setting.operation.log.' + item.type],
          key4: item.objectName,
          key5: item.toUserName,
          key6:
            type === 'MAIL' ? (
              <div
                className={cs['addOn-box']}
                title={`${item.error || ''}; ${item.addOn || ''}`}
              >
                <div
                  className={`${cs['addOn-text']} ${
                    item.error ? cs['error'] : ''
                  }`}
                  title={addOnText}
                >
                  {addOnText}
                </div>
                {item.retryTime * 1 > 0 ? (
                  <Popover
                    placement="topLeft"
                    content={
                      <FormattedMessage
                        id="setting.log.message.resend_times"
                        defaultMessage={
                          i18n['setting.log.message.resend_times']
                        }
                        values={{
                          value: item.retryTime
                        }}
                      />
                    }
                  >
                    <a
                      href="javascript:;"
                      onClick={this.displayResendEmailModal.bind(this, item)}
                      className={cs['resend-button']}
                    >
                      {i18n['setting.log.message.resend']}

                      <Icon icon="logs" fontType="bw" className={cs['icon']} />
                    </a>
                  </Popover>
                ) : (
                  <a
                    href="javascript:;"
                    onClick={this.displayResendEmailModal.bind(this, item)}
                    className={cs['resend-button']}
                  >
                    {i18n['setting.log.message.resend']}

                    <Icon icon="logs" fontType="bw" className={cs['icon']} />
                  </a>
                )}
              </div>
            ) : (
              undefined
            )
        });
      });
    const columns = [
      { key: 'key1', name: i18n['setting.log.operator'] },
      { key: 'key2', name: i18n['setting.log.time'] },
      { key: 'key3', name: i18n['setting.log.opType'] },
      { key: 'key4', name: i18n['setting.log.message_title'] },
      {
        key: 'key5',
        name:
          type === 'MAIL'
            ? i18n['setting.log.recipient_email']
            : i18n['setting.log.recipient_name']
      },
      {
        key: 'key6',
        name: type === 'MAIL' ? i18n['setting.log.extraInfo'] : undefined
      }
    ];
    return (
      <div className={cs.wrapper}>
        <div className={cs.r1}>
          <div className={cs.r2}>
            <Table
              fixedHeader
              data={data}
              columns={columns}
              renderCell={this.renderCell}
            />
          </div>
        </div>
        <PaginationBar
          {...paginationInfo}
          onPageChange={this.modifyPagination}
        />
        {showResendEmailModal && (
          <ResendEmailModal
            data={emails}
            onChange={this.modifyresendEmailData}
            onHide={this.cancelRsendEmail}
            onSubmit={this.resendEmail}
            {...resendEmailData}
          />
        )}
      </div>
    );
  }
}
