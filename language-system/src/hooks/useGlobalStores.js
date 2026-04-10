import React from "react";
import { CommonStore } from "../store/commonStore";

export const storesContext = React.createContext({
  commonStore: new CommonStore()
});

export const useGlobalStores = () => React.useContext(storesContext);
