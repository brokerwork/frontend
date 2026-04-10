import { Button, Dialog } from 'lean-ui';
import i18n from 'utils/i18n';

export default class RiskConfirmModal extends PureComponent {
  state = {
    allChecked: false
  };

  wrapperEle = null;
  componentWillUnmount() {
    this.wrapperEle.removeEventListener('click');
  }

  checkOptions = evt => {
    const options = this.wrapperEle.querySelectorAll('.sc_agent_risk_option');
    const checked = [].filter.call(options, option => option.checked);

    this.setState({
      allChecked: checked.length === options.length
    });
  };
  afterShow = ref => {
    this.wrapperEle = ref;
    this.wrapperEle.addEventListener('click', evt => {
      if (evt.target.className.includes('sc_agent_risk_option')) {
        this.checkOptions();
      }
    });
  };
  render() {
    const {
      onHide,
      agentConfig: { riskAgreement },
      onConfirm,
      show
    } = this.props;
    const { allChecked } = this.state;

    return (
      <Dialog
        visible={show}
        onCancel={onHide}
        title={i18n['agent.apply.risk.confirm_title']}
        footer={
          <Button type="primary" disabled={!allChecked} onClick={onConfirm}>
            {i18n['general.confirm']}
          </Button>
        }
      >
        <div
          ref={this.afterShow}
          dangerouslySetInnerHTML={{ __html: riskAgreement }}
        />
      </Dialog>
    );
  }
}
