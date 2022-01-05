import { api } from "@/api.js";
import { PaginatedStepsList } from "@/components/PaginatedStepsList.jsx";
import { StepsPipeline, StepsDetails } from "@/components/StepsPipeline.jsx";
import React from "react";
import PropTypes from "prop-types";
import { Segment, Label, List, Header } from "semantic-ui-react";



export class ArchiveSteps extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string.isRequired}).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
  }


  render() {
    const { id } = this.props.match.params;

    return (
      <React.Fragment> 

          <StepsDetails getArchive = {() => api.archive_details(id)} id = {id}/>
          <Segment raised>
          <Label color='blue' ribbon>
            Pipeline
          </Label>
            <StepsPipeline getSteps={() => api.get_archive_steps(id)} />
          </Segment>
          <Segment raised>
          <Label color='blue' ribbon>
            Steps
          </Label>
            <h1>Archive Steps for Archive {id} </h1>
            <PaginatedStepsList getSteps={() => api.get_archive_steps(id)} />
          </Segment>

      </React.Fragment>
    );
  }
}
