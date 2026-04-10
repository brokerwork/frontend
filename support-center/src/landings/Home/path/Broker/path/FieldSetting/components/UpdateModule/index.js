import Modal from 'components/Modal';
import Button from 'components/Button';
import Table from 'components/Table';
import UpdateModuleModal from '../../containers/UpdateModuleModal';
import i18n from 'utils/i18n';

export default class UpdateModule extends PureComponent {
  state = {
    show: false
  }

  toggle = (show) => {
    this.setState({
      show
    });
  }

  onSave = () => {
    const { onUpdate } = this.props;

    this.setState({
      show: false
    }, () => {
      onUpdate();
    });
  }

  render() {
    const { show } = this.state;

    return (
      <div>
        <Button style="primary" onClick={this.toggle.bind(this, true)}>
          {i18n['field.setting.module.title']}
        </Button>
        {show
          ? <UpdateModuleModal 
              onClose={this.toggle.bind(this, false)}
              onSave={this.onSave}
            />
          : undefined
        }
      </div>
    );
  }
}