import { PageControls } from "@/components/PageControls.jsx";
import React from "react";

export class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      page: 1,
    };
    this.loadData = this.loadData.bind(this);
  }

  loadData(page = 1) {
    Promise.resolve(this.props.data(page)).then((data) =>
      this.setState({
        data,
        page,
      })
    );
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    const { data, page } = this.state;
    if (data === null) {
      return null;
    }

    return (
      <div>
        {this.props.render(data)}
        <PageControls page={page} onChange={this.loadData} />
      </div>
    );
  }
}
