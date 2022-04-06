import _ from 'lodash'
import { getCookie } from '@/utils.js'
import { OverridableContext } from 'react-overridable'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import _truncate from 'lodash/truncate'
import { AppContext } from '@/AppContext.js'
import {
  Button,
  Form,
  Input,
  Label,
  Menu,
  Item,
  Grid,
  Card,
  Container,
  Checkbox,
} from 'semantic-ui-react'
import { StepNameLabel } from '@/utils.js'
import {
  ReactSearchKit,
  ESSearchApi,
  SearchBar,
  onFilterClicked,
  ResultsLoader,
  EmptyResults,
  Error,
  BucketAggregation,
  withState,
} from 'react-searchkit'
import { Results } from '@/pages/Search/Results.jsx'
import { DMSearchAPI } from '@/pages/Search/DMSearchAPI.jsx'
import { ESRequestSerializer } from '@/pages/Search/ESRequestSerializer.jsx'

const OnResults = withState(Results)

const initialState = {
  layout: 'list',
  page: 1,
  size: 10,
}

// The SearchForm function contains the form for the search
const ElasticSearchResultsListItem = ({ result, index }) => {
  return (
    <Item key={index}>
      <Item.Content>
        <Item.Header>
          <Link to={`/archive/${result.id}`} target="_blank">
            {_truncate(result.title, { length: 200 })}
          </Link>
        </Item.Header>
        <Item.Description>
          <Grid columns={2}>
            <Grid.Column width={2}>
              ID: <b>{result.id}</b>
            </Grid.Column>
            <Grid.Column>
              Source: <b>{result.source}</b>
            </Grid.Column>
          </Grid>
        </Item.Description>
        <Item.Extra>
          <a href={result.source_url} target="_blank" rel="noopener noreferrer">
            {result.source_url}
          </a>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

const ElasticSearchResultsGridItem = ({ result, index }) => {
  return (
    <Card fluid key={index}>
      <Card.Content>
        <Card.Header>
          {result.title} ({result.source})
        </Card.Header>
        <Item.Description>{result.source_url}</Item.Description>
      </Card.Content>
    </Card>
  )
}

const stepsAggComp = (containerCmp) => {
  return containerCmp ? (
    <Menu vertical stackable>
      <Menu.Item>
        <Menu.Header>{containerCmp.title}</Menu.Header>
        {containerCmp.containerCmp}
      </Menu.Item>
    </Menu>
  ) : null
}

const stepsAggValuesContainerCmp = (valuesCmp) => (
  <Menu.Menu>{valuesCmp.valuesCmp}</Menu.Menu>
)

const stepsAggValueCmp = (bucket) => {
  let checkboxLabel
  if (bucket.bucket.key_as_string) {
    checkboxLabel =
      bucket.bucket.key_as_string + ' (' + bucket.bucket.doc_count + ')'
  } else if (typeof bucket.keyField === typeof 'String') {
    checkboxLabel = bucket.bucket.key + ' (' + bucket.bucket.doc_count + ')'
  } else {
    checkboxLabel =
      StepNameLabel[bucket.bucket.key] + ' (' + bucket.bucket.doc_count + ')'
  }

  return (
    <Menu.Item
      key={bucket.bucket.key}
      active={bucket.isSelected}
      onClick={() => bucket.onFilterClicked(bucket.bucket.key)}
    >
      <Checkbox label={checkboxLabel}></Checkbox>
    </Menu.Item>
  )
}

const overriddenComponents = {
  'ResultsList.item': ElasticSearchResultsListItem,
  'ResultsGrid.item': ElasticSearchResultsGridItem,
  'BucketAggregation.element': stepsAggComp,
  'BucketAggregationContainer.element': stepsAggValuesContainerCmp,
  'BucketAggregationValues.element': stepsAggValueCmp,
}

export class Search extends React.Component {
  constructor(props) {
    super(props)
  }
  static contextType = AppContext.Context

  render() {
    const { user } = this.context

    const searchApi = new DMSearchAPI({
      axios: {
        url: 'api/opensearch/',
        method: 'POST',
        timeout: 5000,
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'Content-type': 'application/json',
        },
      },
    })

    return (
      <React.Fragment>
        <h1> Internal Search</h1>
        <OverridableContext.Provider value={overriddenComponents}>
          <ReactSearchKit
            searchApi={searchApi}
            initialQueryState={initialState}
          >
            <div style={{ margin: '2em auto', width: '80%' }}>
              <Container>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={16}>
                      <SearchBar />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Grid relaxed style={{ padding: '2em 0' }} stackable>
                  <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                      <Grid.Row>
                        <BucketAggregation
                          title="Source"
                          agg={{ field: 'source', aggName: 'sources' }}
                        />
                        <BucketAggregation
                          title="Restricted"
                          agg={{ field: 'visibility', aggName: 'visibility' }}
                        />
                        <BucketAggregation
                          title="Steps Status"
                          agg={{ field: 'steps.name', aggName: 'steps_name' }}
                        />
                      </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <ResultsLoader>
                        <EmptyResults />
                        <Error />
                        <OnResults />
                      </ResultsLoader>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </div>
          </ReactSearchKit>
        </OverridableContext.Provider>
      </React.Fragment>
    )
  }
}
