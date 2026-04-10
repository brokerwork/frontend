import { observable, action } from "mobx";
class rennewStore {
  @observable showModal = false;
  @observable errors = {};
  @observable formValues = {};
  @action.bound
  setErrors(errors) {
    this.errors = errors;
  }
  @action
  setFormValues = values => {
    this.formValues = values;
    this.modalVisible(true);
  };
  @action.bound
  modalVisible(visible) {
    this.showModal = visible;
  }
}
export default new rennewStore();
