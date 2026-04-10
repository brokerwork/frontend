import cs from './index.less';
import { Icon, Button, Dialog, Form } from 'lean-ui';
import i18n from 'utils/i18n';
import ReportNameModal from '../ReportNameModal';
import UserRange from '../UserRange';

export default class ActionBar extends PureComponent {
  constructor(props) {
    super(props);
    const { reportType, onNameChange, reportName } = props;
    this.state = {
      showEditReportName: false,
      showUserRange: false,
      closeConfirm: false
    };
    if (!reportName) {
      const name = i18n[`report.custom_report.default_name.${reportType}`];
      onNameChange(name);
    }
  }
  componentWillUnmount() {
    const { onNameChange } = this.props;
    onNameChange('');
  }
  onClose = () => {
    this.setState({
      closeConfirm: true
    });
  };
  onCloseCancel = () => {
    const {
      history: { push }
    } = this.props;
    this.setState({
      closeConfirm: false
    });
    push('/settings/customReport');
  };
  onCloseConfirm = () => {
    const {
      history: { push },
      upsertReportData
    } = this.props;
    const submitData = this.generateData();
    upsertReportData(submitData).then(({ result }) => {
      if (result) {
        this.setState({
          closeConfirm: false
        });
        setTimeout(() => {
          push('/settings/customReport');
        }, 500);
      }
    });
  };
  generateData = () => {
    const {
      reportName,
      userRange,
      typeFieldsSelected,
      reportType,
      sortData,
      fieldsDetail
    } = this.props;
    const data = {
      reportType,
      reportName,
      ...userRange,
      ...sortData,
      fields: typeFieldsSelected
    };
    if (fieldsDetail.id) {
      data.id = fieldsDetail.id;
    }
    return data;
  };
  onSave = () => {
    const {
      showTipsModal,
      upsertReportData,
      showTopAlert,
      history: { push }
    } = this.props;
    const submitData = this.generateData();
    showTipsModal({
      title: i18n['report.custom_report.update_tip.title'],
      content: i18n['report.custom_report.update_tip.content'],
      onConfirm: cb => {
        upsertReportData(submitData).then(({ result }) => {
          if (result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.save_success']
            });
            setTimeout(() => {
              push('/settings/customReport');
            }, 3000);
          }
        });
        cb();
      }
    });
  };
  render() {
    const { showEditReportName, showUserRange, closeConfirm } = this.state;
    const {
      submitForm,
      onNameChange,
      onUserRangeChange,
      reportName,
      userRange,
      reportId,
      checkName
    } = this.props;
    return (
      <div className={cs['actions-bar']}>
        <div className={cs['left-part']}>
          <div className={cs['primary-top-title']}>
            <Icon
              icon="report"
              className={`main-color ${cs['customer-icon']}`}
              fontType={'bw'}
            />
            <div className={cs['module-info']}>
              {i18n['report.custom_report.title']}
            </div>
            <div className={cs['report-name']}>
              {reportName}
              <Button
                size="small"
                onClick={() =>
                  this.setState({
                    showEditReportName: true
                  })
                }
              >
                <Icon icon="edit-outline" />
                {i18n['general.edit']}
              </Button>
            </div>
          </div>
        </div>
        <div className={cs['right-part']}>
          <div className={cs['button-area']}>
            <Button
              onClick={() =>
                this.setState({
                  showUserRange: true
                })
              }
            >
              {i18n['report.custom_report.edit.user_range']}
            </Button>
            <Button onClick={this.onClose}>{i18n['general.close']}</Button>
            <Button onClick={this.onSave} type="primary">
              {i18n['general.save']}
            </Button>
          </div>
        </div>
        {showEditReportName ? (
          <ReportNameModal
            onNameChange={onNameChange}
            submitForm={submitForm}
            reportName={reportName}
            reportId={reportId}
            checkName={checkName}
            closeModal={() =>
              this.setState({
                showEditReportName: false
              })
            }
          />
        ) : null}
        {showUserRange ? (
          <UserRange
            userRange={userRange}
            onUserRangeChange={onUserRangeChange}
            submitForm={submitForm}
            closeModal={() =>
              this.setState({
                showUserRange: false
              })
            }
          />
        ) : null}
        {closeConfirm ? (
          <Dialog
            title={i18n['report.custom_report.close_tip.title']}
            visible
            onCancel={() =>
              this.setState({
                closeConfirm: false
              })
            }
            footer={
              <div>
                <Button
                  className={cs['onclose-cancel']}
                  onClick={() =>
                    this.setState({
                      closeConfirm: false
                    })
                  }
                >
                  {i18n['general.cancel']}
                </Button>
                <Button onClick={this.onCloseCancel}>
                  {i18n['report.custom_report.close_tip.cancel']}
                </Button>
                <Button type="primary" onClick={this.onCloseConfirm}>
                  {i18n['report.custom_report.close_tip.confirm']}
                </Button>
              </div>
            }
          >
            {i18n['report.custom_report.close_tip.content']}
          </Dialog>
        ) : null}
      </div>
    );
  }
}
