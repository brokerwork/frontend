import React from "react";
import Dialog from "../components/Dialog";
import Button from "../components/Button";
class App extends React.Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>Open</Button>
        <Dialog
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Dialog>
      </div>
    );
  }
}

class CenterApp extends React.Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>center align</Button>
        <Dialog
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          align={"center"}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Dialog>
      </div>
    );
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: "Dialog",
          info: "对话框",
          sectionFn: () => {
            return (
              <div>
                <div>
                  <div className="story-demo">
                    <App />
                    <CenterApp />
                  </div>
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};