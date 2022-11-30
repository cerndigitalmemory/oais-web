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
      sourceStatusArray: null,
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

      // Gets the source status json in the following format:
      // {source1 : value, source2 : value, ...}
      // And transforms is it an array of objects with this format:
      // [{source: source1, value: value}, {source: source2, value: value}, etc]
      let sourceStatusArray = Object.keys(sourceStatus).map((v) => {
        return {
          source: v,
          value: sourceStatus[v]['status'],
          fullName: sourceStatus[v]['name'],
        }
      })
      // sorts the array of sources based on the source key,value
      sourceStatusArray.sort((a, b) => {
        return a.source < b.source ? -1 : 1
      })

      this.setState({ sourceStatusArray: sourceStatusArray })
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
    const { loadingSources, sourceStatusArray } = this.state

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
        {!sourceStatusArray ? (
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
                {sourceStatusArray.map((sourceStatus) => (
                  <Table.Row key={sourceStatus.source}>
                    <Table.Cell>{sourceStatus.fullName}</Table.Cell>
                    <Table.Cell>
                      {' '}
                      <Icon
                        name="circle"
                        color={SourceStatusColor[sourceStatus.value]}
                      />
                      {SourceStatusLabel[sourceStatus.value]}
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
