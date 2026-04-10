import { mutipleLanguageStore } from "./store/index";
import { injectStore } from "src/utils/provider.js";
import Root from "./components/Root";
export default injectStore(Root, mutipleLanguageStore);
