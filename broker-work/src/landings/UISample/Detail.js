import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import { connect } from 'react-redux';
import PagePanel from 'components/PagePanel';
import { NavLink as Link } from 'react-router-dom';
import {
  showBannerNotice,
  showTipsModal,
  showTopAlert
} from 'commonActions/actions';

import { Button } from 'lean-ui';

export class Sample extends PureComponent {
  showBannerNotice = () => {
    const { showBannerNotice } = this.props;
    showBannerNotice({
      content: (
        <div>
          <b>通知</b> <span>通知</span>
        </div>
      ),
      onClose: () => {}
    });
  };
  showTipsModal = () => {
    const { showTipsModal } = this.props;
    showTipsModal({
      content: '123'
    });
  };
  showTopAlert = () => {
    const { showTopAlert } = this.props;
    showTopAlert({
      content: <span>{new Date().getTime()}</span>
    });
  };
  render() {
    return (
      <Layout footer>
        <Content old>
          <PagePanel>
            <PagePanel.Header>旧页面</PagePanel.Header>
            <PagePanel.Body>
              <Link to={'/uiSample'}>列表页</Link>
              <Button onClick={this.showBannerNotice}>显示banner通知</Button>
              <Button onClick={this.showTipsModal}>showTipsModal</Button>
              <br />
              <Button onClick={this.showTopAlert}>showTopAlert</Button>
              <br />
            </PagePanel.Body>
          </PagePanel>
        </Content>
      </Layout>
    );
  }
}

export default connect(
  ({ common }) => {
    return {
      brandInfo: common.brandInfo
    };
  },
  {
    showBannerNotice,
    showTipsModal,
    showTopAlert
  }
)(Sample);
