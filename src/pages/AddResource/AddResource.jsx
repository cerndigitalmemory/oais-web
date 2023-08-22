import Harvest from '@/pages/Harvest/Harvest.jsx'
import { UploadSIP } from '@/pages/Upload/UploadSIP.jsx'
import { UploadFolder } from '@/pages/Upload/UploadFolder.jsx'
import { Announce } from '@/pages/Announce/Announce.jsx'
import URLParse from '@/pages/URLParse/URLParse.jsx'
import React from 'react'
import { Grid, Segment, Container, Header } from 'semantic-ui-react'

/**
 * Renders the Add Resource page, containing two parts:
 * the Harvest and the Upload segments
 * The HarvestRedirect component is used to allow redirecting to the search
 * results instead of updating the local state.
 */
export class AddResource extends React.Component {
  render() {
    return (
      /* 
      Returns the HarvestRedirect and the Upload components
    */

      <Grid>
        <Grid.Row>
          <Grid.Column>
            <h1>Add resource</h1>
            <p>
              Here you can find different ways to import data into the platform
              to start its long term preservation process.
            </p>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Segment>
              <Harvest redirectURL="/harvest" />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Segment>
              <URLParse />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Segment>
              <UploadFolder />
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <h1>Advanced features</h1>
            <p>Here are some more advanced workflows to submit your data.</p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Segment>
              <UploadSIP />
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Segment>
              <Announce />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
