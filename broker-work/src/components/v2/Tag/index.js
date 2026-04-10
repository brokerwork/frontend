import cls from 'utils/class';
import cs from './Tag.less';
import { Tag as LTag } from 'lean-ui';

const fn = () => {};

// export default ({
//   children,
//   disabled,
//   bsSize = '',
//   bsStyle = '',
//   active,
//   className,
//   onClick
// }) => {
//   return (
//     <span
//       className={cls`${cs['tag']}
//             ${bsStyle ? cs[bsStyle] : ''}
//             ${bsSize ? cs[bsSize] : ''}
//             ${className ? className : ''}
//             ${active ? cs['active'] : ''}
//             ${disabled ? cs['disabled'] : ''}`}
//       onClick={!disabled && onClick ? onClick : fn}
//     >
//       {children}
//     </span>
//   );
// };
export default class Tag extends PureComponent {
  render() {
    const {
      children,
      disabled,
      bsSize = '',
      bsStyle = '',
      active,
      className,
      onClick
    } = this.props;

    return (
      <LTag
        {...this.props}
        className={cls`${cs['tag']}
                  ${bsStyle ? cs[bsStyle] : ''}
                  ${bsSize ? cs[bsSize] : ''}
                  ${className ? className : ''}
                  ${active ? `active ${cs['active']}` : ''}
                  ${disabled ? cs['disabled'] : ''}`}
        onClick={!disabled && onClick ? onClick : fn}
      >
        {children}
      </LTag>
    );
  }
}
