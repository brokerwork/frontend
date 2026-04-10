import i18n from 'utils/i18n';
import List from '../../containers/List';
import PagePanel from 'components/PagePanel';
// import Breadcrumb from 'components/Breadcrumb';
import { Link } from 'react-router-dom';
import cs from './index.less';
// import Tips from 'components/Tips';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import { Icon, Breadcrumb, Tooltip } from 'lean-ui';

export default class Main extends PureComponent {
  getDuplicateList = () => {
    const { paginationInfo, getDuplicate } = this.props;
    return getDuplicate({
      pageSize: paginationInfo.pageSize,
      currentPage: paginationInfo.currentPage
    });
  };
  render() {
    const props = this.props;
    const {
      match: { path }
    } = props;
    return (
      <Layout footer>
        {/* <Breadcrumb theme="gray-link" className={cs['header']}>
          <Link to={path.replace('/duplicate', '')}>
            {i18n['navigation.customer.module_name']}
          </Link>
          <span>{i18n['customer.duplicate.title']}</span>
        </Breadcrumb> */}
        {/* <PagePanel>
          <PagePanel.Header>
            {i18n['customer.duplicate.note']}
            <Tips
              className={cs['tips-icon']}
              hover
              icon="fa fa-question-circle"
              align="bottom"
            >
              <div className={cs['tips-content']}>
                <p>
                  <b>{i18n['customer.duplicate.tips_title']}</b>
                </p>
                <p>{i18n['customer.duplicate.tips_content']}</p>
              </div>
            </Tips>
          </PagePanel.Header> */}
        <Summary>
          <div className={cs['actions-bar']}>
            <div className={cs['left-part']}>
              <div className={cs['primary-top-title']}>
                <Icon icon="customer" className={cs['customer-icon']} />
                <div className={cs['module-info']}>
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link to={path.replace('/duplicate', '')}>
                        {i18n['navigation.customer.module_name']}
                      </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                      {i18n['customer.duplicate.title']}
                    </Breadcrumb.Item>
                  </Breadcrumb>
                  <div className={cs['sumary-title']}>
                    {i18n['customer.duplicate.title']}
                  </div>
                </div>
              </div>
              <Summary.Info
              // total={paginationInfo.total}
              // updateTime={listUpdateTime}
              >
                {i18n['customer.duplicate.note']}
                <Tooltip
                  trigger="hover"
                  placement="right"
                  title={`${i18n['customer.duplicate.tips_title']}
                        ${i18n['customer.duplicate.tips_content']}`}
                >
                  <span>
                    <Icon icon="question" />
                  </span>
                </Tooltip>
              </Summary.Info>
            </div>
          </div>{' '}
        </Summary>
        {/* <PagePanel.Body> */}
        <Content table>
          <List {...props} getDuplicateList={this.getDuplicateList} />
        </Content>
        {/* </PagePanel.Body> */}
        {/* </PagePanel> */}
      </Layout>
    );
  }
}
