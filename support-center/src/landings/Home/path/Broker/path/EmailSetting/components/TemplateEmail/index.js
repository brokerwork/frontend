import Tab from 'components/Tab';
import i18n from 'utils/i18n';
import Template from '../../containers/Template';
import {TABLIST} from "../../constant";

export default class TemplateEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'ALL'
    };
  }
  componentDidMount() {
    const { getTemplateList } = this.props;
    const { activeKey } = this.state;
    const type = activeKey === 'ALL' ? "":activeKey;
    getTemplateList(type);
  }
  onTabChange = activeKey => {
    const { getTemplateList } = this.props;
    getTemplateList(activeKey);
    this.setState({
      activeKey
    });
  };
  render() {
    const { activeKey } = this.state;
    return (
      <div>
        <Tab activeKey={activeKey} onChange={this.onTabChange}>
          {TABLIST.map(key => (
            <Tab.Panel title={i18n[`email.setting.template.tab_title.${key}`]} key={key} eventKey={key}>
              <Template {...this.props} activeKey={activeKey} />
            </Tab.Panel>
          ))}
        </Tab>
      </div>
    );
  }
}
