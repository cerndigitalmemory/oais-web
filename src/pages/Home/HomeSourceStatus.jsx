import React from 'react'
import {
  Grid,
  List,
  Placeholder,
  Icon,
  Popup,
  Container,
  Table,
} from 'semantic-ui-react'
import { api } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import {
  SourceStatus,
  SourceStatusColor,
  SourceStatusLabel,
  sendNotification,
} from '@/utils.js'
import { Link } from 'react-router-dom'

/**
 * This page is the staging area for archives.
 * When the user selects a record, then on this page they can review the staged records.
 * They can add an archive to an existing collection or create a new one.
 *
 */
export class SourceStatusList extends React.Component {
  static contextType = AppContext.Context

  constructor(props) {
    super(props)
    this.state = {
      loadingSources: true,
      sourceStatus: null,
    }
  }

  componentDidMount() {
    let { isLoggedIn } = this.context
    if (isLoggedIn) {
      this.getSourceStatus()
    }
  }

  getSourceStatus = async () => {
    try {
      const sourceStatus = await api.getSourceStatus()
      this.setState({ sourceStatus: sourceStatus })
    } catch (e) {
      sendNotification(
        'Could not get source configuration status',
        e.message,
        'warning'
      )
    } finally {
      this.setState({ loadingSources: false })
    }
  }

  render() {
    const { loadingSources, sourceStatus } = this.state

    const loadingSegment = (
      <Placeholder>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
    )

    return (
      <>
        {!sourceStatus ? (
          loadingSources ? (
            <div>{loadingSegment}</div>
          ) : (
            <></>
          )
        ) : (
          <Container textAlign="center">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Source</Table.HeaderCell>
                  <Table.HeaderCell>Configuration Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {Object.keys(sourceStatus).map((source, i) => (
                  <Table.Row key={source}>
                    <Table.Cell>{source}</Table.Cell>
                    <Table.Cell>
                      {' '}
                      <Icon
                        name="circle"
                        color={SourceStatusColor[sourceStatus[source]]}
                      />
                      {SourceStatusLabel[sourceStatus[source]]}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Container>
        )}
      </>
    )
  }
}
