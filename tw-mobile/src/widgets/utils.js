export function combineComponentStyle( props, defaultStyleGeneratorMap ) {
  let copiedProps = Object.assign({}, props);
  let combinedStyleResult = {};

  Object.keys( defaultStyleGeneratorMap ).forEach( styleName => {
    let generator = defaultStyleGeneratorMap[ styleName ];
    let defaultStyle = generator( copiedProps );
    let customizedStyle = props[ styleName ];
    combinedStyleResult[ styleName ] = Object.assign( {}, defaultStyle, customizedStyle );
  } );

  return Object.assign( {}, props, combinedStyleResult );
}