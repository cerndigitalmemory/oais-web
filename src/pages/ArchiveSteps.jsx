import { api } from "@/api.js";
import { PaginatedStepsList } from "@/components/PaginatedStepsList.jsx";
import React from "react";
import PropTypes from "prop-types";


export class ArchiveSteps extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
  }


  render() {
    const { id } = this.props.match.params;

    return (
      <React.Fragment>
        <h1>Archive Steps for Archive {id} </h1>
        <PaginatedStepsList getSteps={() => api.get_archive_steps(id)} />
      </React.Fragment>
    );
  }
}
