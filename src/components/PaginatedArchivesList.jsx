import { ArchivesList } from "@/components/ArchivesList.jsx";
import { PageControls } from "@/components/PageControls.jsx";
import React from "react";

export class PaginatedArchivesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      archives: [],
      page: 1,
    };
  }

  handleArchiveUpdate = (newArchive) => {
    const archives = this.state.archives.slice().map((archive) => {
      if (archive.id === newArchive.id) {
        return newArchive;
      } else {
        return archive;
      }
    });
    this.setState({ archives });
  };

  loadArchives = (page = 1) => {
    Promise.resolve(this.props.getArchives(page)).then(({ results }) =>
      this.setState({ archives: results, page })
    );
  };

  componentDidMount() {
    this.loadArchives();
  }

  render() {
    const { archives, page } = this.state;
    return (
      <div>
        <ArchivesList
          archives={archives}
          onArchiveUpdate={this.handleArchiveUpdate}
        />
        <div className="d-flex justify-content-center">
          <PageControls page={page} onChange={this.loadArchives} />
        </div>
      </div>
    );
  }
}
