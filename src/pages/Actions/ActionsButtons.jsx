import { archiveType } from '@/types.js'
import PropTypes from 'prop-types'
import React from 'react'
import { sendNotification } from '@/utils.js'
import { Button, Table, Loader } from 'semantic-ui-react'
import { api } from '../../api'
import { CreateCollection } from '@/components/CreateCollection/CreateCollection.jsx'
import { AddToCollection } from '@/components/AddArchivesToExistingCollection/AddArchivesToExistingCollection.jsx'

export class ActionsButtons extends React.Component {
  static propTypes = {
    checkedArchives: PropTypes.arrayOf(PropTypes.number),
    onArchiveUpdate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  render() {
    const { loading } = this.state
    const { checkedArchives } = this.props

    let createNewCollection
    if (checkedArchives.length == 0) {
      createNewCollection = (
        <Button disabled color="blue">
          Add it to new Tag
        </Button>
      )
    } else {
      createNewCollection = (
        <CreateCollection
          onCollectionCreation={this.props.onArchiveUpdate}
          label="Add it to new Tag"
          defaultArchives={checkedArchives}
          addArchives={false}
        />
      )
    }

    let addToExistingCollection
    if (checkedArchives.length == 0) {
      addToExistingCollection = (
        <Button disabled color="blue">
          Add it to default Tag
        </Button>
      )
    } else {
      addToExistingCollection = (
        <AddToCollection
          onCollectionAddition={this.props.onArchiveUpdate}
          archives={checkedArchives}
          label="Add it to existing Tag"
        />
      )
    }

    return (
      <div>
        {createNewCollection}
        {addToExistingCollection}
      </div>
    )
  }
}
