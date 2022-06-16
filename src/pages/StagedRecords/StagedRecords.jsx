import { api } from '@/api.js'
import { PaginatedRecordsList } from '@/pages/StagedRecords/PaginatedStagedRecordsList.jsx'
import React from 'react'
import { sendNotification } from '@/utils.js'
import { Loader } from 'semantic-ui-react'
import { AppContext } from '@/AppContext.js'
import { Storage } from '@/storage.js'

/**
 * This page is the staging area for archives.
 * It provides a "temporary" (staging) area to prepare / allow the user to select
 * stagedArchives and apply them tags/collections.
 *
 */
export class StagedRecords extends React.Component {
  static contextType = AppContext.Context
  constructor(props) {
    super(props)
    this.state = {
      stagedArchives: [],
      detailedArchives: [],
      totalStagedArchives: 0,
      loading: true,
      page: 1,
      allTags: [],
    }
    this.updateAll = this.updateAll.bind(this)
  }

  loadRecords = async (page) => {
    const { results: stagedArchives, count: totalStagedArchives } =
      await api.stagedArchivesPaginated(page)
    try {
      if (stagedArchives) {
        const detailedResponse = await api.getArchivesDetailed(stagedArchives)
        this.setState({
          stagedArchives: detailedResponse,
          totalStagedArchives: totalStagedArchives,
          page: page,
        })
      } else {
        this.setState({
          stagedArchives: [],
          totalStagedArchives: 0,
          page: 1,
        })
      }
    } catch (e) {
      sendNotification(
        'Error while fetching stagedArchives',
        e.message,
        'error'
      )
    } finally {
      // Update the staged value in the context
      AppContext.setStaged(stagedArchives.length)
    }
  }

  loadTags = async () => {
    try {
      const allTags = await api.getAllTags()
      this.setState({
        allTags: allTags,
      })
    } catch (e) {
      sendNotification('Error while fetching settings', e.message, 'error')
    }
  }

  componentDidMount() {
    this.loadRecords()
    this.loadTags()
    this.setState({ loading: false })
  }

  updateAll = (page = 1) => {
    this.loadRecords(page)
  }

  updateTags = () => {
    this.setState({ loading: true })
    this.loadTags()
    this.setState({ loading: false })
  }

  setLoading = () => this.setState({ loading: !this.state.loading })

  render() {
    const { user } = this.context
    const { loading, page, totalStagedArchives, stagedArchives, allTags } =
      this.state

    let loadingMessage = <p> Loading </p>
    if (loading) {
      loadingMessage = <Loader inverted>Loading</Loader>
    } else {
      loadingMessage = <p> No staged archives</p>
    }

    return (
      <React.Fragment>
        <h1>Staged Records</h1>
        {loading || totalStagedArchives == 0 ? (
          <> {loadingMessage} </>
        ) : (
          <PaginatedRecordsList
            stagedArchives={stagedArchives}
            onArchiveUpdate={this.updateAll}
            totalStagedArchives={totalStagedArchives}
            page={page}
            setLoading={this.setLoading}
            allTags={allTags}
            updateTags={this.loadTags}
          />
        )}
      </React.Fragment>
    )
  }
}
