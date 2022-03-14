import { StepsList } from '@/pages/ArchiveDetail/StepsList.jsx'
import { sendNotification } from '@/utils.js'
import { stepType, archiveType } from '@/types.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Segment, Label } from 'semantic-ui-react'

/**
 * This component contains a segment with a title
 * which contains a list of each step with all relevant information.
 *
 */
export class PaginatedStepsList extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(stepType),
    archive: archiveType.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { steps, archive } = this.props

    return (
      <div>
        <Segment raised>
          <Label color="blue" ribbon>
            Steps
          </Label>
          <StepsList steps={steps} archive={archive} />
        </Segment>
      </div>
    )
  }
}
