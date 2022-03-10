import { collectionType } from '@/types.js';
import { CollectionsList } from '@/components/AddArchivesToExistingCollection/CollectionsList.jsx';
import { PageControls } from '@/components/AddArchivesToExistingCollection/PageControls.jsx';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * This component gets the collections and creates a paginated list of the collections.
 */
export class PaginatedCollectionsList extends React.Component {
  static propTypes = {
    loadCollections: PropTypes.func.isRequired,
    collections: PropTypes.arrayOf(collectionType).isRequired,
    addCollection: PropTypes.func.isRequired,
    removeCollection: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    totalCollections: PropTypes.number,
    checked: PropTypes.number,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { checked, collections, page, totalCollections, loadCollections } =
      this.props;
    let pageCount = Math.ceil(totalCollections / 10);

    return (
      <div>
        {totalCollections == 0 ? (
          <div> No collections found </div>
        ) : (
          <CollectionsList
            collections={collections}
            onCollectionUpdate={loadCollections}
            page={page}
            addCollection={this.props.addCollection}
            removeCollection={this.props.removeCollection}
            checked={checked}
          />
        )}

        <div>
          <PageControls
            page={page}
            onChange={loadCollections}
            totalPages={pageCount}
          />
        </div>
      </div>
    );
  }
}
