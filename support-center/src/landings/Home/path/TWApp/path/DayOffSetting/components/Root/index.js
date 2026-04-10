import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import Main from '../Main';

export default class Root extends PureComponent {
  render() {
    const { ...props } = this.props;
    return (
      <ContentWrapper header={'休盘日设置'}>
        <Main { ...props }/>
      </ContentWrapper>
    );
  }
}