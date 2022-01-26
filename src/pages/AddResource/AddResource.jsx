import HarvestRedirect from '@/pages/Harvest/HarvestRedirect.jsx';
import { Upload } from '@/pages/Upload/Upload.jsx';
import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';

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
            <Segment>
              <HarvestRedirect />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Segment>
              <Upload />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
