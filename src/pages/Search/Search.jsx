import _ from 'lodash'
import { getCookie } from '@/utils.js'
import { OverridableContext } from 'react-overridable'
import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import _truncate from 'lodash/truncate';
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
} from 'semantic-ui-react'
import {
  ReactSearchKit,
  ESSearchApi,
  SearchBar,
  ResultsList,
  ResultsLoader,
  EmptyResults,
  Error,
  BucketAggregation,
  withState,
} from 'react-searchkit'
import { Results } from '@/pages/Search/Results.jsx';
import { ESRequestSerializer } from '@/pages/Search/ESRequestSerializer.jsx';

const OnResults = withState(Results);

const initialState = {
  layout: 'list',
  page: 1,
  size: 10,
};

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
        <Item.Extra><a href={result.source_url} target="_blank" rel="noopener noreferrer">{result.source_url}</a></Item.Extra>
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

const overriddenComponents = {
  'ResultsList.item': ElasticSearchResultsListItem,
  'ResultsGrid.item': ElasticSearchResultsGridItem,
}

const customAggComp = (title, containerCmp) => {
  return containerCmp ? (
    <Menu vertical stackable>
      <Menu.Item>
        <Menu.Header>{title}</Menu.Header>
        {containerCmp}
      </Menu.Item>
    </Menu>
  ) : null
}

const customAggValuesContainerCmp = (valuesCmp) => (
  <Menu.Menu>{valuesCmp}</Menu.Menu>
)

const customAggValueCmp = (
  bucket,
  isSelected,
  onFilterClicked,
  getChildAggCmps
) => {
  const childAggCmps = getChildAggCmps(bucket)
  return (
    <Menu.Item
      key={bucket.key}
      name={bucket.key}
      active={isSelected}
      onClick={() => onFilterClicked(bucket.key)}
    >
    <Label>{bucket.doc_count}</Label>
      {bucket.key}
      {childAggCmps}
    </Menu.Item>
  )
}

export class Search extends React.Component {
  constructor(props) {
    super(props)
  }
  static contextType = AppContext.Context

  render() {
    const { user } = this.context

    const searchApi = new ESSearchApi({
      axios: {
        url: '/api/search-query/',
        timeout: 5000,
        headers: { 'X-CSRFToken': getCookie('csrftoken')},
      },
      es: {
        requestSerializer: ESRequestSerializer,
      },
    })

    return (
      <React.Fragment>
        <h1> Internal Search</h1>
        <OverridableContext.Provider value={overriddenComponents}>
          <ReactSearchKit searchApi={searchApi} initialQueryState={initialState}>
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
                        agg={{ field: 'source', aggName: 'source_agg' }}
                        renderElement={customAggComp}
                        renderValuesContainerElement={
                          customAggValuesContainerCmp
                        }
                        renderValueElement={customAggValueCmp}
                      />
                      <BucketAggregation
                        title="Visibility"
                        agg={{ field: 'visibility', aggName: 'visibility_agg' }}
                      
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
