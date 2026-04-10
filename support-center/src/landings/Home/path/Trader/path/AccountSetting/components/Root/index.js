import Button from 'components/Button';
import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import _ from 'lodash';
import cs from './style.less';
import AccountForm from '../../containers/AccountForm';

export default class Root extends PureComponent {
  state = {
    publicKey: ''
  };

  componentDidMount() {
    const { getAccountFields, getBrandInfo } = this.props;
    getAccountFields();
    getBrandInfo();
  }

  render() {
    const {
      accountFields = [],
      brandInfo: { languages = [] }
    } = this.props;
    return (
      <ContentWrapper header={i18n['trader.account.profile.setting.header']}>
        <div className={cs['content']}>
          <AccountForm initFields={accountFields} languages={languages} />
        </div>
      </ContentWrapper>
    );
  }
}
