import Tab from 'components/Tab';
import i18n from 'utils/i18n';
import { FormSection } from 'redux-form';
import TelegraphicForm from '../TelegraphicForm';
import FieldSetting from '../FieldSetting';
import cs from './index.less';
const TabPanel = Tab.Panel;

export default class TelegraphicTabs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1
    };
  }
  onChangeField = fields => {
    this.props.onChangeField(fields);
  };
  render() {
    const { activeKey } = this.state;
    const { languages, plat, personalList, publicList } = this.props;
    return (
      <Tab
        activeKey={activeKey}
        id="telegraphic"
        onSelect={key => {
          this.setState({ activeKey: key });
        }}
      >
        <TabPanel eventKey={1} title={i18n['platform.tab.deposit.telegraphic.public']}>
          <div className={cs.margin_top}>
            <FormSection name="publicTelegraphic">
              <TelegraphicForm list={publicList.telegraphicsList} type="public" languages={languages} plat={plat} />
            </FormSection>
          </div>
        </TabPanel>
        <TabPanel eventKey={2} title={i18n['platform.tab.deposit.telegraphic.personal']}>
          <div className={cs.margin_top}>
            <FormSection name="personalTelegraphic">
              <TelegraphicForm list={personalList.telegraphicsList} type="personal" languages={languages} plat={plat} />
            </FormSection>
          </div>
        </TabPanel>
        <TabPanel eventKey={3} title={i18n['left.menu.field.setting']}>
          <div className={cs.margin_top}>
            <FieldSetting onChangeField={this.onChangeField} fields={this.props.fields} />
          </div>
        </TabPanel>
      </Tab>
    );
  }
}
