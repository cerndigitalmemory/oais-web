import { api } from '@/api.js'
import React from 'react'
import { Grid, Button, Loader } from 'semantic-ui-react'
import { PaginatedCollectionsList } from '@/pages/Collections/PaginatedCollectionsList.jsx'
import { CreateCollection } from '@/components/CreateCollection/CreateCollection.jsx'
import { sendNotification } from '@/utils.js'

/**
 * TODO
 */
export class Collections extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true, // Shows a loading spinner till the settings are fetched from the API call
      collections: null,
      page: 1,
      totalCollections: 0,
    }

    this.loadCollections = this.loadCollections.bind(this)
  }

  getCollections = (page, internal) => api.collections(page, internal)

  loadCollections = async (page) => {
    try {
      const internal = false
      const { results: collections, count: totalCollections } =
        await this.getCollections(page, internal)
      this.setState({
        collections: collections,
        page: page,
        totalCollections: totalCollections,
      })
    } catch (e) {
      sendNotification('Error while fetching settings', e.message)
    }
  }

  componentDidMount() {
    this.loadCollections(this.state.page)
    this.setState({ loading: false })
  }

  render() {
    const { collections, loading, page, totalCollections } = this.state

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <React.Fragment>
        {loading || !collections ? (
          <div> {loadingSpinner} </div>
        ) : (
          <div>
            <Grid>
              <Grid.Row>
                <Grid.Column floated="left" width={10}>
                  <h1>Collections</h1>
                </Grid.Column>
                <Grid.Column floated="right" width={3} textAlign="right">
                  <CreateCollection
                    onCollectionCreation={this.loadCollections}
                    addArchives={true}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <br />

            <PaginatedCollectionsList
              loadCollections={this.loadCollections}
              collections={collections}
              page={page}
              totalCollections={totalCollections}
            />
          </div>
        )}
      </React.Fragment>
    )
  }
}
