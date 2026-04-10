import ReakRule from './ReakRule';
import RuleDetailModal from './RuleDetailModal';
import i18n from 'utils/i18n';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { get } from 'utils/ajax';
export const USER_FORM_REAK_RULE = 'USER_FORM_REAK_RULE';
import { isPositiveNumber } from 'utils/validate';

const ReakRuleForm = reduxForm({
  form: USER_FORM_REAK_RULE,
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
  enableReinitialize: true,
  shouldValidate({ values = {}, nextProps, props }) {
    return true;
  },
  shouldAsyncValidate({ trigger }) {
    switch (trigger) {
      case 'blur':
        // blurring
        return false;
      case 'submit':
        // submitting, so only async validate if form is dirty or was never initialized
        // conversely, DON'T async validate if the form is pristine just as it was
        // initialized
        return true;
      default:
        return true;
    }
  },
  asyncValidate: (values = {}, dispatch, props) => {
    if (!values.levelId) return Promise.resolve({});
    //有上级但是没有层级
    const errors = {};
    const { parent } = values;
    if (
      props.brandInfo.mode !== 'DISTRIBUTION' &&
      props.isTask &&
      parent &&
      parent !== 'null'
    ) {
      return get({
        url: `/v1/user/task/${parent}/simple`
      }).then(({ result, data }) => {
        const { levelList } = props;
        const matched = levelList.find(
          item => `${item.value}` === `${data.levelId}`
        );
        const matchedLevel = levelList.find(
          item => `${item.value}` === `${values.levelId}`
        );
        if (!matched) {
          errors['parent'] = i18n['usermgmt.usercard.parent_needs_level'];
          throw errors;
          return;
        } else if (matched && matchedLevel) {
          if (Number(matched.sid) >= Number(matchedLevel.sid)) {
            errors['levelId'] =
              i18n['usermgmt.usercard.level_parent_not_match'];
            throw errors;
            return;
          }
        }
      });
    } else {
      return Promise.resolve({});
    }
  },
  asyncBlurFields: ['levelId', 'parent'],
  validate: function(values, props) {
    const errors = {};
    const { upwardForm } = props;
    if (
      values.parent &&
      values.parent !== 'null' &&
      (!values.levelId || values.levelId === 'null')
    ) {
      errors['levelId'] = i18n['usermgmt.usercard.level_required_with_parent'];
    }
    upwardForm.forEach(item => {
      if (item.type === 'input' && values[`${item.ruleId}`] !== undefined) {
        if (!isPositiveNumber(values[`${item.ruleId}`])) {
          errors[`${item.ruleId}`] = (
            <FormattedMessage
              id="custom_field.required"
              defaultMessage={i18n['usermgmt.usercard.reak_dot_alert']}
            />
          );
        }

        if (values[`${item.ruleId}`] > item.maxCommissionValue) {
          errors[`${item.ruleId}`] = (
            <FormattedMessage
              id="custom_field.required"
              defaultMessage={`${
                i18n['usermgmt.usercard.reak_input_alert']
              }{value}`}
              values={{ value: item.maxCommissionValue }}
            />
          );
        }
      }
    });
    return errors;
  }
})(ReakRule);

export default class RuleForm extends Component {
  state = {
    showRuleDetailModal: false,
    dataReady: false,
    levelChanged: false,
    initialParams: {}
  };
  showReakDetail = ruleId => {
    const { getRuleDetail, showTopAlert } = this.props;
    Promise.resolve(getRuleDetail(ruleId)).then(res => {
      if (res.result) {
        if (res.data.length > 0) {
          this.setState({
            showRuleDetailModal: true
          });
        } else {
          showTopAlert({
            content: i18n['usermgmt.reak.reak_detail_alert'],
            bsStyle: 'danger'
          });
        }
      }
    });
  };

  hideDetailModal = () => {
    this.setState({
      showRuleDetailModal: false
    });
  };
  componentDidMount() {
    const { type, isTask, getDefaultParams } = this.props;
    if (type === 'edit' || isTask) {
      this.initInjectedDatas();
    } else {
      getDefaultParams();
      this.setState({
        dataReady: true
      });
    }
  }

  initInjectedDatas = () => {
    const {
      editUserInfo,
      getParents,
      getUpwardReturn,
      type,
      getLevelByUserId,
      isTask
    } = this.props;
    // if (editUserInfo.vendorServerId) {
    //   let arr = editUserInfo.vendorServerId.split('_');
    //   vendor = arr[0];
    //   serverId = arr[1];
    // }
    if (!editUserInfo.levelId || isTask) {
      const promises = [
        editUserInfo.id || isTask
          ? getUpwardReturn(editUserInfo.levelId || 0, 0, editUserInfo.id || 0)
          : Promise.resolve()
      ];
      if (editUserInfo.parent) {
        const p = getLevelByUserId(editUserInfo.parent);
        promises.push(p);
      }
      Promise.all(promises).then(res => {
        this.setState({
          dataReady: true
        });
      });
    } else {
      const parentId = editUserInfo.parent || 0;
      Promise.all([
        getParents(editUserInfo.levelId),
        editUserInfo.id
          ? getUpwardReturn(
              editUserInfo.levelId,
              parentId,
              editUserInfo.id || 0
            )
          : Promise.resolve()
      ]).then(res => {
        this.setState({
          dataReady: true
        });
      });
    }
  };
  levelChange = level => {
    console.log(level);
    const initialParams = this.initialDefaultParams(
      this.props.defaultParams,
      level.id
    );
    this.setState({
      levelChanged: true,
      initialParams
    });
  };
  initialDefaultParams = (defaultParams, id) => {
    // defaultParams && defaultParams.length &&
    const findItem = defaultParams.find(param => param.levelId === id);
    let obj = {};
    findItem &&
      findItem.details &&
      findItem.details.forEach(item => {
        obj[item.ruleId] = item.ruleDetailId;
      });
    return obj;
  };
  render() {
    const {
      showRuleDetailModal,
      dataReady,
      levelChanged,
      initialParams
    } = this.state;
    const {
      ruleDetail,
      upwardInitvalue,
      type,
      editUserInfo,
      isTask
    } = this.props;
    let commissionInitValues =
      upwardInitvalue.commissionInitValues &&
      editUserInfo.commission &&
      editUserInfo.commission.list &&
      editUserInfo.commission.list.reduce((obj, item) => {
        if (
          typeof upwardInitvalue.commissionInitValues[item.ruleId] !==
          'undefined'
        ) {
          obj[item.ruleId] = item.commissionValue || item.detailId;
        }
        return obj;
      }, {});
    if (type === 'add') {
      commissionInitValues = initialParams;
    }
    const taskInitialValues = !levelChanged
      ? {
          ...commissionInitValues,
          parent: editUserInfo.parent,
          levelName: editUserInfo.levelName,
          levelId: editUserInfo.levelId
        }
      : type === 'add'
        ? { ...commissionInitValues }
        : {};
    const initialValues = Object.assign(
      {},
      upwardInitvalue.commissionInitValues,
      taskInitialValues
    );
    return (
      <div>
        {dataReady ? (
          <ReakRuleForm
            {...this.props}
            initialValues={initialValues}
            levelChange={this.levelChange}
            showDetail={this.showReakDetail}
          />
        ) : (
          undefined
        )}
        {showRuleDetailModal ? (
          <RuleDetailModal
            onHide={this.hideDetailModal}
            ruleDetail={ruleDetail}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
