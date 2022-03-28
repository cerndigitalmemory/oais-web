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
    filter: "all"
  }

  
  render() {
    const  {filter}  = this.state

    return (
      <React.Fragment>
        <Grid columns='equal' stackable>
          <Grid.Column><h1>Archives</h1></Grid.Column>
        </Grid>
        
        <PaginatedArchivesList getArchives={(page) => api.archives(page, filter)} filter={filter}/>
      </React.Fragment>
    )
  }
}
