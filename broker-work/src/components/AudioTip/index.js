import Tips from 'components/Tips';
import AudioPlayer from 'components/AudioPlayer';
import cs from './index.less';
export default ({ src }) => {
  return (
    <Tips className={cs['AudioTip']} icon="fa fa-volume-up" align="top">
      <AudioPlayer autoPlay={true} src={src} />
    </Tips>
  );
};
