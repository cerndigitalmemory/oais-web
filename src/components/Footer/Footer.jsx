import React from 'react'
import {
  Container,
  Grid,
  Segment,
  Header,
  List,
  Divider,
  Image,
} from 'semantic-ui-react'

export class Footer extends React.Component {
  render() {
    return (
      <Segment
        vertical
        style={{
          position: 'relative',
        }}
      >
        <Segment
          inverted
          vertical
          style={{
            position: 'absolute',
            bottom: '0px',
            width: '100%',
            height: '120px',
            z_index: '100',
          }}
        >
          <Container textAlign="center">
            <Grid inverted columns={3}>
              <Grid.Column textAlign="left" verticalAlign="middle" width={7}>
                <List horizontal inverted link size="small">
                  <List.Item as="a" href="https://copyright.web.cern.ch">
                    Copyright © 2022 CERN
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column textAlign="center" verticalAlign="middle" width={2}>
                <Image
                  size="tiny"
                  src="https://digital-memory-project.web.cern.ch/themes/custom/cern-theme/logo.svg"
                />
              </Grid.Column>
              <Grid.Column textAlign="right" verticalAlign="middle" width={7}>
                <div className="branded-title">CERN Digital Memory Project</div>
              </Grid.Column>
            </Grid>
          </Container>
        </Segment>
      </Segment>
    )
  }
}
