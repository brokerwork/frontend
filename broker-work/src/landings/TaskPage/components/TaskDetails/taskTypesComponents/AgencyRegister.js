import cs from '../TaskDetails.less';
import i18n from 'utils/i18n';
import { get, post } from 'utils/ajax';
import UserInfoForm from '../../../../Usermgmt/containers/UpdateUserPanel';

export const ACCOUNT_FORM_USER_AGENT = 'ACCOUNT_FORM_USER_AGENT';
export const AGENCT_FORM_ACCOUNT_INFO = 'AGENCT_FORM_ACCOUNT_INFO';
let serverId = null;
let vendor = null;

export default class AgencyRegister extends PureComponent {
  constructor(props) {
    super(props);
    const {
      initialValues: {
        messageCode,
        openMessageCode,
        bindMessageCode,
        email
      } = {}
    } = props;
    const isUserCreated = !messageCode && (openMessageCode || bindMessageCode);
    /* 
    存在错误，但不是新建用户错误，说明用户已经创建成功。
    messageCode 新建用户错误
    openMessageCode 新建账户错误
    bindMessageCode 绑定账户错误
     */
    this.state = {
      readyShowInfo: false,
      showPassword: false,
      userFormData: {},
      login: {},
      password: '',
      lastEmail: email,
      vendor: '',
      duplicateEmail: undefined, //undefined 请求前， false 不需要提示， true 提示
      isUserCreated: isUserCreated
    };
    this.submitData = {};
  }
  examEmail = email => {
    const { toggleTaskEnabled } = this.props;
    toggleTaskEnabled(false);
    post({
      url: '/v1/user/exists',
      data: {
        key: 'email',
        value: email
      }
    }).then(({ result, data }) => {
      this.setState(
        {
          duplicateEmail: !!data
        },
        this.updateButton
      );
    });
  };
  updateButton = () => {
    const { toggleTaskEnabled } = this.props;
    const { duplicateEmail, isUserCreated } = this.state;
    toggleTaskEnabled(!duplicateEmail || isUserCreated);
  };
  componentDidMount() {
    const {
      initialValues,
      getSettingInfo,
      data: { itemId, categoryId }
    } = this.props;
    getSettingInfo(itemId, categoryId);
    this.examEmail(initialValues.email);
  }
  onSubmit = data => {
    const { onSubmit } = this.props;
    if (data.account && !data.account.enableChangePassword) {
      data.account.enableChangePassword = '1';
    }
    if (!data.enableChangePassword) {
      data.enableChangePassword = '1';
    }
    onSubmit(data);
  };
  onServerChange = data => {
    const { vendor } = data;
    this.setState({
      vendor
    });
  };
  render() {
    const {
      initialValues,
      disabled,
      fields,
      formColumns,
      settingInfo,
      data: { state: taskState } = {}
    } = this.props;
    if (initialValues.parent === undefined) {
      //没有上级用户时使用uid
      initialValues.parent = initialValues.uid;
    }
    const { duplicateEmail, vendor, isUserCreated } = this.state;
    initialValues.sendEmail = true;
    const settingDefault = vendor ? settingInfo[vendor] : {};
    // 代理注册账户信息的登录状态和交易状态使用字段配置默认值
    const defaultKeyArr = ['readOnly', 'enable'];
    defaultKeyArr.forEach(el => {
      const val = this.props.formFields.t_account_account.find(
        field => field.key === el
      ).defaultValue;
      if (initialValues[el] === -1) {
        initialValues[el] = val;
      }
    });

    const initialValuesWithSettingDefault = {
      ...initialValues,
      ...settingDefault
    };

    const isClosed = ['Rejected', 'Finished', 'Closed'].includes(taskState); //已经完成的任务
    return (
      <div>
        {isClosed ? (
          undefined
        ) : isUserCreated ? (
          <div data-test="create-tip" className={cs['agencyRegisterTips']}>
            <span className={cs['notice-text']}>
              *{i18n['task.task_details.user_create_tips']}
            </span>
          </div>
        ) : duplicateEmail ? (
          <div data-test="dumpemail-tip" className={cs['agencyRegisterTips']}>
            ＊{i18n['task.taks_details.emaill_agent_tips']}
          </div>
        ) : (
          undefined
        )}
        <UserInfoForm // fields={basicFields}
          // fieldGenerator={fieldGenerator}
          // onSubmit={this.submit.bind(this, 'basic')}
          // onSubmitSuccess={this.submitSuccess.bind(this, 'basic')}
          editUserInfo={initialValuesWithSettingDefault}
          // onChange={this.onUserFormChange}
          userDisabled={isUserCreated}
          type="add"
          disabled={disabled}
          onServerChange={this.onServerChange}
          isTask
          onSubmitUserInfo={this.onSubmit}
        />
      </div>
    );
  }
}
