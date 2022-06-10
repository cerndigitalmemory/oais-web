import PropTypes from 'prop-types'
import React from 'react'
import { Pagination, Icon } from 'semantic-ui-react'

export class PageControls extends React.Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
  }

  handleNextPage = (event, { activePage }) => {
    event.preventDefault()
    this.props.onChange(activePage)
  }

  render() {
    return (
      <Pagination
        onPageChange={this.handleNextPage}
        activePage={this.props.page}
        totalPages={this.props.totalPages}
        firstItem={{ content: <Icon name="angle double left" />, icon: true }}
        lastItem={{ content: <Icon name="angle double right" />, icon: true }}
        prevItem={{ content: <Icon name="angle left" />, icon: true }}
        nextItem={{ content: <Icon name="angle right" />, icon: true }}
      />
    )
  }
}
