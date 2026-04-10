import { mutipleExportAndImportStore } from "./store/index";
import { injectStore } from "src/utils/provider";
import Root from "./components/Root";

export default injectStore(Root, mutipleExportAndImportStore);
