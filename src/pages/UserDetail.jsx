import { api } from "@/api.js";
import { ArchivesList } from "@/components/ArchivesList.jsx";
import React from "react";

export class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      archives: [],
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    api.user(id).then((user) => {
      this.setState({
        user: user,
      });
    });
    api.archivesByUser(id).then((res) => {
      this.setState({
        archives: res.results,
      });
    });
  }

  render() {
    const { user, archives } = this.state;
    return (
      <React.Fragment>
        <h1>
          User {user.id} ({user.username})
        </h1>
        <ArchivesList archives={archives} />
      </React.Fragment>
    );
  }
}
