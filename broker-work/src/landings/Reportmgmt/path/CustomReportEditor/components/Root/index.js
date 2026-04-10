import i18n from 'utils/i18n';
import PagePanel from 'components/PagePanel';
import ActionsBar from '../../containers/ActionBar';
import List from '../../containers/List';
import { Layout, Summary, Content, Sider } from 'components/v2/PageWraper';
import { Select, Icon, Popover } from 'lean-ui';
import cs from './index.less';
import SideOptions from '../../containers/SideOptions';
import queryString from 'utils/queryString';

export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    const { location } = window;
    const params = queryString(location.search);
    const reportType = params.get('reportType');
    const reportId = params.get('reportId');
    this.reportId = reportId;
    this.state = {
      reportId,
      reportType
    };
  }
  componentDidMount() {
    const { reportType } = this.state;
    const { getTypeField, getFieldsDetail, getTypeFieldEdit } = this.props;
    if (this.reportId) {
      getFieldsDetail(this.reportId).then(({ result, data }) => {
        if (result) {
          this.setState({
            reportType: data.reportType
          });
          getTypeFieldEdit(data.reportType);
        }
      });
    } else {
      getTypeField(reportType);
    }
  }
  render() {
    const { typeFields, history } = this.props;
    const { reportType, reportId } = this.state;
    return (
      <Layout>
        <Summary>
          <ActionsBar reportType={reportType} history={history} reportId={reportId} />
        </Summary>
        <Layout direction="horizontal">
          <Sider>
            <SideOptions reportType={reportType} typeFields={typeFields} />
          </Sider>
          <List />
        </Layout>
      </Layout>
    );
  }
}
