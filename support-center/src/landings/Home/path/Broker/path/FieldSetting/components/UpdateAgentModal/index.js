import CardPanel from 'components/CardPanel';
import Button from 'components/Button';
import AgentForm, { AGENT_FORM } from '../Forms/Agent';
import Nav from 'components/Nav';
import { languages } from 'utils/config';
import cs from './UpdateAgentModal.less';
import i18n from 'utils/i18n';

export default class UpdateAgentModal extends PureComponent {
  state = {
    activeKey: languages[0].value,
    currentInfo: {},
    fakeCurrentInfo: {}
  }

  componentDidMount() {
    const { getAgentInfo } = this.props;

    getAgentInfo().then(({ result }) => {
      if (result) {
        const { agentInfo } = this.props;
        const { activeKey } = this.state;

        this.setState({
          currentInfo: agentInfo[activeKey],
          fakeCurrentInfo: agentInfo[activeKey]
        });
      }
    });
  }

  onChange = (activeKey) => {
    const { agentInfo } = this.props;

    this.setState({
      activeKey,
      currentInfo: agentInfo[activeKey],
      fakeCurrentInfo: agentInfo[activeKey]
    });
  }

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(AGENT_FORM);
  }

  onSubmit = (values) => {
    const { activeKey } = this.state;
    const { updateAgentInfo, showTopAlert, onClose } = this.props;
    const copyData = JSON.parse(JSON.stringify(values));

    copyData.language = activeKey;

    updateAgentInfo(copyData).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        onClose();
      }
    });
  }

  onFormChange = (values) => {
    this.setState({
      fakeCurrentInfo: values
    });
  }

  onCreateButtonClick = () => {
    const { fakeCurrentInfo } = this.state;
    const newOption = `<p><label><input class="sc_agent_risk_option" type="checkbox" />${i18n['field.setting.agent.option']}</label></p>`;
    const riskAgreement = `${newOption}${fakeCurrentInfo.riskAgreement || ''}`;

    this.setState({
      currentInfo: {
        ...fakeCurrentInfo,
        riskAgreement
      }
    });
  }

  render() {
    const { onClose } = this.props;
    const { activeKey, currentInfo } = this.state;

    return (
      <CardPanel onClose={onClose}>
        <CardPanel.Header>
          {i18n['field.setting.agent.edit']}
        </CardPanel.Header>
        <CardPanel.Body>
          <Nav activeKey={activeKey} onChange={this.onChange}>
            {languages.map((lang, idx) => {
              return (
                <Nav.Item key={idx} eventKey={lang.value}>
                  {lang.label}
                </Nav.Item>
              );
            })}
          </Nav>
          <div className={cs['form']}>
            <AgentForm
              initialValues={currentInfo}
              onChange={this.onFormChange}
              onCreateButtonClick={this.onCreateButtonClick}
              onSubmit={this.onSubmit}
            ></AgentForm>
          </div>
        </CardPanel.Body>
        <CardPanel.Footer>
          <Button style="primary" onClick={this.onSave}>{i18n['general.save']}</Button>
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}