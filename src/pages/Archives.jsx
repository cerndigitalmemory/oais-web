import React from "react";
import { api } from "@/api.js";
import { ArchivesList } from "@/components/ArchivesList.jsx";

export class Archives extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      archives: [],
    };
  }

  componentDidMount() {
    api.archives().then((archives) => {
      this.setState({ archives: archives.results });
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1>Archives</h1>
        <ArchivesList archives={this.state.archives} />
      </React.Fragment>
    );
  }
}
