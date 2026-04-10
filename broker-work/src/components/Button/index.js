import { Button } from 'react-bootstrap';
import cs from './styles.less';

export default function({ children, className, ...props }) {
  const bsStyle = props.bsStyle;
  let cls = className;
  if (bsStyle === 'border') {
    props.bsStyle = 'primary';
    cls = `${cls} ${cs['btn-border']}`;
  }
  return (
    <Button {...props} className={cls}>
      {children}
    </Button>
  );
}
