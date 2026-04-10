import { Field, reduxForm, Form } from 'redux-form';
import { Link } from 'react-router-dom';
import cs from './Root.less';
import i18n from 'utils/i18n';
import { isEmail } from 'components/FormField/validate';
import FormField from 'components/FormField';
import Alert from 'components/Alert';

class Root extends PureComponent {
  state = {
    sentSuccess: false
  }

  onChange = () => {
    this.setState({
      sentSuccess: false
    });
  }

  verify = (values) => {
    const { verify } = this.props;

    verify(values.email).then(({ result }) => {
      if (result) {
        this.setState({
          sentSuccess: true
        });
      }
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const { sentSuccess } = this.state;

    return (
      <div className={cs['container']}>
        <div className={cs['box']}>
          <div className={cs['heading']}>
            <span className={cs['title']}>{i18n['login.forgetpassword.title']}</span>
          </div>
          <div className={cs['content']}>
            {sentSuccess
              ? <Alert style="success">
                  {i18n['login.forgetpassword.send.success']}
                </Alert>
              : undefined}
            <Form onSubmit={handleSubmit(this.verify)} onChange={this.onChange}>
              <div className={cs['row']}>
                <Field
                  name="email"
                  fieldType="text"
                  placeholder={i18n['login.username.placeholder']}
                  className={`form-control ${cs['form-control']}`} 
                  validate={isEmail}
                  component={FormField}
                />
              </div>
              <div className={cs['row']}>
                <button type="submit" className={`btn btn-primary ${cs['btn']}`}>{i18n['login.forgetpassword.btn.send']}</button>  
              </div>
            </Form>
            <div className={cs['row']}>
              <Link to="/" className={`btn btn-default ${cs['btn']}`}>{i18n['login.forgetpassword.btn.back']}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'FORGOT_PASSWORD_FORM'
})(Root);