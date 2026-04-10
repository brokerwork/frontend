import { Field, reduxForm, Form } from "redux-form";
import { Link } from "react-router-dom";
import cs from "./Root.less";
import i18n from "utils/i18n";
import { required, isPassword } from "components/FormField/validate";
import FormField from "components/FormField";
import { getTenantId } from "utils/tenantInfo";

const isSamePassword = (value, allValues) =>
  value === allValues["newPwd"]
    ? undefined
    : i18n["password.modify.message.tip3"];

class Root extends PureComponent {
  update = values => {
    const { update, showTopAlert } = this.props;

    update(values).then(({ result }) => {
      if (result) {
        showTopAlert({
          content: i18n["password.modify.message.tip1"],
          style: "success"
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    });
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className={cs["container"]}>
        <div className={cs["box"]}>
          <div className={cs["heading"]}>
            <span className={cs["title"]}>{i18n["password.modify.title"]}</span>
          </div>
          <div className={cs["content"]}>
            <Form onSubmit={handleSubmit(this.update)}>
              <div className={cs["row"]}>
                <Field
                  component={FormField}
                  fieldType="password"
                  name="origin"
                  label={i18n["password.modify.old_password"]}
                  className={cs["form-control"]}
                  validate={required}
                  placeholder={i18n["password.modify.placeholder1"]}
                />
              </div>
              <div className={cs["row"]}>
                <Field
                  component={FormField}
                  fieldType="password"
                  name="newPwd"
                  label={i18n["password.modify.new_password"]}
                  className={cs["form-control"]}
                  validate={[required, isPassword]}
                  placeholder={i18n["password.modify.placeholder2"]}
                />
              </div>
              <div className={cs["row"]}>
                <Field
                  component={FormField}
                  fieldType="password"
                  name="verified"
                  label={i18n["password.modify.new_password"]}
                  className={cs["form-control"]}
                  validate={[required, isSamePassword]}
                  placeholder={i18n["password.modify.placeholder3"]}
                />
              </div>
              <div className={cs["row"]}>
                <button
                  type="submit"
                  className={`btn btn-primary ${cs["btn"]}`}
                >
                  {i18n["password.modify.btn.confirm"]}
                </button>
              </div>
            </Form>
            <div className={cs["row"]}>
              <Link
                to={{ pathname: "/home", search: `?tenantId=${getTenantId()}` }}
                className={`btn btn-default ${cs["btn"]}`}
              >
                {i18n["app.btn.back"]}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: "MODIFY_PASSWORD_FORM"
})(Root);
