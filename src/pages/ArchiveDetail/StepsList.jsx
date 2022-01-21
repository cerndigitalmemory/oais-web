import { api } from "@/api.js";
import { AppContext } from "@/AppContext.js";
import { stepType } from "@/types.js";
import {
  StepStatus,
  StepStatusLabel,
  StepNameLabel,
  StepName,
  formatDateTime,
  hasPermission,
  Permissions,
  sendNotification,
} from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, Header, Icon, Segment, Grid, Accordion, Container, Image } from "semantic-ui-react";

export class StepsList extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(stepType),
    onStepUpdate: PropTypes.func.isRequired,
  };

  render() {
    const { steps, onStepUpdate } = this.props;
    return (
        <React.Fragment>
          {steps.map((step) => (
            <Step
              key={step.id}
              step={step}
              onStepUpdate={onStepUpdate}
            />
          ))}
        </React.Fragment>
    );
  }
}

class Step extends React.Component {
  static propTypes = {
    step: stepType.isRequired,
    onStepUpdate: PropTypes.func.isRequired,
  };

  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  static contextType = AppContext.Context;

  approve = async () => {
    const { step, onStepUpdate } = this.props;
    try {
      const updatedStep = await api.approveArchive(step.id);
      onStepUpdate(updatedStep);
    } catch (e) {
      sendNotification("Error while approving archive", e.message);
    }
  };

  reject = async () => {
    const { step, onStepUpdate } = this.props;
    try {
      const updatedStep = await api.rejectArchive(step.id);
      onStepUpdate(updatedStep);
    } catch (e) {
      sendNotification("Error while rejecting archive", e.message);
    }
  };


  render() {
    const { step } = this.props;
    const { user } = this.context;
    const { activeIndex } = this.state
  
    // const canApprove = hasPermission(user, Permissions.CAN_APPROVE_ARCHIVE);
    // const canReject = hasPermission(user, Permissions.CAN_REJECT_ARCHIVE);
  
    let actions = null;
    if (step.status === 5) {
      actions = (
        <Button.Group>

            <Button onClick={this.approve} color="green" title="Approve">
              <Icon name='check' />
            </Button>

            <Button onClick={this.reject} color="red" title="Reject">
              <Icon name='cancel' />
            </Button>

        </Button.Group>
      );
    }

    /*
    If the current step is Archivematica, 
    gets the information from step.output_data field and
    sets the renderArchivematicaDetails to true. 
    If this value is true then archivematica details are rendered
    */
    let renderArchivematicaDetails;
    if(step.name === 5 ){
      if (step.output_data == null){
        renderArchivematicaDetails = false
      }
      else {
        // In order to display the JSON correctly double quotes must be replaced with single quotes
        var output = JSON.parse(step.output_data.replaceAll("'", '"'));
        renderArchivematicaDetails = true;
      }
      
    }
    

    


    return (
      <Container>
        <Grid>
        <Grid.Row columns={2}>
          <Grid.Column floated='left' width={5}>
            <h3>{StepNameLabel[step.name]}</h3>
          </Grid.Column>
          <Grid.Column floated='right' width={5}><b>Actions: </b> {actions}</Grid.Column>
        </Grid.Row>
        </Grid>
        <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Step Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Grid>
          <Grid.Row columns={4}>
          <Grid.Column><b>ID: </b> {step.id}</Grid.Column>
          <Grid.Column><b>Start Date: </b> {formatDateTime(step.start_date)}</Grid.Column>
          <Grid.Column>{step.finish_date && <div><b>End Date: </b> {formatDateTime(step.finish_date)}</div>}</Grid.Column>
          <Grid.Column><b>Status: </b> {StepStatusLabel[step.status]}</Grid.Column>
          </Grid.Row>
          </Grid>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Task Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
        <Grid>
          <Grid.Row columns={1}>
          <Grid.Column><b>Task ID: </b> {step.celery_task_id}</Grid.Column>
          
          
          </Grid.Row>
        </Grid>
        </Accordion.Content>
        {renderArchivematicaDetails &&
        <React.Fragment>
             <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Archivematica Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
        <Grid>
          <Grid.Row columns={3}>
          <Grid.Column><b>Step: </b> {output.type}</Grid.Column>
          <Grid.Column><b>UUID: </b> {output.uuid}</Grid.Column>
          <Grid.Column><b>Status: </b> {output.status}</Grid.Column>       
          </Grid.Row>
          <Grid.Row columns={2}>
          <Grid.Column><b>Directory: </b> {output.directory}</Grid.Column>
          <Grid.Column><b>File Name: </b> {output.name}</Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
          <Grid.Column><b>Microservice: </b> {output.microservice}</Grid.Column>
          <Grid.Column><b>Message: </b> {output.message}</Grid.Column>
          </Grid.Row>
        </Grid>
        </Accordion.Content>
        </React.Fragment>
         
            
          }

      
      </Accordion>
      <br/>

      </Container>
      
    );
  }
}


