import { collectionType } from '@/types.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Segment, Label, List } from 'semantic-ui-react'
import { formatDateTime } from '@/utils.js'
import { Link } from 'react-router-dom'

/**
 * This component shows job information
 */
export class JobInfo extends React.Component {
  static propTypes = {
    job: collectionType,
    id: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { job, id } = this.props

    return (
      <Segment raised>
        <Label color="blue" ribbon>
          Tracking Page
        </Label>
        <h1>Job {id}</h1>
        <List>
          <List.Item>
            <b>Creator: </b> 
            <Link to={`/users/${job.creator.id}`}>
                {job.creator.username}
            </Link>
          </List.Item>
          <List.Item>
            <b>Creation Date: </b> {formatDateTime(job.timestamp)}
          </List.Item>
          <List.Item>
            <b>Last modification: </b>
            {formatDateTime(job.last_modification_date)}
          </List.Item>
        </List>
      </Segment>
    )
  }
}
