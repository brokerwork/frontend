import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import DownloadList from '../../containers/DownloadList';


export default class Root extends PureComponent {
  componentDidMount() {
    const { getBrandInfo, getDownloadList } = this.props;
    getBrandInfo();
    getDownloadList();
  }

  render() {
    return (
      <ContentWrapper header={i18n['left.menu.download.center']}>
        <DownloadList></DownloadList>
      </ContentWrapper>
    );
  }
}
