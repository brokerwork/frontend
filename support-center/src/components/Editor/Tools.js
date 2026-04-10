import cs from './editor.less';
import SimpleBtn from './plugins/SimpleBtn';
import Group from './plugins/Group';
import ToolLink from './plugins/ToolLink';
import FontColor from './plugins/FontColor';
import ToolImage from './plugins/ToolImage';
import { FONT_SIZES, FONT_FAMILIES, CUSTOM_BLOCK_MAP } from './contants';
const defaultTools = [
  { icon: 'fa-bold', value: 'BOLD', type: 'INLINE' },
  { icon: 'fa-italic', value: 'ITALIC', type: 'INLINE' },
  { icon: 'fa-underline', value: 'UNDERLINE', type: 'INLINE' },
  {
    icon: 'fa-header',
    component: Group,
    child: [
      { label: 'H1', value: 'header-one', type: 'BLOCK' },
      { label: 'H2', value: 'header-two', type: 'BLOCK' },
      { label: 'H3', value: 'header-three', type: 'BLOCK' },
      { label: 'H4', value: 'header-four', type: 'BLOCK' },
      { label: 'H5', value: 'header-five', type: 'BLOCK' },
      { label: 'H6', value: 'header-six', type: 'BLOCK' }
    ]
  },
  {
    icon: 'fa-font',
    component: Group,
    props: {
      renderMenuItem: item => {
        return (
          <span title={item.label} style={{ fontFamily: item.label }}>
            {item.label}
          </span>
        );
      }
    },
    child: FONT_FAMILIES.map(font => ({
      label: font,
      value: `FONT_FAMILY_${font}`,
      type: 'INLINE'
    }))
  },
  {
    icon: 'fa-text-height',
    component: Group,
    child: FONT_SIZES.map(size => ({
      label: size,
      value: `FONT_SIZE_${size}`,
      type: 'INLINE'
    }))
  },
  { icon: 'fa-eyedropper', component: FontColor },
  {
    icon: 'fa-align-left',
    component: Group,
    props: {
      renderMenuItem: item => {
        return (
          <span title={item.label}>
            <i className={`fa fa-align-${item.label}`} /> {item.label}
          </span>
        );
      }
    },
    child: CUSTOM_BLOCK_MAP.textAlign.map(align => ({
      label: align,
      key: 'textAlign',
      value: align,
      type: 'BLOCK'
    }))
  },
  // { icon: 'fa-quote-left', value: 'blockquote', type: 'BLOCK' },
  { icon: 'fa-list-ul', value: 'unordered-list-item', type: 'BLOCK' },
  { icon: 'fa-list-ol', value: 'ordered-list-item', type: 'BLOCK' },
  // { icon: 'fa-code', value: 'code-block', type: 'BLOCK' },
  { icon: 'fa-link', component: ToolLink }
  // { icon: 'fa-image', component: ToolImage }
];

export default class EditorTools extends Component {
  handleEditorChange = newState => {
    const { onToggle } = this.props;
    if (onToggle) {
      onToggle(newState);
    }
  };

  render() {
    const { editorState, className = '' } = this.props;
    return (
      <div className={className}>
        {/*default INLINE or BLOCK */}
        {defaultTools.map((item, index) => {
          const ToolComponent = item.component || SimpleBtn;
          return (
            <ToolComponent
              key={index}
              data={item}
              editorState={editorState}
              onChange={this.handleEditorChange}
            />
          );
        })}
        {/*cunstomTools*/}
        {/*{cunstomTools.map((item, index) => {
          const Tool = item;
          return <Tool key={index} editorState={editorState} onChange={this.handleEditorChange.bind(this)}/>;
        })}*/}
      </div>
    );
  }
}
