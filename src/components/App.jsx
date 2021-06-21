import React from "react";
import { Search } from "./Search";

export class App extends React.Component {
  render() {
    return (
      <div id="app">
        <div id="content">
          <Search />
        </div>
      </div>
    );
  }
}
