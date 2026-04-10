import Modal from 'components/Modal';
import Button from 'components/Button';
import Table from 'components/Table';
import Switch from 'components/Switch';
import i18n from 'utils/i18n';

export default class UpdateModuleModal extends PureComponent {
  state = {
    moduleList: this.props.moduleList
  }

  onToggle = (moduleForm, enable) => {
    const { moduleList } = this.state;
    const copyed = JSON.parse(JSON.stringify(moduleList));

    this.setState({
      moduleList: copyed.map(item => {
        return {
          ...item,
          enable: item.form === moduleForm ? enable : item.enable
        };
      })
    });
  }

  onSort = (evt) => {
    const { oldIndex, newIndex } = evt;
    const { moduleList } = this.state;
    const copyed = JSON.parse(JSON.stringify(moduleList));
    const targetItem = copyed.splice(oldIndex, 1)[0];

    copyed.splice(newIndex, 0, targetItem);

    this.setState({
      moduleList: copyed
    });
  }

  onSave = () => {
    const { updateModule, showTopAlert, onSave } = this.props;
    const { moduleList } = this.state;

    updateModule('account_owner', moduleList).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });

        onSave();
      }
    });
  }

  render() {
    const { onClose } = this.props;
    const { moduleList } = this.state;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n['field.setting.module.title']}
        </Modal.Header>
        <Modal.Body>
          <Table>
            <Table.Header>
              <th>{i18n['general.sort']}</th>
              <th>{i18n['field.setting.module.name']}</th>
              <th>{i18n['table.header.operation']}</th>
            </Table.Header>
            <Table.Body sortable onSort={this.onSort}>
              {moduleList.map((item, idx) => {
                return (
                  <tr key={Math.random()}>
                    <td>
                      <i className="fa fa-bars"></i>
                    </td>
                    <td>{item.name}</td>
                    <td>
                      {item.system
                        ? undefined
                        : <Switch 
                            inline 
                            checked={item.enable} 
                            onChange={this.onToggle.bind(this, item.form)}
                          />
                      }
                    </td>
                  </tr>
                );
              })}
            </Table.Body>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>{i18n['general.save']}</Button>
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}