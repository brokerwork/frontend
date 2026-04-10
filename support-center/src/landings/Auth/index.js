import Root from "./containers/Root";
import Routes from "./routes";

export default ({ location }) => {
  return (
    <Root location={location}>
      <Routes />
    </Root>
  );
};
