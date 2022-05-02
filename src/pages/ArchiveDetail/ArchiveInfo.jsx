import { collectionType, archiveType } from '@/types.js'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import React from 'react'
import { Segment, Label, List, Grid, Button } from 'semantic-ui-react'
import { AddTagsToArchives } from '@/components/AddTagsToArchivesDropdown/AddTagsToArchives.jsx'
/**
 * This component shows the general archive information
 * Gets the archive object and the ID as props and returns a header with the archive id
 * and a list of the basic information (source, recid, link)
 */
export class ArchiveInfo extends React.Component {
  static propTypes = {
    archive: archiveType,
    id: PropTypes.string.isRequired,
    onCollectionUpdate: PropTypes.func.isRequired,
    collections: PropTypes.arrayOf(collectionType),
  }

  constructor(props) {
    super(props)
    this.state = {
      isRedirect: false,
    }
  }

  handleRedirect = async () => {
    // Handles the redirect state to the edit manifests page
    this.setState({ isRedirect: true })
  }

  render() {
    const { archive, id, collections } = this.props
    const { isRedirect } = this.state

    let submitButton
    if (isRedirect) {
      submitButton = <Redirect to={`/edit-archive/${archive.id}`} />
    } else {
      if (archive.last_step) {
        submitButton = (
          <Button primary onClick={this.handleRedirect}>
            Edit manifest
          </Button>
        )
      } else {
        submitButton = (
          <Button primary disabled>
            Edit manifest
          </Button>
        )
      }
    }

    let collectionListItem = (
      <>
        <b>Tags: </b>
        <i>None</i>
      </>
    )
    collectionListItem = (
      <List.Item>
        <b>Tags:</b> <AddTagsToArchives archive={this.props.archive} />
      </List.Item>
    )

    return (
      <Segment raised>
        <Label color="blue" ribbon>
          General Archive Information
        </Label>
        <Grid>
          <Grid.Row>
            <Grid.Column floated="left" width={6}>
              <h1>Record {id}</h1>
            </Grid.Column>
            <Grid.Column floated="right" width={6} textAlign="right">
              {submitButton}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <List>
          <List.Item>
            <b>Source: </b> {archive.source}
          </List.Item>
          <List.Item>
            <b>ID: </b> {archive.recid}
          </List.Item>
          <List.Item>
            <b>Link: </b> <a href={archive.source_url}>{archive.source_url}</a>
          </List.Item>
          {collectionListItem}
        </List>
      </Segment>
    )
  }
}
