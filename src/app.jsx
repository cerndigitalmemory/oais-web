import React from "react";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "Hello!",
    };
  }

  render() {
    return <div>{this.state.message}</div>;
  }
}
