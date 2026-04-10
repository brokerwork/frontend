import { reduxForm } from 'redux-form';
import CustomField, { validate } from 'components/CustomField';
import i18n from 'utils/i18n';
import { deepCopy } from 'utils/simpleDeepCopy';
import { FormattedMessage } from 'react-intl';
import { changeDefaultApproverInfo } from '../../../controls/actions';
import { getDefaultApprover } from '../../../defaultApprover';

export const APPROVE_FORM = 'APPROVE_FORM';

let deptFlag;

const AForm = reduxForm({
  form: APPROVE_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: function(values, props) {
    const errors = validate(values, props);

    const customErrors = {};

    const { approver1, approver2, approver3 } = values;

    if (!approver1 && !approver2 && !approver3) {
      customErrors['approver1'] = i18n['customer.approve.error.no_approver'];
    }

    return Object.assign({}, errors, customErrors);
  },
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  onChange: function(values, dispatch, props) {
    const { auditType, dept, deployType } = values;
    if (dept !== deptFlag) {
      //选择的部门发生了变化，填充不同的默认审批人
      const { changeDefaultApproverInfo } = props;
      changeDefaultApproverInfo(
        getDefaultApprover(auditType, dept, deployType)
      );

      deptFlag = dept;
    }
  }
})(({ fields, disabled }) => {
  return <CustomField disabled={disabled} fields={fields} />;
});

export default class ApproveForm extends Component {
  componentWillUnmount() {
    const { changeDefaultApproverInfo } = this.props;
    changeDefaultApproverInfo({}); //清空state中的默认审批人信息
    deptFlag = undefined;
  }

  onSubmitFail = data => {
    const { onFail } = this.props;
    if (onFail) onFail(data);
  };

  onSubmit = data => {
    const result = {
      customerId: data.customerId,
      auditType: data.auditType,
      deptId: data.deptId
    };

    switch (data.auditType) {
      case 'CONTRACTS':
        result.submitId = data.contractsId;
        break;
      case 'DEPLOY':
        result.submitId = data.deployId;
        break;
      case 'REFUND':
        result.submitId = data.refundId;
        break;
    }

    let approvers = [];
    for (let i = 1; i < 6; i++) {
      const approver = data[`approver${i}`];
      if (approver) {
        approvers.push(approver);
      }
    }

    result.approvers = approvers;

    if (!!data.cclist) {
      result.cclist = data.cclist.split(',');
    }

    return result;
  };

  onSubmitSuccess = data => {
    const { onSave } = this.props;
    if (onSave) onSave(data);
  };
  render() {
    const {
      getProductList,
      productList,
      approveFields = [],
      initialValues,
      disabled,
      approverInfo,
      changeDefaultApproverInfo
    } = this.props;

    return (
      <AForm
        fields={approveFields}
        disabled={disabled}
        onSubmitFail={this.onSubmitFail}
        onSubmitSuccess={this.onSubmitSuccess}
        onSubmit={this.onSubmit}
        initialValues={{ ...initialValues, ...approverInfo }}
        // initialValues={{ approver1: 'bo', cclist: '1,2,3,4' }}
        changeDefaultApproverInfo={changeDefaultApproverInfo}
      />
    );
  }
}
