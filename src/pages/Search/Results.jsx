/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { Count, Pagination, ResultsList } from 'react-searchkit'

export class Results extends Component {
  render() {
    const { total } = this.props.currentResultsState.data
    return total ? (
      <>
        <Grid relaxed>
          <Grid.Column width={3}>
            <span style={({ marginLeft: '0.5em' }, { marginRight: '0.5em' })}>
              <Count label={(cmp) => <>Found {cmp}</>} />
            </span>
          </Grid.Column>
        </Grid>
        <Grid relaxed style={{ padding: '2em 0' }}>
          <ResultsList />
        </Grid>
        <Grid relaxed verticalAlign="middle" textAlign="center">
          <Pagination />
        </Grid>
      </>
    ) : null
  }
}

Results.propTypes = {}

Results.defaultProps = {}
