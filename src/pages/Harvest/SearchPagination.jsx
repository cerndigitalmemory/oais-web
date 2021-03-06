import PropTypes from 'prop-types'
import React from 'react'
import { Pagination, Icon } from 'semantic-ui-react'

export class SearchPagination extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    hasResults: PropTypes.bool.isRequired,
    activePage: PropTypes.number.isRequired,
    totalNumHits: PropTypes.number,
    hitsPerPage: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
  }

  handleNextPage = (event, { activePage }) => {
    event.preventDefault()
    this.props.onSearch(
      this.props.source,
      this.props.query,
      activePage,
      this.props.hitsPerPage
    )
  }

  render() {
    let totalNum = this.props.totalNumHits == null ? 0 : this.props.totalNumHits
    let pageCount = Math.ceil(totalNum / this.props.hitsPerPage)

    return (
      <div>
        {this.props.hasResults || this.props.activePage > 1 ? (
          <Pagination
            onPageChange={this.handleNextPage}
            activePage={this.props.activePage}
            totalPages={pageCount}
            firstItem={{
              content: <Icon name="angle double left" />,
              icon: true,
            }}
            lastItem={{
              content: <Icon name="angle double right" />,
              icon: true,
            }}
            prevItem={{ content: <Icon name="angle left" />, icon: true }}
            nextItem={{ content: <Icon name="angle right" />, icon: true }}
          />
        ) : null}
      </div>
    )
  }
}
