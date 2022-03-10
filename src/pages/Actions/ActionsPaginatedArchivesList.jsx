import { ArchivesList } from '@/pages/Actions/ActionsArchivesList.jsx';
import { PageControls } from '@/pages/Actions/PageControls.jsx';
import PropTypes from 'prop-types';
import { archiveType, archiveTypeDetailed } from '@/types.js';
import React from 'react';
import { Loader } from 'semantic-ui-react';

/**
 * This component loads the archives and creates the pagination component
 * and the list of the archives.
 */
export class PaginatedArchivesList extends React.Component {
  static propTypes = {
    archives: PropTypes.arrayOf(archiveType),
    detailedArchives: PropTypes.arrayOf(archiveTypeDetailed),
    onArchiveUpdate: PropTypes.func.isRequired,
    checkArchiveAdd: PropTypes.func.isRequired,
    checkArchiveRemove: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    totalArchives: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      page,
      totalArchives,
      checkArchiveAdd,
      checkArchiveRemove,
      onArchiveUpdate,
      archives,
      detailedArchives,
    } = this.props;
    let pageCount = Math.ceil(totalArchives / 8);

    return (
      <div>
        <ArchivesList
          archives={archives}
          detailedArchives={detailedArchives}
          onArchiveUpdate={onArchiveUpdate}
          checkArchiveAdd={checkArchiveAdd}
          checkArchiveRemove={checkArchiveRemove}
        />

        <div>
          <PageControls
            page={page}
            onChange={onArchiveUpdate}
            totalPages={pageCount}
          />
        </div>
      </div>
    );
  }
}
