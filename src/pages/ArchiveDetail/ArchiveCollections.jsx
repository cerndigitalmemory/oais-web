import { formatDateTime } from '@/utils.js'
import { collectionType, archiveType } from '@/types.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Segment, Label, Accordion, List, Icon, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

/**
 * This component contains a segment with a title
 * which contains a list of each step with all relevant information.
 *
 */
export class ArchiveCollectionsList extends React.Component {
  static propTypes = {
    collections: PropTypes.arrayOf(collectionType),
    archive: archiveType.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { collections, archive } = this.props

    let showCollections
    if (collections) {
      showCollections = (
        <div>
          {collections.map((collection) => (
            <CollectionDetail
              key={collection.id}
              collection={collection}
              archive={archive}
            />
          ))}
        </div>
      )
    } else {
      showCollections = <p>This archive is not in a collection</p>
    }

    return (
      <Segment raised>
        <Label color="blue" ribbon>
          Collections
        </Label>
        <List divided relaxed>
          {showCollections}
        </List>
      </Segment>
    )
  }
}

class CollectionDetail extends React.Component {
  static propTypes = {
    collection: collectionType,
    archive: archiveType.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: -1,
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { collection, archive } = this.props
    const { activeIndex } = this.state

    return (
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          {collection.title} ({collection.id})
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <b>ID: </b> {collection.id}
              </Grid.Column>
              <Grid.Column>
                <b>Description: </b> {collection.description}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={4}>
              <Grid.Column>
                <b>Creator: </b>
                <Link to={`/users/${collection.creator.id}`}>
                  {collection.creator.username}
                </Link>
              </Grid.Column>
              <Grid.Column>
                <b>Creation Date: </b> {formatDateTime(collection.timestamp)}
              </Grid.Column>
              <Grid.Column>
                <b>Last modification: </b>{' '}
                {formatDateTime(collection.last_modification_date)}
              </Grid.Column>
              <Grid.Column>
                <b>Archives: </b> {collection.archives.length}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Accordion.Content>
      </Accordion>
    )
  }
}
