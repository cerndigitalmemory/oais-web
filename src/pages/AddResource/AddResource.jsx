import  HarvestRedirect  from "@/pages/Harvest/HarvestRedirect.jsx";
import {Upload} from "@/pages/Upload/Upload.jsx"
import React from "react";
import {
    Grid, Segment,
  } from 'semantic-ui-react'

export class AddResource extends React.Component {

  render() {

    return(
    /* 
      Returns the HarvestRedirect and the Upload components
    */
    <Grid>
    <Grid.Row>
      <Grid.Column>
          <Segment>
            <HarvestRedirect/>
          </Segment>
      </Grid.Column>
    </Grid.Row>

    <Grid.Row>
      <Grid.Column>
          <Segment>
          <Upload/>
          </Segment>
      </Grid.Column>
    </Grid.Row>
  </Grid>


    )

  }
}

