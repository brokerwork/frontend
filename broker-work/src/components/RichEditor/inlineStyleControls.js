import StyleButton from './styleButton';
import cs from './richEditor.less';

export const InlineStyleControls = props => {
  let { inlineStyles } = props;
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <span>
      {inlineStyles.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          icon={type.icon}
        />
      ))}
    </span>
  );
};
