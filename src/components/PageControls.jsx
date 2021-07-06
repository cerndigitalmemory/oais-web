import React from "react";

export class PageControls extends React.Component {
  render() {
    const { page, onChange } = this.props;
    return (
      <div>
        <button onClick={() => onChange(page - 1)}>Prev</button>
        <span>Page: {page}</span>
        <button onClick={() => onChange(page + 1)}>Next</button>
      </div>
    );
  }
}
