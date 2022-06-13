import { api } from '@/api.js'
import { PaginatedArchivesList } from '@/pages/Actions/ActionsPaginatedArchivesList.jsx'
import { ActionsButtons } from '@/pages/Actions/ActionsButtons.jsx'
import React from 'react'
import { sendNotification } from '@/utils.js'
import { Loader } from 'semantic-ui-react'
import { AppContext } from '@/AppContext.js'

/**
 * This page is the staging area for archives.
 * It allows the user to select archives and apply them tags/collections.
 *
 */
export class Actions extends React.Component {
  static contextType = AppContext.Context
  constructor(props) {
    super(props)
    this.state = {
      archives: [],
      detailedArchives: [],
      loading: true,
      checkedArchives: [],
      page: 1,
      totalArchives: 0,
    }
    this.updateAll = this.updateAll.bind(this)
  }

  loadArchives = async (page = 1) => {
    const { user } = this.context
    try {
      const { results: archives, count: totalArchives } =
        await api.archivesByUserStaged(user.id, page)
      const detailedArchives = await api.getArchivesDetailed(archives)
      this.setState({
        archives,
        page,
        totalArchives,
        detailedArchives: detailedArchives,
      })
    } catch (e) {
      sendNotification('Error while fetching archives', e.message, 'error')
    }
  }

  componentDidMount() {
    this.loadArchives()
    this.setState({ loading: false })
  }

  updateAll = () => {
    this.setState({ loading: true })
    this.loadArchives()
    this.setState({ loading: false })
  }

  checkArchiveAdd = (archive) => {
    const checkedArchives = this.state.checkedArchives
    let new_list = checkedArchives.concat(archive.id)
    if (checkedArchives.length != 0) {
      checkedArchives.map((checkedRecord) => {
        if (checkedRecord == archive) {
          console.log(archive.recid, ' already in the list!')
          new_list = checkedArchives
        }
      })
    }
    this.setState({ checkedArchives: new_list })
  }

  checkArchiveRemove = (archive) => {
    const checkedArchives = this.state.checkedArchives
    let new_list = []
    checkedArchives.map((uncheckedRecord) => {
      if (uncheckedRecord == archive.id) {
        new_list = checkedArchives.filter((item) => item != archive.id)
      }
    })
    this.setState({ checkedArchives: new_list })
  }

  render() {
    const { user } = this.context
    const {
      archives,
      detailedArchives,
      loading,
      totalArchives,
      page,
      checkedArchives,
    } = this.state

    const loadingSpinner = <Loader inverted>Loading</Loader>

    return (
      <React.Fragment>
        <h1>Select Action ({user.username})</h1>
        {loading || totalArchives == 0 ? (
          <div> {loadingSpinner} </div>
        ) : (
          <PaginatedArchivesList
            archives={archives}
            detailedArchives={detailedArchives}
            onArchiveUpdate={this.loadArchives}
            checkArchiveAdd={this.checkArchiveAdd}
            checkArchiveRemove={this.checkArchiveRemove}
            totalArchives={totalArchives}
            page={page}
          />
        )}
        <ActionsButtons
          checkedArchives={checkedArchives}
          onArchiveUpdate={this.loadArchives}
        ></ActionsButtons>
      </React.Fragment>
    )
  }
}
