import { api } from '@/api.js'
import { PaginatedArchivesList } from '@/pages/Archives/PaginatedArchivesList.jsx'
import React from 'react'
import { Grid, Button } from 'semantic-ui-react'

/**
 * This page shows a list of all the harvested archives including information like:
 * Archive ID, Record ID + source, Creation Date, Last completed Step, Next Step, See Steps
 */
export class Archives extends React.Component {
  state = {
    filter: 'all',
  }

  render() {
    const { filter } = this.state

    return (
      <React.Fragment>
        <React.Fragment>
          <h1>Archives</h1>
          <p>
            This page shows the list of your archives. You can browse through
            the created archives and get more details.
          </p>
        </React.Fragment>
        <PaginatedArchivesList
          getArchives={(page) => api.archives(page, filter)}
          filter={filter}
        />
      </React.Fragment>
    )
  }
}
