import { connect } from 'react-redux';
import { Layout, Sider, Content, Summary } from 'components/v2/PageWraper';
import { NavLink as Link } from 'react-router-dom';
import { width } from 'window-size';
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

  render() {
    return (
      <Layout>
        <Summary>新页面</Summary>
        <Layout direction="horizontal">
          <Sider>
            <div>Slider</div>
          </Sider>
          <Layout footer>
            <Content>
              <div style={{ padding: '20px' }}>
                <Button onClick={this.showBannerNotice}>显示banner通知</Button>
                <br />
                <Link to={'/uiSample/detail'}>详情页</Link>
              </div>
            </Content>
            <div>overlay显示额外fixed底部内容, 如分页组件</div>
          </Layout>
        </Layout>
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
