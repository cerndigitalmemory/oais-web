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
    }
    this.updateAll = this.updateAll.bind(this)
  }


  loadRecords = async (page = 1) => {
    const stagedArchives = await api.stagedArchives()
    try {
      if (stagedArchives) {
        const detailedResponse = await api.get_archive_details(stagedArchives)
        this.setState({
          stagedArchives: detailedResponse,
          totalStagedArchives: stagedArchives.length,
        })
      }
    } catch (e) {
      sendNotification('Error while fetching stagedArchives', e.message)
    }
  }

  componentDidMount() {
    this.loadRecords()
    this.setState({ loading: false })
  }

  updateAll = () => {
    this.loadRecords()
  }

  setLoading = () => this.setState({loading : !this.state.loading})

  render() {
    const { user } = this.context
    const { loading, page, totalStagedArchives, stagedArchives } = this.state

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
          />
        )}
      </React.Fragment>
    )
  }
}
