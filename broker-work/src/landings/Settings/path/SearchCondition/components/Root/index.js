import { Button } from 'react-bootstrap';

import PagePanel from 'components/PagePanel';
import Table from 'components/Table';
import NoDataView from 'components/v2/NoDataView';
import i18n from 'utils/i18n';
import UpdateCondition from '../../container/UpdateCondition';

import cs from './CustomerSelectConditions.less';
import Tips from 'components/Tips';
import { DropdownForCode } from 'components/Dropdown';

export default class CustomerSelectConditions extends PureComponent {
  state = {
    showUpdateConditionModal: false,
    type: ''
  };

  componentDidMount() {
    const {
      getCustomerFormFields,
      getCustomerSource,
      getRoleList,
      getConditionsList,
      searchType
    } = this.props;
    getCustomerFormFields();
    getCustomerSource();
    getRoleList();
    getConditionsList(searchType);
  }

  componentWillReceiveProps(nextProps) {
    const { searchType, getConditionsList } = this.props;
    const { searchType: nextSearchType } = nextProps;
    if (searchType !== nextSearchType) {
      getConditionsList(nextSearchType);
    }
  }

  toggleModal = (type, toggle, button, id) => {
    const { getConditionsListDetail } = this.props;
    if (button === 'edit') {
      Promise.resolve(getConditionsListDetail(id)).then(({ result }) => {
        if (result) {
          this.setState({
            [`show${type}Modal`]: toggle,
            type: button
          });
        }
      });
    } else {
      this.setState({
        [`show${type}Modal`]: toggle,
        type: button
      });
    }
  };

  updateCondition = copyData => {
    const {
      updateCondition,
      createCondition,
      showTopAlert,
      getConditionsList,
      searchType
    } = this.props;
    const { type } = this.state;

    if (type === 'edit') {
      Promise.resolve(updateCondition(copyData)).then(res => {
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.modify_success']
          });
          getConditionsList(searchType);
        }
      });
    }

    if (type === 'add') {
      Promise.resolve(createCondition(copyData)).then(res => {
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.create_success']
          });
          getConditionsList(searchType);
        }
      });
    }
  };

  deleteCondition = id => {
    const {
      removeCondition,
      showTopAlert,
      getConditionsList,
      showTipsModal,
      searchType
    } = this.props;
    showTipsModal({
      content: i18n['advanced_search.form.confirm_remove'],
      onConfirm: cb => {
        Promise.resolve(removeCondition(id)).then(res => {
          if (res.result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            getConditionsList(searchType);
          }
        });
        cb();
      }
    });
  };

  _renderTableRow = (item, idx) => {
    return (
      <tr key={idx}>
        <td>{item.name}</td>
        <td>
          {item.roleNames
            ? item.roleNames.join(',')
            : i18n['settings.conditions_setting.all_role']}
        </td>
        <td>
          <Button
            className={'icon btn-primary'}
            onClick={this.toggleModal.bind(
              this,
              'UpdateCondition',
              true,
              'edit',
              item.searchId
            )}
          >
            <i className="fa fa-pencil" />
          </Button>
          <Button
            className="icon"
            onClick={this.deleteCondition.bind(this, item.searchId)}
          >
            <i className="fa fa-times" />
          </Button>
        </td>
      </tr>
    );
  };

  render() {
    const { conditionsList, children, searchType } = this.props;
    const { showUpdateConditionModal, type } = this.state;
    return (
      <PagePanel>
        <PagePanel.Header>
          {
            i18n[
              'settings.left_menu.customer_setting.sub_menu.conditions_setting'
            ]
          }
          <Tips className={cs['tips']} align={'bottom'}>
            <p className={cs['text']}>
              {i18n['settings.conditions_setting.header_tips']}
            </p>
          </Tips>
        </PagePanel.Header>
        <PagePanel.Body className="panel-body">
          {children}
          <Table className={`ellipsis ${cs['table']}`}>
            <Table.Header>
              <th>{i18n['settings.conditions_setting.condition_name']}</th>
              <th>{i18n['settings.conditions_setting.condition_range']}</th>
              <th>{i18n['settings.conditions_setting.condition_action']}</th>
            </Table.Header>
            <Table.Body>
              {conditionsList && conditionsList.map(this._renderTableRow)}
            </Table.Body>
          </Table>
          {conditionsList.length === 0 ? <NoDataView /> : undefined}
          <Button
            bsStyle="primary"
            className={cs['right']}
            onClick={this.toggleModal.bind(
              this,
              'UpdateCondition',
              true,
              'add',
              undefined
            )}
          >
            <i className="fa fa-plus" />
            {i18n['settings.conditions_setting.add_condition']}
          </Button>
        </PagePanel.Body>
        {showUpdateConditionModal ? (
          <UpdateCondition
            {...this.props}
            show={showUpdateConditionModal}
            onHide={this.toggleModal.bind(
              this,
              'UpdateCondition',
              false,
              undefined,
              undefined
            )}
            onSave={this.updateCondition}
            type={type}
          />
        ) : (
          undefined
        )}
      </PagePanel>
    );
  }
}
