import StyleButton from './styleButton';
import cs from './richEditor.less';

export const EntityControls = props => {
  let { entityControls } = props;
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <span>
      {entityControls.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={type.action}
          icon={type.icon}
        />
      ))}
    </span>
  );
};
