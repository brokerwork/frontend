import Root from './containers/Root';

export default props => <Root {...props} key={props.location.pathname} />;
