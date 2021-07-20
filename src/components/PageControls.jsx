import PropTypes from "prop-types";
import React from "react";
import { Pagination } from "react-bootstrap";

export class PageControls extends React.Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { page, onChange } = this.props;
    return (
      <Pagination>
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        />
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Next onClick={() => onChange(page + 1)} />
      </Pagination>
    );
  }
}
