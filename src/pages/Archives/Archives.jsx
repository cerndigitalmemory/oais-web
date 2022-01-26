import { api } from '@/api.js';
import { PaginatedArchivesList } from '@/pages/Archives/PaginatedArchivesList.jsx';
import React from 'react';

/**
 * This page shows a list of all the harvested archives including information like:
 * Archive ID, Record ID + source, Creation Date, Last completed Step, Next Step, See Steps
 */
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
