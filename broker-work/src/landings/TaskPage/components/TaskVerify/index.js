import {
  VerifyButton,
  VERIFY_TYPE_KEY_MAP,
  getVerifyData,
  getVerifyResult
} from 'components/v2/VerifyIdButton';
import cs from './index.less';
export const JOB_TYPES_NEED_VERIFY = [
  'JOB_TYPE_TA_OPEN',
  'JOB_TYPE_TA_WITHDRAW',
  'JOB_TYPE_AGENCY_WITHDRAW',
  'JOB_TYPE_AGENCY_REGISTER'
];
export default class TaskVerify extends PureComponent {
  componentDidMount() {
    this.getExternalVerifyInfo(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { taskInitialValues: nextTaskInitialValues = {} } = nextProps;
    const { taskInitialValues = {} } = this.props;
    if (!taskInitialValues.customerId && nextTaskInitialValues.customerId) {
      this.getExternalVerifyInfo(nextProps);
    } else if (
      !(
        taskInitialValues.applicationData &&
        taskInitialValues.applicationData.bankAccountName
      ) &&
      nextTaskInitialValues.applicationData &&
      nextTaskInitialValues.applicationData.bankAccountName
    ) {
      this.getExternalVerifyInfo(nextProps);
    }
  }
  getExternalVerifyInfo = props => {
    const {
      taskData,
      taskFields,
      taskData: { checkState, creator: { key: userId } = {} }
    } = props;
    if ('JOB_TYPE_TA_OPEN' === taskData.jobType) {
      const { taskInitialValues = {}, getExternalFormData } = props;
      const { customerId } = taskInitialValues;
      if (customerId && !checkState) {
        getExternalFormData([
          {
            key: 'ownerInfo',
            value: customerId,
            fieldName: 'ownerInfo'
          }
        ]);
      }
    } else if ('JOB_TYPE_TA_WITHDRAW' === taskData.jobType) {
      const {
        taskInitialValues: {
          applicationData: { bankAccountName, bankAccountNumber } = {}
        } = {},
        getExternalFormData
      } = props;
      if (bankAccountName && bankAccountNumber && !checkState) {
        getExternalFormData([
          {
            key: 'withdrawVerifyInfo',
            value: {
              name: bankAccountName,
              number: bankAccountNumber,
              userId
            },
            fieldName: 'withdrawVerifyInfo'
          }
        ]);
      }
    }
  };
  getVerifyData = () => {
    const { taskData, taskFields } = this.props;
    if ('JOB_TYPE_TA_OPEN' === taskData.jobType) {
      const { taskInitialValues = {} } = this.props;
      return getVerifyData(taskInitialValues, taskFields, [
        'step1',
        'step2',
        'step3'
      ]);
    }
    if ('JOB_TYPE_TA_WITHDRAW' === taskData.jobType) {
      const {
        taskInitialValues: {
          applicationData: { bankAccountName, bankAccountNumber } = {}
        } = {}
      } = this.props;
      return {
        name: bankAccountName,
        accountNo: bankAccountNumber
      };
    }
    if ('JOB_TYPE_AGENCY_WITHDRAW' === taskData.jobType) {
      const {
        taskInitialValues: { bankAccountName, bankAccountNumber } = {}
      } = this.props;
      return {
        name: bankAccountName,
        accountNo: bankAccountNumber
      };
    }
    if ('JOB_TYPE_AGENCY_REGISTER' === taskData.jobType) {
      const { taskInitialValues = {} } = this.props;
      // 身份证的 id 是 5
      const idNum =
        taskInitialValues.idType === '5' ? taskInitialValues.idNum : undefined;
      return {
        name: taskInitialValues.name,
        idNum
      };
    }
  };
  onSubmit = data => {
    const { verifyIdentity, taskData } = this.props;
    verifyIdentity(taskData.jobId, data);
  };
  formatCheckState = () => {
    const {
      taskData,
      taskData: { checkState },
      taskInitialValues: {
        externalData: { ownerInfo, withdrawVerifyInfo } = {}
      } = {}
    } = this.props;
    console.log('taskData', taskData);
    if (!checkState && ownerInfo && 'JOB_TYPE_TA_OPEN' === taskData.jobType) {
      return getVerifyResult(ownerInfo);
    } else if (
      !checkState &&
      withdrawVerifyInfo &&
      'checkState' in withdrawVerifyInfo &&
      'JOB_TYPE_TA_WITHDRAW' === taskData.jobType
    ) {
      return {
        accountNo: withdrawVerifyInfo
      };
    } else {
      return Object.keys(checkState || {}).reduce((obj, key) => {
        obj[VERIFY_TYPE_KEY_MAP[key]] = checkState[key];
        return obj;
      }, {});
    }
  };
  render() {
    const { taskData } = this.props;
    const verifyData = this.getVerifyData();
    if (!JOB_TYPES_NEED_VERIFY.includes(taskData.jobType)) {
      return <div />;
    }
    return (
      <VerifyButton
        fields={this.props.taskFields}
        buttonClassName={cs['button']}
        verifyData={verifyData}
        verifyResult={this.formatCheckState()}
        onSubmit={this.onSubmit}
      />
    );
  }
}
