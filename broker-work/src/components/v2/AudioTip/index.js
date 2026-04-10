import { Tooltip } from 'lean-ui';
import AudioPlayer from 'components/v2/AudioPlayer';
import cs from './index.less';
export default ({ src }) => {
  return (
    <Tooltip
      className={cs['state-icon']}
      trigger="hover"
      placement="top"
      title={<AudioPlayer autoPlay={true} src={src} />}
    >
      <i className="fa fa-volume-up" />
    </Tooltip>
  );
};
