import i18n from 'utils/i18n';
import cs from './TransferModal.less';
import { Select, Icon, Dialog, Input } from 'lean-ui';
import { findDOMNode } from 'react-dom';

const Option = Select.Option;
export default class TransferModal extends PureComponent {
  saveRef = node => {
    this.triger = node;
  };
  render() {
    const { superior } = this.state;
    const { onHide, onSave, superiorUsers } = this.props;
    return (
      <Dialog
        title={i18n['general.batch_transfer']}
        visible={true}
        onCancel={onHide}
        onOk={onSave.bind(this, superior ? superior : null)}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
      >
        <div className={cs['content']} ref={this.saveRef}>
          <div className={cs['tips']}>{i18n['usermgmt.transfer.tips']}</div>
          <div className={cs['select-content']}>
            <div className={cs['label']}>{`${
              i18n['usermgmt.transfer.label']
            }:`}</div>
            <div className={cs['select-item']}>
              <Select
                value={superior}
                isSearch
                onSelect={this.selectSuperior}
                getPopupContainer={() => findDOMNode(this.triger)}
              >
                {superiorUsers &&
                  superiorUsers.map((item, index) => {
                    return (
                      <Option key={index} value={`${item.value}`}>
                        {item.label}
                      </Option>
                    );
                  })}
              </Select>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
  state = {
    superior: ''
  };
  selectSuperior = item => {
    this.setState({
      superior: item
    });
  };
}
