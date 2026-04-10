import { Button, Dialog, Icon } from 'lean-ui';
import i18n from 'utils/i18n';
import AddParamsForm from '../AddParamsForm';
import cs from './index.less';

export default class AddParamsModal extends PureComponent {
  state = {
    sort: true
  };
  onSave = () => {
    const { onSave, type } = this.props;
    const params = this.child.onSubmit();
    onSave(params, type);
  };
  onHide = () => {
    this.props.onHide();
  };
  onSort = () => {
    this.setState({
      sort: !this.state.sort
    });
  };
  render() {
    const {
      type,
      parameterlevelList,
      isPercentRule,
      selected,
      data,
      show,
      editData
    } = this.props;
    const { sort } = this.state;
    return (
      <Dialog
        title={
          <div className={cs.modal_title}>
            <span>
              {type === 'edit'
                ? i18n['settings.rebate_setting.params_setting.edit']
                : i18n['settings.rebate_setting.params_setting.add']}
            </span>
            <span className={cs.sort}>
              <Icon
                fontType="bw"
                icon={sort ? 'positive-sequence' : 'reverse-order'}
                onClick={this.onSort}
              />
            </span>
          </div>
        }
        visible={show}
        className={cs.add_parameter_modal}
        onCancel={this.onHide}
        footer={
          <div>
            <Button onClick={this.onHide}>{i18n['general.cancel']}</Button>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
          </div>
        }
      >
        <AddParamsForm
          parameterlevelList={parameterlevelList}
          isPercentRule={isPercentRule}
          selected={selected}
          data={data}
          editData={editData}
          type={type}
          ref={child => {
            this.child = child;
          }}
          sortable={sort}
        />
      </Dialog>
    );
  }
}
