import { api } from '@/api.js'
import { PaginatedArchivesList } from '@/pages/Archives/PaginatedArchivesList.jsx'
import { sendNotification } from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'

export class RecordDetail extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      record: {},
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params
    try {
      const record = await api.record(id)
      this.setState({ record })
    } catch (e) {
      sendNotification(
        'Error while fetching record details',
        e.message,
        'error'
      )
    }
  }

  render() {
    const { id } = this.props.match.params
    const { record } = this.state
    return (
      <React.Fragment>
        <h1>Record {record.id}</h1>
        <h2>
          Record {record.recid} from {record.source}
        </h2>
        <PaginatedArchivesList
          getArchives={(page) => api.archivesByRecord(id, page)}
        />
      </React.Fragment>
    )
  }
}
