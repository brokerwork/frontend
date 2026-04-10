import cs from './Form.less';

export default class Form extends PureComponent {
  render() {
    const { children, className = '', showHelpText, ...otherProps } = this.props;

    return (
      <form {...otherProps}>
        <div className={`form ${cs['form']} ${showHelpText ? cs['show-help-text'] : ''} ${className}`}>
          {children}
        </div>
      </form>
    );
  }
}

class Item extends PureComponent {
  render() {
    const { children, className = '', col = '1' } = this.props;

    return (
      <div className={`form-item ${cs['item']} ${cs[`col-${col}`]} ${className}`}>
        {children}
      </div>
    );
  }
}

class Label extends PureComponent {
  render() {
    const { children, className = '' } = this.props;

    return (
      <div className={`form-item-label ${cs['label']} ${className}`}>
        {children}
      </div>
    );
  }
}

class Control extends PureComponent {
  render() {
    const { children, className = '', staticControl, groupControl } = this.props;

    return (
      <div className={`form-item-control ${cs['control']} ${staticControl ? cs['static'] : ''} ${groupControl ? cs['group'] : ''} ${className}`}>
        {children}
      </div>
    );
  }
}

class HelpText extends PureComponent {
  render() {
    const { children, className = '' } = this.props;

    return (
      <div className={`form-item-help-text ${cs['help-text']} ${className}`}>
        {children}
      </div>
    );
  }
}

Form.Item = Item;
Form.Label = Label;
Form.Control = Control;
Form.HelpText = HelpText;