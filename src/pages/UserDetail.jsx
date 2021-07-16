import { api } from "@/api.js";
import { PaginatedArchivesList } from "@/components/PaginatedArchivesList.jsx";
import React from "react";

export class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const user = await api.user(id);
    this.setState({ user });
  }

  render() {
    const { id } = this.props.match.params;
    const { user } = this.state;
    return (
      <React.Fragment>
        <h1>
          User {user.id} ({user.username})
        </h1>
        <PaginatedArchivesList
          getArchives={(page) => api.archivesByUser(id, page)}
        />
      </React.Fragment>
    );
  }
}
