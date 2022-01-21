import _ from 'lodash';
import PropTypes from "prop-types";
import { sendNotification } from "@/utils.js";
import { getCookie } from "@/utils.js";
import { OverridableContext } from 'react-overridable';
import React from "react";
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
  BucketAggregation,
} from 'react-searchkit';
import { api } from '../../api';


// The SearchForm function contains the form for the search
const ElasticSearchResultsListItem = ({ result, index }) => {
  return (
    <Item key={index} href={`#`}>
      <Item.Content>
        <Item.Header>
        {result.recid} {result.source}
        </Item.Header>
        <Item.Description>
        {result.source_url} 
        </Item.Description>
      </Item.Content>
    </Item>
  );
};

const ElasticSearchResultsGridItem = ({ result, index }) => {
  return (
    <Card fluid key={index} href={`#`}>
      <Card.Content>
        <Card.Header>
          {result.recid} {result.source}
        </Card.Header>
        <Item.Description>
        {result.source_url} 
        </Item.Description>
      </Card.Content>
    </Card>
  );
};

const overriddenComponents = {
  'ResultsList.item': ElasticSearchResultsListItem,
  'ResultsGrid.item': ElasticSearchResultsGridItem,
};

const customAggComp = (title, containerCmp) => {
  return containerCmp ? (
    <Menu vertical>
      <Menu.Item>
        <Menu.Header>{title}</Menu.Header>
        {containerCmp}
      </Menu.Item>
    </Menu>
  ) : null;
};

const customAggValuesContainerCmp = (valuesCmp) => (
  <Menu.Menu>{valuesCmp}</Menu.Menu>
);

const customAggValueCmp = (
  bucket,
  isSelected,
  onFilterClicked,
  getChildAggCmps
) => {
  const childAggCmps = getChildAggCmps(bucket);
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
  );
};

export class Search extends React.Component {
  constructor(props) {
    super(props);
  }



  render() {

    const searchApi = new ESSearchApi({
        axios: {
          url: 'http://localhost:8000/api/search-query/',
          timeout: 5000,
          headers: { "X-CSRFToken" : getCookie("csrftoken") },
        }
      });


    return ( 
        <React.Fragment>

    
        <h1> Internal Search</h1>
        <OverridableContext.Provider value={overriddenComponents}>
        <ReactSearchKit searchApi={searchApi}>
            <div style={{ margin: '2em auto', width: '80%' }}>
              <Container>
              <Grid>
              <Grid.Row>
                <Grid.Column width={3} />
                <Grid.Column width={10}>
                  <SearchBar />
                </Grid.Column>
                <Grid.Column width={3} />
              </Grid.Row>
            </Grid>
            <Grid relaxed style={{ padding: '2em 0' }}>
              <Grid.Row columns={2}>
              <Grid.Column width={4}>
                <BucketAggregation
                      title="Source"
                      agg={{ field: 'source', aggName: 'source_agg' }}
                      renderElement={customAggComp}
                      renderValuesContainerElement={customAggValuesContainerCmp}
                      renderValueElement={customAggValueCmp}
                    />
              </Grid.Column>
              <Grid.Column width={12}>
              <ResultsList/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
              </Container>
            </div>
        </ReactSearchKit>
        </OverridableContext.Provider>
        </React.Fragment>

    );
  }
}
