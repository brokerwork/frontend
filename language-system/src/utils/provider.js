import React from "react";
import { useLocalStore } from "mobx-react"; // 6.x or mobx-react-lite@1.4.0

const storeContext = React.createContext(null);

export const StoreProvider = ({ children, createStore }) => {
  const store = useLocalStore(createStore);
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};

export function injectStore(WrapComponent, store) {
  return props => (
    <StoreProvider createStore={store}>
      <WrapComponent {...props} />
    </StoreProvider>
  );
}
