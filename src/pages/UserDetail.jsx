import { api } from "@/api.js";
import { ArchivesList } from "@/components/ArchivesList.jsx";
import { Pagination } from "@/components/Pagination.jsx";
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
    const { user } = this.state;
    return (
      <React.Fragment>
        <h1>
          User {user.id} ({user.username})
        </h1>
        <Pagination
          data={(page) => api.archivesByUser(user.id, page)}
          render={({ results }) => <ArchivesList archives={results} />}
        />
      </React.Fragment>
    );
  }
}
