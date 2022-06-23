import { api } from '@/api.js'
import React from 'react'
import { Grid, Button, Loader } from 'semantic-ui-react'
import { PaginatedJobsList } from '@/pages/Jobs/PaginatedJobsList.jsx'
import { sendNotification } from '@/utils.js'

/**
 * This is a page to display all the current jobs running.
 */
export class Jobs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true, // Shows a loading spinner till the settings are fetched from the API call
      jobs: null,
      page: 1,
      totalJobs: 0,
    }

    this.loadJobs = this.loadJobs.bind(this)
  }

  getJobs = (page, internal) => api.collections(page, internal)

  loadJobs = async (page) => {
    try {
      const internal = true
      const { results: jobs, count: totalJobs } = await this.getJobs(
        page,
        internal
      )
      this.setState({
        jobs: jobs,
        page: page,
        totalJobs: totalJobs,
      })
    } catch (e) {
      sendNotification('Error while loading jobs', e.message, 'error')
    } finally {
      this.setState({ loading: false })
    }
  }

  componentDidMount() {
    this.loadJobs(this.state.page)
  }

  updateJobs = (page = this.state.page) => {
    this.setState({ loading: true })
    this.loadJobs(page)
  }

  render() {
    const { jobs, loading, page, totalJobs } = this.state

    const loadingSpinner = <Loader active inline="centered" />

    return (
      <React.Fragment>
        {loading ? (
          <div> {loadingSpinner} </div>
        ) : (
          <div>
            <Grid>
              <Grid.Row>
                <Grid.Column floated="left" width={10}>
                  <h1>Current Jobs</h1>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <br />
            {!jobs ? (
              <p>There are no jobs</p>
            ) : (
              <PaginatedJobsList
                loadJobs={this.updateJobs}
                jobs={jobs}
                page={page}
                totalJobs={totalJobs}
              />
            )}
          </div>
        )}
      </React.Fragment>
    )
  }
}
