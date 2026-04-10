import Root from "./containers/Root";
import Routes from "./routes";

export default props => {
  return (
    <Root {...props}>
      <Routes />
    </Root>
  );
};
