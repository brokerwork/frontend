import Table from 'components/Table';
import Button from 'components/Button';
import language from 'utils/language';
import { SENSITIVE_FIELD_TYPE, CAN_NOT_BE_DISABLED_FIELDS, showCustomEditList } from '../../constant';
import cs from './FieldList.less';
import i18n from 'utils/i18n';
import UpdateFieldModal from '../../containers/UpdateFieldModal';
import AnimationWrapper from 'components/AnimationWrapper';

export default class FieldList extends PureComponent {
  state = {
    showUpdateModal: false,
    selectedField: null,
    showChild: {}
  };

  componentDidMount() {
    const { getBrandInfo } = this.props;
    getBrandInfo();
  }

  showUpdateModal = selectedField => {
    this.setState({
      showUpdateModal: true,
      selectedField
    });
  };

  closeUpdateModal = () => {
    this.setState({
      showUpdateModal: false
    });
  };

  onUpdate = () => {
    const { onUpdate } = this.props;

    this.setState(
      {
        showUpdateModal: false
      },
      () => {
        onUpdate();
      }
    );
  };

  disableField = (field, isRelated) => {
    const { showTipsModal, disableField, formId, showTopAlert, onUpdate } = this.props;
    const content = isRelated ? i18n['field.setting.field-list.relate'] : i18n['field.setting.message.tip4'];

    showTipsModal({
      content,
      onConfirm: cb => {
        disableField(field.fieldId, formId).then(({ result, mcode }) => {
          if (result) {
            showTopAlert({
              style: 'success',
              content: i18n['general.forbid.success']
            });
            onUpdate();
          } else {
            showTipsModal({
              content: i18n[mcode],
              noCancel: true,
              onConfirm: cb => {
                cb();
              }
            });
          }
        });
        cb();
      }
    });
  };

  removeCustomizeField = (field, isRelated) => {
    const { removeCustomizeField, formId, showTipsModal, showTopAlert, onUpdate } = this.props;
    const content = isRelated
      ? i18n['field.setting.field-list.remove.isrelate']
      : i18n['field.setting.field-list.remove.notrelate'];

    showTipsModal({
      content,
      onConfirm: cb => {
        removeCustomizeField(field.fieldId, formId).then(({ result }) => {
          if (result) {
            showTopAlert({
              style: 'success',
              content: i18n['general.remove_success']
            });
            onUpdate();
          }
        });
        cb();
      }
    });
  };

  onSort = evt => {
    const { formId, fieldList, setFieldOrderNo } = this.props;
    const { oldIndex, newIndex } = evt;
    const from = fieldList[oldIndex].orderNo;
    const to = fieldList[newIndex].orderNo;

    if (oldIndex !== newIndex) {
      setFieldOrderNo(formId, from, to);
    }
  };

  toggleShowChild = fieldId => {
    this.setState({
      showChild: {
        ...this.state.showChild,
        [fieldId]: !this.state.showChild[fieldId]
      }
    });
  };

  renderField = (isChild, field, idx) => {
    const { fieldType, formId } = this.props;
    const { showChild } = this.state;
    const lang = language.getLang();
    const hasChild = field.options && field.options.some(item => item.relationFieldForList);

    return [
      <tr className={`${isChild ? '' : 'can-toggle'}`} key={field.fieldId} disabled={isChild}>
        <td>{isChild ? undefined : <i className="fa fa-bars" />}</td>
        <td title={field.message[lang]}>
          {hasChild ? (
            <a onClick={this.toggleShowChild.bind(this, field.fieldId)}>
              <i className={`fa fa-${showChild[field.fieldId] ? 'minus-square' : 'plus-square'}`} />
            </a>
          ) : (
            undefined
          )}
          {field.message[lang]}
        </td>
        <td>{(fieldType.find(item => item.value === field.fieldType) || {}).label}</td>
        {showCustomEditList.includes(formId) ? (
          <td>
            {field.sysDefault ? (
              '--'
            ) : (
              <i className={`fa fa-${field.relationFunc || field.relation ? 'check' : 'times'}`} />
            )}
          </td>
        ) : null}
        <td>
          <i className={`fa fa-${field.required ? 'check' : 'times'}`} />
        </td>
        <td>
          <i className={`fa fa-${field.overuse ? 'check' : 'times'}`} />
        </td>
        <td>
          {!SENSITIVE_FIELD_TYPE.includes(field.fieldType) ? (
            <i className={`fa fa-${field.sensitive ? 'check' : 'times'}`} />
          ) : (
            '--'
          )}
        </td>
        <td>{field.columns}</td>
        <td>
          {field.sysDefault
            ? i18n['field.setting.field.system']
            : field.userCustom
            ? i18n['field.setting.field.custom']
            : i18n['field.setting.field-list.key']}
        </td>
        <td>
          <Button icon style="primary" onClick={this.showUpdateModal.bind(this, field)}>
            <i className="fa fa-pencil" />
          </Button>
          {!field.sysDefault && field.enable && !(CAN_NOT_BE_DISABLED_FIELDS[formId] || []).includes(field.fieldId) ? (
            <Button icon onClick={this.disableField.bind(this, field, isChild || hasChild)}>
              <i className="fa fa-ban" />
            </Button>
          ) : (
            undefined
          )}
          {field.userCustom ? (
            <Button icon onClick={this.removeCustomizeField.bind(this, field, isChild || hasChild)}>
              <i className="fa fa-times" />
            </Button>
          ) : (
            undefined
          )}
        </td>
      </tr>,
      field.options && showChild[field.fieldId]
        ? field.options.map(
            (item, id) => item.relationFieldForList && this.renderField(true, item.relationFieldForList, id)
          )
        : undefined
    ];
  };

  render() {
    const { fieldList, formId } = this.props;
    const { showUpdateModal, selectedField } = this.state;

    return (
      <div className={cs['list']}>
        <Table>
          <Table.Header>
            <th>{i18n['general.sort']}</th>
            <th>{i18n['field.setting.field.name']}</th>
            <th>{i18n['field.setting.field.type']}</th>
            {showCustomEditList.includes(formId) ? <th>{i18n['field.setting.field.relationFunc']}</th> : null}
            <th>{i18n['field.setting.field.required']}</th>
            <th>{i18n['field.setting.field.overuse']}</th>
            <th>{i18n['field.setting.field.sensitive']}</th>
            <th>{i18n['field.setting.field.columns']}</th>
            <th>{i18n['field.setting.field.attr']}</th>
            <th>{i18n['table.header.operation']}</th>
          </Table.Header>
          <Table.Body
            sortable
            onSort={this.onSort}
            sortOptions={{
              draggable: '.can-toggle'
            }}
          >
            {fieldList.map(this.renderField.bind(this, false))}
          </Table.Body>
        </Table>
        <AnimationWrapper>
          {showUpdateModal ? (
            <UpdateFieldModal
              type="update"
              formId={formId}
              selectedField={selectedField}
              onClose={this.closeUpdateModal}
              onSave={this.onUpdate}
            />
          ) : (
            undefined
          )}
        </AnimationWrapper>
      </div>
    );
  }
}
