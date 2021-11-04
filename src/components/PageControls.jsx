import PropTypes from "prop-types";
import React from "react";
import { Pagination } from "semantic-ui-react";

export class PageControls extends React.Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleNextPage = (event, {activePage}) => {
    event.preventDefault();
    this.props.onChange(activePage);
  };

  render(){
    return(
      <Pagination 
      ellipsisItem={null}
      firstItem={null}
      lastItem={null}
      onPageChange={this.handleNextPage}
      activePage={this.props.page}
      totalPages={5}
      />
    );
  }

}
