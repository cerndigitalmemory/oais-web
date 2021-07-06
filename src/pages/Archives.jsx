import { api } from "@/api.js";
import { ArchivesList } from "@/components/ArchivesList.jsx";
import { Pagination } from "@/components/Pagination.jsx";
import React from "react";

export class Archives extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Archives</h1>
        <Pagination
          data={(page) => api.archives(page)}
          render={({ results }) => <ArchivesList archives={results} />}
        />
      </React.Fragment>
    );
  }
}
