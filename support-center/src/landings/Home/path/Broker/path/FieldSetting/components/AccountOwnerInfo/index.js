import Nav from 'components/Nav';
import FieldList from '../../containers/FieldList';
import CreateField from '../../containers/CreateField';
import Question from '../../containers/Question';
import i18n from 'utils/i18n';
import UpdateModule from '../UpdateModule';

const FIELD_MODULE_NAME = 'account_owner';
//受版本控制的表单
const VERSION_CONTROL_FORMS = {
  t_account_profiles: true,
  t_account_finacial: true,
  t_account_id_info: true
};

export default class AccountOwnerInfo extends PureComponent {
  state = {
    activeKey: '',
    moduleList: []
  };

  componentDidMount() {
    this.getFieldModule();
  }

  getFieldModule = () => {
    const { getFieldModule, versionRights } = this.props;

    getFieldModule(FIELD_MODULE_NAME).then(({ result }) => {
      if (result) {
        const { moduleList } = this.props;
        const { activeKey } = this.state;
        const filteredList = moduleList.filter(item => item.enable);
        const currentModule = filteredList.find(item => item.form === activeKey) || filteredList[0] || {};
        if (!currentModule.form && versionRights['SC_PROPRIETY_TEST']) {
          currentModule.form = 'appropriateness_test';
        }
        this.setState(
          {
            moduleList: filteredList,
            activeKey: currentModule.form
          },
          () => {
            this.getFieldList();
          }
        );
      }
    });
  };

  onChange = activeKey => {
    this.setState(
      {
        activeKey
      },
      () => {
        if (activeKey !== 'appropriateness_test') {
          this.getFieldList();
        }
      }
    );
  };

  getFieldList = () => {
    const { activeKey } = this.state;
    const { getFieldList } = this.props;
    if (!activeKey) {
      return;
    }
    getFieldList(activeKey);
  };

  onUpdate = () => {
    this.getFieldList();
  };

  onUpdateModule = () => {
    this.getFieldModule();
  };

  render() {
    const { activeKey, moduleList } = this.state;
    const { versionRights } = this.props;
    return (
      <div>
        <Nav activeKey={activeKey} sm onChange={this.onChange}>
          {moduleList.map((item, idx) => {
            return (
              <Nav.Item eventKey={item.form} key={idx}>
                {item.name}
              </Nav.Item>
            );
          })}
          {versionRights['SC_PROPRIETY_TEST'] ? (
            <Nav.Item eventKey="appropriateness_test">{i18n['broker.question.module_name']}</Nav.Item>
          ) : null}
          {activeKey === 'appropriateness_test'
            ? undefined
            : activeKey && (
                <Nav.Buttons>
                  <UpdateModule onUpdate={this.onUpdateModule} />
                  <CreateField formId={activeKey} onCreate={this.onUpdate} />
                </Nav.Buttons>
              )}
        </Nav>
        {activeKey === 'appropriateness_test' ? (
          versionRights['SC_PROPRIETY_TEST'] ? (
            <Question />
          ) : null
        ) : activeKey ? (
          <FieldList onUpdate={this.onUpdate} formId={activeKey} />
        ) : null}
      </div>
    );
  }
}
