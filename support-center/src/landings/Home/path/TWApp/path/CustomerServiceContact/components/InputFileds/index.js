import FormControl from 'components/FormControl';
import Button from 'components/Button';
import cs from './style.less';
import i18n from 'utils/i18n';

export default class InputFields extends Component {
  constructor(props) {
    super(props);
    let tags = props.input.value;
    this.state = {
      errMsg: '',
      inputVal: '',
      canAdd: true,
      tags: tags && tags.length ? tags : []
    };
  }
  onInputChange(e) {
    const { value } = e.currentTarget;
    const { fildValid } = this.props;
    let errMsg = '';
    if (fildValid && fildValid.length) {
      fildValid.forEach(rule => {
        errMsg = rule(value);
      });
      if (errMsg) {
        this.setState({
          inputVal: value,
          canAdd: true
        });
        return;
      }
    }
    this.setState({
      inputVal: value,
      canAdd: !value
    });
  }
  onBlur() {
    const { inputVal } = this.state;
    const { fildValid } = this.props;
    let errMsg = '';
    if (fildValid && fildValid.length) {
      fildValid.forEach(rule => {
        errMsg = rule(inputVal);
      });
      if (errMsg) {
        this.setState({
          errMsg,
          canAdd: true
        });
        return;
      }
    }
    this.setState({
      errMsg: '',
      canAdd: !inputVal
    });

  }
  onDelete(index) {
    let { tags } = this.state;
    const { input } = this.props;
    tags.splice(index, 1);
    this.setState({
      tags: tags
    });
    input.onChange(tags);
  }
  onAdd() {
    const { inputVal, tags } = this.state;
    const { input } = this.props;
    if (tags.includes(inputVal)) {
      return;
    }
    let res = [inputVal, ...tags];
    this.setState({
      inputVal: '',
      tags: res
    });
    input.onChange(res);
  }
  render() {
    const { name } = this.props;
    let { inputVal, tags, canAdd, errMsg } = this.state;
    return (
      <div>
        <div className={`${cs['input-tag-input']}`}>
          <FormControl
            name={`${name}-input`}
            value={inputVal}
            onChange={this.onInputChange.bind(this)}
            onBlur={this.onBlur.bind(this)}
          />
          <Button style='primary' onClick={this.onAdd.bind(this)} disabled={canAdd}>{i18n['general.add']}</Button>
        </div>
        <small className={`${cs['input-tag-error']}`}>{errMsg}</small>
        <div className={cs['clearfix']}>
        {
          tags.map((val, index) => {
            return (
              <span className={cs['input-tag-span']} key={index}>{val}<a onClick={this.onDelete.bind(this, index)}>x</a></span>
            );
          })
        }
        </div>
      </div>
    );
  }
}