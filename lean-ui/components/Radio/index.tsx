import Radio from './radio';
import RadioGroup from './group';

Radio.Group = RadioGroup;
/**
 * RadioGroup可以在Radio引入后通过Radio.Group获取也可以直接引用：
 * import { RadioGroup } from 'radio'
 */
export { RadioGroup };
export default Radio;
