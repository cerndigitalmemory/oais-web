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

    let invenioParentID = (
      <>
      </>
    )

    if (archive.resource && archive.resource.invenio_parent_id != null)
      invenioParentID = (
        <List.Item >
          <b>Registry Parent ID: </b> <a href={archive.resource.invenio_parent_url} target="_blank" rel="noopener noreferrer">{archive.resource.invenio_parent_id}</a>
        </List.Item >
      )


    return (
      <Segment raised>
        <Label color="blue" ribbon>
          General information
        </Label>
        <Grid>
          <Grid.Row>
            <Grid.Column floated="left" width={8}>
              <h2>{archive.title}</h2>
            </Grid.Column>
            <Grid.Column floated="right" width={3} textAlign="right">
              {submitButton}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <List>
        <List.Item>
        <b>Record ID: </b> {id}
        </List.Item>
          <List.Item>
            <b>Source: </b> {archive.source}
          </List.Item>
          <List.Item>
            <b>ID: </b> {archive.recid}
          </List.Item>
          <List.Item>
            <b>Link: </b> <a href={archive.source_url} target="_blank" rel="noopener noreferrer">{archive.source_url}</a>
          </List.Item>
          {invenioParentID}
          {collectionListItem}
        </List>
      </Segment >
    )

  }
}
