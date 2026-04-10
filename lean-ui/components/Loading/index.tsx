import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classNames from 'classnames';
import Animate from 'rc-animate';
import isCssAnimationSupported from '../utils/isCssAnimationSupported';
import omit from 'omit.js';

export type LoadingIndicator = React.ReactElement<any>;

export interface LoadingProps {
  prefixCls?: string;
  className?: string;
  loading?: boolean;
  style?: React.CSSProperties;
  size?: 'small' | 'default' | 'large';
  tip?: string;
  delay?: number;
  wrapperClassName?: string;
  indicator?: LoadingIndicator;
}

export interface LoadingState {
  loading?: boolean;
  notCssAnimationSupported?: boolean;
}

export default class Loading extends React.Component<LoadingProps, LoadingState> {
  static defaultProps = {
    prefixCls: 'lean-loading',
    loading: true,
    size: 'default',
    wrapperClassName: '',
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    loading: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    wrapperClassName: PropTypes.string,
    indicator: PropTypes.node,
  };

  debounceTimeout: number;
  delayTimeout: number;

  constructor(props: LoadingProps) {
    super(props);
    const loading = props.loading;
    this.state = {
      loading,
    };
  }

  isNestedPattern() {
    return !!(this.props && this.props.children);
  }

  componentDidMount() {
    if (!isCssAnimationSupported()) {
      // Show text in IE9
      this.setState({
        notCssAnimationSupported: true,
      });
    }
  }

  componentWillUnmount() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  }

  componentWillReceiveProps(nextProps: LoadingProps) {
    const currentLoadingning = this.props.loading;
    const loading = nextProps.loading;
    const { delay } = this.props;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    if (currentLoadingning && !loading) {
      this.debounceTimeout = window.setTimeout(() => this.setState({ loading }), 200);
      if (this.delayTimeout) {
        clearTimeout(this.delayTimeout);
      }
    } else {
      if (loading && delay && !isNaN(Number(delay))) {
        if (this.delayTimeout) {
          clearTimeout(this.delayTimeout);
        }
        this.delayTimeout = window.setTimeout(() => this.setState({ loading }), delay);
      } else {
        this.setState({ loading });
      }
    }
  }

  renderIndicator() {
    const { prefixCls, indicator } = this.props;
    const dotClassName = `${prefixCls}-dot`;
    if (React.isValidElement(indicator)) {
      return React.cloneElement((indicator as LoadingIndicator), {
        className: classNames((indicator as LoadingIndicator).props.className, dotClassName),
      });
    }
    return (
      <span className={classNames(dotClassName, `${prefixCls}-dot-loading`)}>
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    );
  }

  render() {
    const { className, size, prefixCls, tip, wrapperClassName, ...restProps } = this.props;
    const { loading, notCssAnimationSupported } = this.state;

    const loadingClassName = classNames(prefixCls, {
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-show-text`]: !!tip || notCssAnimationSupported,
    }, className);

    // fix https://fb.me/react-unknown-prop
    const divProps = omit(restProps, [
      'loading',
      'delay',
      'indicator',
    ]);

    const loadingElement = (
      <div {...divProps} className={loadingClassName} >
        {this.renderIndicator()}
        {tip ? <div className={`${prefixCls}-text`}>{tip}</div> : null}
      </div>
    );
    if (this.isNestedPattern()) {
      let animateClassName = prefixCls + '-nested-loading';
      if (wrapperClassName) {
        animateClassName += ' ' + wrapperClassName;
      }
      const containerClassName = classNames({
        [`${prefixCls}-container`]: true,
        [`${prefixCls}-blur`]: loading,
      });
      return (
        <Animate
          {...divProps}
          component="div"
          className={animateClassName}
          style={null}
          transitionName="fade"
        >
          {loading && <div key="loading">{loadingElement}</div>}
          <div className={containerClassName} key="container">
            {this.props.children}
          </div>
        </Animate>
      );
    }
    return loadingElement;
  }
}
