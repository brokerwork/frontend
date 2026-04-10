import i18n from 'utils/i18n';
import { Form } from 'lean-ui';

class EditColumnTitle extends PureComponent {
  state = {
    value: this.props.value
  };
  onChange = e => {
    const { onChange } = this.props;
    const v = e.target.value;
    this.setState({
      value: v
    });
    if (onChange) onChange(v);
  };
  render() {
    const { value } = this.state;
    return (
      <Form>
        <Form.Item col={1}>
          <Form.Label>{`${
            i18n['runmgmt.app_content.column.banner.name']
          }: `}</Form.Label>
          <Form.Control>
            <input
              type="text"
              value={value}
              onChange={this.onChange}
              className="form-control"
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}
export default EditColumnTitle;
