import { StepsList } from "@/components/StepsList.jsx";
import { PageControls } from "@/components/PageControls.jsx";
import { sendNotification } from "@/utils.js";
import { stepType } from "@/types.js";
import PropTypes from "prop-types";
import React from "react";

export class PaginatedStepsList extends React.Component {
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
      <div>
        <StepsList
          steps={steps}
          onStepUpdate={this.handleStepUpdate}
        />
      </div>
    );
  }
}
