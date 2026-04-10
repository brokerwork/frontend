import i18n from 'utils/i18n';
import { Form, InputNumber } from 'lean-ui';

class OrderModalContent extends PureComponent {
  state = {
    value: this.props.value
  };
  onChange = v => {
    const { onChange } = this.props;
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
          <Form.Label>{i18n['runmgmt.app_content.article.order']}: </Form.Label>
          <Form.Control>
            <InputNumber value={value} onChange={this.onChange} />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}
export default OrderModalContent;
