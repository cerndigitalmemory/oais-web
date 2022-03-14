import { api } from '@/api.js'
import { PaginatedArchivesList } from '@/pages/Archives/PaginatedArchivesList.jsx'
import { sendNotification } from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'

export class UserDetail extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      user: {},
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params
    try {
      const user = await api.user(id)
      this.setState({ user })
    } catch (e) {
      sendNotification('Error while fetching user details', e.message)
    }
  }

  render() {
    const { id } = this.props.match.params
    const { user } = this.state
    return (
      <React.Fragment>
        <h1>
          User {user.id} ({user.username})
        </h1>
        <PaginatedArchivesList
          getArchives={(page) => api.archivesByUser(id, page)}
        />
      </React.Fragment>
    )
  }
}
