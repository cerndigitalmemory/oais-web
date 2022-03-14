import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Button,
  Form,
  Input,
  Checkbox,
  Grid,
  GridColumn,
} from 'semantic-ui-react'
import { connect } from 'react-redux'

// The SearchForm function contains the form for the search

class SearchForm extends React.Component {
  static propTypes = {
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeSource: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onSourceChange: PropTypes.func.isRequired,
    hitsPerPage: PropTypes.number.isRequired,
    onSearchByIdChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      source: this.props.activeSource,
      searchById: false,
    }
  }

  // When the component first mounts, we need the state as a placeholder at the query form and the source
  componentDidMount() {
    if (this.props.source && this.props.query) {
      this.setState({
        query: this.props.query,
        source: this.props.source,
        searchById: this.props.searchById,
      })
    }
  }

  handleQueryChange = (event) => {
    this.props.onQueryChange(event.target.value)
    this.setState({ query: event.target.value })
  }

  handleSourceChange = (event, { value }) => {
    this.props.onSourceChange(value)
    this.setState({ source: value })
  }

  handleCheckboxChange = () => {
    this.props.onSearchByIdChange()
    this.setState({ searchById: !this.state.searchById })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (this.state.searchById) {
      this.props.onSearch(this.state.source, this.state.query)
    } else {
      this.props.onSearch(
        this.state.source,
        this.state.query,
        1,
        this.props.hitsPerPage
      )
    }
  }

  render() {
    const { isLoading } = this.props
    const sourceOptions = _.map(this.props.sources, (source) => ({
      key: source,
      text: source,
      value: source,
    }))

    let submitButton
    if (isLoading) {
      // if the search is already in progress, show a spinner
      submitButton = (
        <Button loading primary>
          Loading
        </Button>
      )
    } else {
      submitButton = <Button primary>Search</Button>
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Grid stackable columns={4}>
          <Grid.Column width={6} verticalAlign="middle">
            <Form.Field
              control={Input}
              value={this.state.query}
              onChange={this.handleQueryChange}
              label="Query"
              placeholder="Query"
            />
          </Grid.Column>
          <Grid.Column verticalAlign="bottom" width={2}>
            <Form.Field>
              <Checkbox
                label="Search Record by ID"
                checked={this.props.searchById}
                onChange={this.handleCheckboxChange}
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column verticalAlign="bottom">
            <Form.Select
              label="Source"
              defaultValue={this.props.source}
              onChange={this.handleSourceChange}
              options={sourceOptions}
              placeholder="Source"
            />
          </Grid.Column>
          <Grid.Column verticalAlign="bottom" floated="right">
            {submitButton}
          </Grid.Column>
        </Grid>
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    query: state.query,
    source: state.source,
    searchById: state.searchById,
  }
}

export default connect(mapStateToProps)(SearchForm)
