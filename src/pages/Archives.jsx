import { api } from "@/api.js";
import { PaginatedArchivesList } from "@/components/PaginatedArchivesList.jsx";
import React from "react";

export class Archives extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Archives</h1>
        <PaginatedArchivesList getArchives={(page) => api.archives(page)} />
      </React.Fragment>
    );
  }
}
