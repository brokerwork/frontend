import * as React from "react";
export const connect = (storeName, injectStore) => {
  return Component => {
    return class Wrap extends React.Component {
      store = {};
      constructor(props) {
        super(props);
        this.store[storeName] = injectStore;
      }
      render() {
        return <Component {...{ ...this.props, ...this.store }} />;
      }
    };
  };
};
