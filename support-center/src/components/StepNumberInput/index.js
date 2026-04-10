import Button from "components/Button";
import FormControl from "components/FormControl";
import NumberInput from "components/NumberInput";
import cs from "./StepNumberInput.less";
import math from "utils/math";

export default class StepNumberInput extends PureComponent {
  increase = () => {
    const { value = 0, step = 1, onChange } = this.props;

    onChange(math.add(value, step));
  };

  decrease = () => {
    const { value = 0, step = 1, onChange } = this.props;

    onChange(math.sub(value, step));
  };

  render() {
    const { value = 0, minVal, maxVal } = this.props;
    return (
      <div className={cs["step-number"]}>
        <Button
          icon
          style="default-white"
          className={cs["decrease-btn"]}
          onClick={this.decrease}
          disabled={minVal !== undefined ? value <= minVal : false}
        >
          <i className="fa fa-minus" />
        </Button>
        <NumberInput {...this.props} negative />
        <Button
          icon
          style="default-white"
          className={cs["increase-btn"]}
          onClick={this.increase}
          disabled={maxVal !== undefined ? value >= maxVal : false}
        >
          <i className="fa fa-plus" />
        </Button>
      </div>
    );
  }
}
