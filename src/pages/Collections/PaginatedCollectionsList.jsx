import { collectionType } from '@/types.js'
import { CollectionsList } from '@/pages/Collections/CollectionsList.jsx'
import { PageControls } from '@/pages/Collections/PageControls.jsx'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * This component loads the archives and creates the pagination component
 * and the list of the archives.
 */
export class PaginatedCollectionsList extends React.Component {
  static propTypes = {
    loadCollections: PropTypes.func.isRequired,
    collections: PropTypes.arrayOf(collectionType).isRequired,
    page: PropTypes.number.isRequired,
    totalCollections: PropTypes.number,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { collections, page, totalCollections, loadCollections } = this.props
    const collectionsPerPage = 10
    let pageCount = Math.ceil(totalCollections / collectionsPerPage)

    return (
      <div>
        {totalCollections == 0 ? (
          <div> No collections found </div>
        ) : (
          <CollectionsList
            collections={collections}
            onCollectionUpdate={loadCollections}
            page={page}
          />
        )}
        {totalCollections > collectionsPerPage && (
          <PageControls
            page={page}
            onChange={loadCollections}
            totalPages={pageCount}
          />
        )}
      </div>
    )
  }
}
