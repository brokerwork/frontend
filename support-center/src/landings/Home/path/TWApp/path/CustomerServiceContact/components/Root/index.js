import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import Form from '../Form';

export default class Root extends PureComponent {
  state = {
    show: false
  }
  componentDidMount() {
    const { getData } = this.props;
    getData().then(res => {
      this.defaultData = res.data;
      this.setState({
        show: true
      });
    });
  }
  render() {
    const { submitData } = this.props;
    const props = this.props;
    return (
      <ContentWrapper header={i18n['twapp.customer_service_contact.title']}>
        {this.state.show ? <Form {...props} initialValues={this.defaultData} enableReinitialize={true} /> :null}
      </ContentWrapper>
    );
  }
}