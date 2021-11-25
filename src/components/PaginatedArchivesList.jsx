import { ArchivesList } from "@/components/ArchivesList.jsx";
import { PageControls } from "@/components/PageControls.jsx";
import { sendNotification } from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";

export class PaginatedArchivesList extends React.Component {
  static propTypes = {
    getArchives: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      archives: [],
      page: 1,
      totalArchives: 0,
    };
  }

  handleArchiveUpdate = (newArchive) => {
    const archives = this.state.archives.map((archive) => {
      if (archive.id === newArchive.id) {
        return newArchive;
      } else {
        return archive;
      }
    });
    this.setState({ archives });
  };

  loadArchives = async (page = 1) => {
    try {
      const { results: archives } = await this.props.getArchives(page);
      const { count : totalArchives } = await this.props.getArchives(page);
      this.setState({ archives, page, totalArchives });
    } catch (e) {
      sendNotification("Error while fetching archives", e.message);
    }
  };

  componentDidMount() {
    this.loadArchives();
  }

  render() {
    const { archives, page, totalArchives } = this.state;
    let pageCount = Math.ceil(totalArchives / 10);

    return (
      <div>
        <ArchivesList
          archives={archives}
          onArchiveUpdate={this.handleArchiveUpdate}
        />
        <div>
          <PageControls page={page} onChange={this.loadArchives} totalPages={pageCount}/>
        </div>
      </div>
    );
  }
}
