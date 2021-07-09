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

  componentDidMount() {
    const { id } = this.props.match.params;
    api.user(id).then((user) => {
      this.setState({
        user: user,
      });
    });
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
