import EditHeaderForm from '../../containers/EditHeaderForm';
import EditFooterForm from '../../containers/EditFooterForm';
import DetailsForm from '../../containers/DetailsForm';
import { EDIT_HEADER_FORM } from '../EditHeaderForm';
import { EDIT_FOOTER_FORM } from '../EditFooterForm';
import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import cs from './index.less';
import { getApproveStageStr } from '../../../Customers/utils';
import { Icon } from 'lean-ui';

const DETAIL_FORM_PREFIX = 'DETAIL_FORM_';

export default class Edit extends Component {
  needApprove = false; //提交表单后是否需要发起审批
  tempFormData = {};
  headerFormInitialData = {};
  footerFormInitialData = {};

  constructor(props) {
    super(props);

    const {
      initialValues,
      initialValues: { productDeploy = {} }
    } = props; //默认显示两条产品位置

    const { details = [{}] } = productDeploy;

    this.state = { details: this.initDetailsKey(details) };

    this.headerFormInitialData = this.getHeaderFormInitialData();
    this.footerFormInitialData = this.getFooterFormInitialData();
  }

  initDetailsKey = details => {
    //为每一个detailsItem设置一个key，在增加删除时需要
    return details.map((item, index) => ({ ...item, key: index }));
  };

  isSavedAllFormData = () => {
    if (!this.tempFormData[EDIT_HEADER_FORM]) {
      return false;
    }
    if (!this.tempFormData[EDIT_FOOTER_FORM]) {
      return false;
    }

    const { details } = this.state;

    let isFullDetailItem = true;
    details.forEach(item => {
      if (!this.tempFormData[`${DETAIL_FORM_PREFIX}${item.key}`]) {
        isFullDetailItem = false;
      }
    });

    if (!isFullDetailItem) {
      //不是所有的detailsItem都提交成功
      return;
    }

    //所有表单数据均已提交获取成功
    return true;
  };

  //合并几个表单的数据
  mergeFormData = () => {
    let data = {};
    const { deployType, customerId, deployId } = this.tempFormData[
      EDIT_HEADER_FORM
    ];
    let details = [];

    const { details: stateDetails } = this.state;

    stateDetails.forEach(item => {
      details.push(this.tempFormData[`${DETAIL_FORM_PREFIX}${item.key}`]);
    });

    let productDeploy = { ...this.tempFormData[EDIT_FOOTER_FORM], details };
    productDeploy.payDate =
      productDeploy.payDate && productDeploy.payDate.valueOf();

    data.customerId = customerId;
    data.deployId = deployId;
    data.deployType = deployType;
    data.productDeploy = productDeploy;

    return data;
  };

  onSave = (info, type) => {
    this.tempFormData[type] = info;
    if (!this.isSavedAllFormData()) {
      return;
    }

    //所有表单数据均已放入tempFormData
    const formData = this.mergeFormData();
    const { showTopAlert, updateDeploy, onSave, showApproveModal } = this.props;
    updateDeploy(formData).then(res => {
      const {
        result,
        data: { customerId, deployId }
      } = res;

      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.deal_success']
        });

        if (onSave) {
          onSave(info);
        }

        const { deployType } = formData;

        if (this.needApprove && showApproveModal) {
          showApproveModal(customerId, deployId, deployType);
        }
      }
    });

    this.tempFormData = {};
  };

  //保存数据
  onSubmit = needApprove => {
    this.needApprove = needApprove;
    const { submitForm } = this.props;
    const { details } = this.state;
    submitForm(EDIT_HEADER_FORM);
    details.forEach(item => {
      submitForm(`${DETAIL_FORM_PREFIX}${item.key}`);
    });
    submitForm(EDIT_FOOTER_FORM);
  };

  onCancel = () => {
    const { onHide } = this.props;
    if (onHide) onHide();
  };

  onClickAddPro = () => {
    const { details } = this.state;
    //新item的index使用最后一个item的key+1
    this.setState({
      details: [...details, { key: details[details.length - 1].key + 1 }]
    });
  };

  getHeaderFormInitialData = () => {
    const {
      initialValues: { customerId, deployId, deployType, deployTypeName }
    } = this.props;

    return { customerId, deployId, deployType, deployTypeName };
  };

  getFooterFormInitialData = () => {
    const {
      initialValues: { productDeploy }
    } = this.props;

    const initialData = { ...productDeploy };
    delete initialData.details; //不需要details

    return initialData;
  };

  isEditAble = () => {
    const { disabled } = this.props;

    if (disabled) {
      return false;
    }
    const {
      initialValues: { stage }
    } = this.props;

    if (stage === 2) {
      //审批中不允许编辑
      return false;
    }

    return true;
  };

  isShowRestStageHint = () => {
    const {
      initialValues: { stage }
    } = this.props;

    if ([4, 5].includes(stage)) {
      return true;
    }

    return false;
  };

  removeDetailItem = index => {
    const { details } = this.state;
    details.splice(index, 1);
    this.setState({ details });
  };

  render() {
    const {
      show,
      onHide,
      initialValues: { stage },
      approvable
    } = this.props;

    const { details } = this.state;

    return (
      <Modal backdrop="static" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['customer.deploy.title']}
            <span className={cs[`stage-${stage}`]}>{`（${getApproveStageStr(
              stage
            )}）`}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-horizontal">
            <EditHeaderForm
              {...this.props}
              initialValues={this.headerFormInitialData}
              onSave={this.onSave}
            />
          </div>
          {details.map((item, index) => (
            <div key={item.key}>
              <div className={cs['divider-2']} />
              <div className={cs['product-details-title']}>
                {index !== 0 && (
                  <Icon
                    className={cs['remove-details-item']}
                    icon="error"
                    onClick={this.removeDetailItem.bind(this, index)}
                  />
                )}
                {`${i18n['customer.deploy.product_details.title']} （${index +
                  1}）：`}
              </div>
              <div className="form-horizontal">
                <DetailsForm
                  {...this.props}
                  formKey={`${DETAIL_FORM_PREFIX}${item.key}`}
                  initialValues={item}
                  onSave={this.onSave}
                />
              </div>
            </div>
          ))}
          <div className={cs['add-product-container']}>
            <div className={`${cs['divider']} main-color`} />
            <div className={cs['add-product']} onClick={this.onClickAddPro}>
              {i18n['customer.deploy.button.addProduct']}
            </div>
          </div>
          <div className="form-horizontal">
            <EditFooterForm
              {...this.props}
              initialValues={this.footerFormInitialData}
              onSave={this.onSave}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {this.isShowRestStageHint() && (
            <div className={cs['reset-status-hint']}>
              {i18n['customer.approve.hint.reset_status']}
            </div>
          )}
          {this.isEditAble() ? (
            <Button bsStyle="primary" onClick={this.onSubmit.bind(this, false)}>
              {i18n['general.confirm']}
            </Button>
          ) : (
            undefined
          )}
          {this.isEditAble() && approvable ? (
            <Button bsStyle="primary" onClick={this.onSubmit.bind(this, true)}>
              {i18n['customer.contract.btn.saveAndApprove']}
            </Button>
          ) : (
            undefined
          )}
          <Button onClick={this.onCancel}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
