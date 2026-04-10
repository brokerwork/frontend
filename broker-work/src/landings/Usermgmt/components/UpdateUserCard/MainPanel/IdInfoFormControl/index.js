import { Tooltip, Input } from 'lean-ui';
import cs from './index.less';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';

const idNumComponent = (ref, otherProps) => {
  //TODO
  // const { touchFromField } = this.props;
  // 指定更新提示"身份证明“验证的显示
  // if ('isIdNumExist' in this.props.initialValues.externalData)
  //   setTimeout(() => {
  //     touchFromField(ACCOUNT_FORM_ID_INFO, 'idNum');
  //   }, 300);
  return {
    key: 'ID_NUM_COMPONENT',
    factory: (input, disabled, config) => {
      const { placeholder, maxLength } = config;
      return (
        <IdInfoFormControl
          //TODO
          // ref={input => (this.idNumRef = input)}
          //{...this.props}
          ref={ref}
          {...{ input, disabled, placeholder, maxLength }}
          {...otherProps}
        />
      );
    }
  };
};

export const injectExistIdNumWarning = (fields, ref, otherProps) => {
  // const { data: { t_account_id_info = [] } = {}, jobType } = this.props;
  const copyData = _.cloneDeep(fields);
  return copyData.map(item => {
    if (
      item.key === 'idNum'
      //TODO
      // && jobType === 'JOB_TYPE_TA_OPEN'
    ) {
      item.fieldType = 'ID_NUM_COMPONENT';
      item.component = idNumComponent(ref, otherProps);
    }
    return item;
  });
};

export default class IdInfoFormControl extends PureComponent {
  state = {
    existIdNumEntity: null
    // initSetTrue: false
  };
  // componentWillReceiveProps({
  //   initialValues: { externalData: { existIdNumEntity = null } = {} } = {}
  // }) {
  //   // 仅设置一次true，后续交给实时验证
  //   if (this.isIdNumExist(existIdNumEntity) && !this.state.initSetTrue) {
  //     this.setState({
  //       existIdNumEntity,
  //       initSetTrue: true
  //     });
  //   }
  // }
  onFormParamChange = ({ idNum, idTypeIs5, idType, excludeUserId } = {}) => {
    const { validateIdNum } = this.props;
    if (!validateIdNum) {
      return;
    }

    idTypeIs5
      ? validateIdNum(idNum, excludeUserId).then(res => {
          this.setState({
            existIdNumEntity: res.data
          });
        })
      : this.setState({
          existIdNumEntity: null
        });
  };

  isIdNumExist = existIdNumEntity => {
    if (!existIdNumEntity) {
      return false;
    }

    if (!Array.isArray(existIdNumEntity)) {
      return false;
    }

    if (existIdNumEntity.length === 0) {
      return false;
    }

    return true;
  };

  getExistIdNumHint = existIdNumEntity => {
    if (!this.isIdNumExist(existIdNumEntity)) {
      return;
    }

    return (
      <FormattedMessage
        id="task.warning.info_exist.details"
        defaultMessage={i18n['task.warning.info_exist.details']}
        values={{
          userName: existIdNumEntity[0].label,
          userNum: existIdNumEntity[0].entityNo
        }}
      />
    );
  };

  render() {
    const { input, disabled, placeholder, maxLength } = this.props;
    const { existIdNumEntity } = this.state;
    return (
      <div>
        <Input
          {...input}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          type="text"
          title={disabled ? input.value : ''}
        />
        {!disabled &&
          this.isIdNumExist(existIdNumEntity) && (
            <div>
              <span className={cs['warning-value']}>
                {i18n['task.warning.info_exist']}
              </span>
              <Tooltip
                autoAdjustOverflow={false}
                placement="right"
                trigger="click"
                title={this.getExistIdNumHint(existIdNumEntity)}
              >
                <i className={`${cs['error-icon']} fa fa-exclamation-circle`} />
              </Tooltip>
            </div>
          )}
      </div>
    );
  }
}
