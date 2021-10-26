// import { api } from "@/api.js";
// import { RecordsList } from "@/components/RecordsList.jsx";
// import { sendNotification } from "@/utils.js";
// import PropTypes from "prop-types";
import { Harvest } from "@/pages/Harvest.jsx";
import {Upload} from "@/pages/Upload.jsx"
import React from "react";
import {
    Grid, Segment,
  } from 'semantic-ui-react'
// import { SearchPagination } from "@/components/SearchPagination.jsx";

export class AddResource extends React.Component {

  render() {

    return(
        
    <Grid>
    <Grid.Row>
      <Grid.Column>
          <Segment>
            <Harvest/>
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

