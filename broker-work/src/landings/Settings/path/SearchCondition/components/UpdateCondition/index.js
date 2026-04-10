import { Button, Tabs, Tab, FormControl } from 'react-bootstrap';
import Modal from 'components/Modal';
import Dropdown, { DropdownForCode } from 'components/Dropdown';
import i18n from 'utils/i18n';
import DatePicker from 'components/DatePicker';
import DateRangePicker from 'components/DateRangePicker';
import cs from './UpdateCondition.less';
import Form from 'components/Form';
import moment from 'moment';
import UserSelector from 'components/UserSelector';
import { ADVANCED_SEARCH_TIME_TYPE as timeTypes } from '../../constant';
import AdvancedSearch from 'components/AdvancedSearch';
export default class UpdateCondition extends PureComponent {
  state = {
    data: {},
    currentRole: []
  };
  componentDidMount() {
    const { conditionDetail, type, updateConditionRole } = this.props;
    this.setState({
      data: conditionDetail || {}
    });
    if (type === 'edit') {
      this.setState({
        currentRole: this.formatterFieldRole(conditionDetail.roleIds)
      });
    }
  }
  formatterFieldRole = roleIds => {
    const { roleList } = this.props;
    let roleFieldData = [];
    if (!(roleIds && roleIds.length)) {
      roleFieldData.push({
        label: i18n['settings.conditions_setting.all_role'],
        value: 'all'
      });
      return roleFieldData;
    }
    roleIds.forEach((item, index) => {
      roleFieldData.push(
        roleList.find(_item => _item.value === parseInt(item))
      );
    });
    return roleFieldData;
  };

  updateConditionName = e => {
    const v = e.target.value;
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        name: v
      }
    });
  };
  updateConditionRole = v => {
    this.setState({
      currentRole: v
    });
  };

  onHide = () => {
    const { onHide, clearnConditionDetail } = this.props;
    this.setState({
      data: {}
    });
    clearnConditionDetail();
    onHide();
  };
  onSave = (searchData, logicType, originData) => {
    const { data, currentRole } = this.state;
    const { searchType, onSave, onHide, showTopAlert } = this.props;
    let roleIds = [];
    if (!(data && data.name)) {
      showTopAlert({
        bsStyle: 'danger',
        content: i18n['settings.conditions_setting.null_tips']
      });
      return;
    }
    currentRole.forEach(item => {
      if (item.value === 'all') {
        roleIds = [];
        return;
      }
      roleIds.push(item.value);
    });
    const submitData = {
      ...data,
      roleIds,
      condition: originData,
      searchLevel: 'TENANT',
      searchType,
      logicType
    };
    onSave(submitData);
    this.onHide();
  };
  onSubmitForm = () => {
    const container = this.refs.advancedSearch;
    const wrapInstance =
      container &&
      container.getWrappedInstance &&
      container.getWrappedInstance();
    if (wrapInstance && wrapInstance.submitForm) {
      wrapInstance.submitForm();
    }
  };
  reset = () => {
    const container = this.refs.advancedSearch;
    const wrapInstance =
      container &&
      container.getWrappedInstance &&
      container.getWrappedInstance();
    if (wrapInstance && wrapInstance.submitForm) {
      wrapInstance.reset();
    }
    this.setState({
      data: {
        name: ''
      },
      currentRole: []
    });
  };
  render() {
    const {
      roleList,
      type,
      searchConfig,
      advancedSearchType,
      advancedSearchConditions,
      searchType
    } = this.props;

    const { data, currentRole } = this.state;
    return (
      <Modal
        backdrop="static"
        className={cs['modal-container']}
        bsSize="large"
        show={true}
        onHide={this.onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {type === 'add'
              ? i18n['settings.conditions_setting.add_condition_header']
              : i18n['settings.conditions_setting.edit_condition_header']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['report-modal-body']}>
          <div className={cs['body']}>
            <div className={cs['title']}>
              {i18n['settings.conditions_setting.basic_info']}
            </div>
            <div className={cs['form']}>
              <Form.Item col={1}>
                <Form.Label className={cs['label']}>
                  <span className={cs['require']} />
                  {i18n['settings.conditions_setting.condition_name']}:{' '}
                </Form.Label>
                <Form.Control>
                  <FormControl
                    className={cs['input']}
                    type="text"
                    maxLength={50}
                    value={data.name}
                    onChange={this.updateConditionName}
                    placeholder={i18n['settings.conditions_setting.add_tips']}
                  />
                </Form.Control>
              </Form.Item>
              <Form.Item col={1}>
                <Form.Label className={cs['label']}>
                  {' '}
                  {i18n['settings.conditions_setting.condition_range']}:{' '}
                </Form.Label>
                <Form.Control>
                  <Dropdown
                    className={cs['input']}
                    data={roleList}
                    checkbox
                    value={currentRole}
                    onSelect={this.updateConditionRole}
                  />
                </Form.Control>
              </Form.Item>
            </div>
            <div className={cs['title']}>
              {i18n['settings.conditions_setting.settings_header']}
            </div>
            <AdvancedSearch.Container
              {...searchConfig}
              searchType={searchType}
              types={advancedSearchType}
              conditions={advancedSearchConditions}
              onSearch={this.onSave}
              initData={data.condition}
              logicType={data.logicType}
              justForm={true}
              ref="advancedSearch"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.reset}>
            <span className="fa fa-rotate-left" />
            {i18n['account.advanced_search.reset']}
          </Button>
          <Button bsStyle="primary" onClick={this.onSubmitForm}>
            <span className="fa fa-plus" />
            {type === 'add' ? i18n['general.add'] : i18n['general.save']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
