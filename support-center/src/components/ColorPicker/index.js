const COLORS = [
  '#000000', '#993300', '#333300', '#003300', '#003366',
  '#000080', '#333399', '#333333', '#800000', '#FF6600',
  '#808000', '#008000', '#008080', '#0000FF', '#666699',
  '#808080', '#FF0000', '#FF9900', '#99CC00', '#339966',
  '#33CCCC', '#3366FF', '#800080', '#999999', '#FF00FF',
  '#FFCC00', '#FFFF00', '#00FF00', '#00FFFF', '#00CCFF',
  '#993366', '#C0C0C0', '#FF99CC', '#FFCC99', '#FFFF99',
  '#CCFFCC', '#CCFFFF', '#99CCFF', '#CC99FF', '#FFFFFF'
];
import cs from './ColorPicker.less';

export default ({onChange=fn, active, className=''}) => {
  return (
    <div className={`${cs['container']} ${className}`}>
      {COLORS.map((item, index) => {
        return (
        <span
          key= {index}
          title={item}
          onClick={onChange.bind(this, item)}
          className={cs['item']}
          style={{ backgroundColor: item }}
        />
        );
      })}
    </div>
  );
};

function fn() {}


