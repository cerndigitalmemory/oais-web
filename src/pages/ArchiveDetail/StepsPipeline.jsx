import { PipelineStatus } from "@/pages/ArchiveDetail/StepsList.jsx";
import { sendNotification } from "@/utils.js";
import { stepType } from "@/types.js";
import PropTypes from "prop-types";
import React from "react";
import { Container, Segment, Label, List } from "semantic-ui-react";

export class StepsPipeline extends React.Component {
  static propTypes = {
    getSteps: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      steps: [],
    };

  }

  handleStepUpdate = (newStep) => {
    const steps = this.state.steps.map((step) => {
      if (step.id === newStep.id) {
        return newStep;
      } else {
        return step;
      }
    });
    this.setState({ steps });
  };

  loadSteps = async () => {
    try {
      const steps = await this.props.getSteps();
      this.setState({ steps });
    } catch (e) {
      sendNotification("Error while fetching archives", e.message);
    }
  };

  componentDidMount() {
    this.loadSteps();
  }


  render() {
    const { steps } = this.state;
  

    return (
      <Segment raised>
          <Label color='blue' ribbon>
            Pipeline
          </Label>
            <PipelineStatus
          steps={steps}
          onStepUpdate={this.handleStepUpdate}
        />
          </Segment>
    );
  }
}

export class StepsDetails extends React.Component {
    static propTypes = {
      getArchive: PropTypes.func.isRequired,
      id: PropTypes.string.isRequired,
    };
  
    constructor(props) {
      super(props);
      this.state = {
        archive: this.props.getArchive(),
      };
  
    }

  
    loadArchive = async () => {
      try {
        const archive = await this.props.getArchive();
        this.setState({ archive });
        console.log(archive.id)
      } catch (e) {
        sendNotification("Error while fetching archives", e.message);
      }
    };
  
    componentDidMount() {
      this.loadArchive();
    }
  
  
    render() {
      const { id } = this.props;
      const { archive } = this.state;
    
  
      return (
        <Segment raised>
          <Label color='blue' ribbon>
            General Archive Information
          </Label>
            <h1>Record {id}</h1> 
            <List>
              <List.Item><b>Source: </b> {archive.source}</List.Item>
              <List.Item><b>ID: </b> {archive.recid}</List.Item>
              <List.Item><b>Link: </b>  <a href={archive.source_url}>{archive.source_url}</a></List.Item>
            </List> 
          </Segment>
      );
    }
  }
