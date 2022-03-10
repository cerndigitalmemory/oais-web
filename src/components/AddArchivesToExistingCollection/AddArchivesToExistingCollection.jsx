import { api } from '@/api.js';
import React from 'react';
import PropTypes from 'prop-types';
import { collectionType, archiveType } from '@/types.js';
import { Loader, Button, Modal } from 'semantic-ui-react';
import { PaginatedCollectionsList } from '@/components/AddArchivesToExistingCollection/AddPaginatedCollectionsList.jsx';
import { sendNotification } from '@/utils.js';

/**
 * This component adds archives to a collection from the archive side.
 * For a specific archive or archives, opens a modal with paginated collections
 * The user can then select in which collection to add the archive.
 *
 */

export class AddToCollection extends React.Component {
  static propTypes = {
    onCollectionAddition: PropTypes.func, // a function to call after the archive has been added to a collection
    archives: PropTypes.arrayOf(PropTypes.number), // an array of selected archives which will be added to the collection
    label: PropTypes.string, // the label of the modal button
  };

  constructor(props) {
    super(props);
    this.state = {
      collectionsToAdd: [], // a list to store all the checked collections
      collections: [], // stores all the collections loaded
      open: false, // when true then the modal is rendered
      loading: true, // when true then a spinner is rendered as long as the data from the api are fetched
      page: 1,
      totalCollections: 0,
      checked: null,
      label: 'Add to Collection',
    };
  }

  getCollections = (page) => api.collections(page);

  addArchivesToCollection = (id, archives) =>
    api.add_archives_to_collection(id, archives);

  loadCollections = async (page) => {
    try {
      const { results: collections, count: totalCollections } =
        await this.getCollections(page);
      this.setState({
        collections: collections,
        page: page,
        totalCollections: totalCollections,
      });
    } catch (e) {
      sendNotification('Error while loading collections', e.message);
    }
  };

  loadLabel() {
    if (this.props.label) {
      this.setState({ label: this.props.label });
    }
  }

  componentDidMount() {
    /**
     * When the component is mounted, we still don't have the data from the api call
     * so the loading state should be set to true. After the data has been fetched, then
     * the loading is set to false and the collection data are rendered
     */
    this.loadCollections(this.state.page);
    this.loadLabel();
    this.setState({ loading: false });
  }

  setOpen = (value) => {
    this.setState({ open: value });
  };

  addCollection = (collection) => {
    this.setState({ collectionsToAdd: collection, checked: collection.id });
  };

  removeCollection = (collection) => {
    this.setState({ collectionsToAdd: null, checked: null });
  };

  handleCollectionsAdd = () => {
    const collectionsToAdd = this.state.collectionsToAdd;
    this.addArchivesToCollection(collectionsToAdd.id, this.props.archives);
    this.props.onCollectionAddition();
    this.setOpen(false);
  };

  render() {
    const {
      open,
      label,
      page,
      checked,
      totalCollections,
      collections,
      loading,
    } = this.state;

    const loadingSpinner = <Loader active inline="centered" />;

    return (
      <Modal
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
        open={open}
        trigger={<Button color="blue">{label}</Button>}
      >
        <Modal.Header>Choose the collection to add the archives</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {loading ? (
              <div> {loadingSpinner} </div>
            ) : (
              <PaginatedCollectionsList
                loadCollections={this.loadCollections}
                addCollection={this.addCollection}
                removeCollection={this.removeCollection}
                collections={collections}
                page={page}
                totalCollections={totalCollections}
                checked={checked}
              />
            )}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => this.setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            content="Add to Collection"
            labelPosition="right"
            icon="checkmark"
            onClick={this.handleCollectionsAdd}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
