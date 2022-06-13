import { AppContext } from '@/AppContext.js'
import { NavigationBar } from '@/components/Navigation/NavigationBar.jsx'
import { api } from '@/api.js'
import React from 'react'

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    AppContext.init(this.setState.bind(this))
    this.getNavbarLabels()
  }

  getNavbarLabels = async () => {
    // Gets the staged records and populates the label above the staged records menu when the page is loaded
    const archiveLables = await api.getArchiveLabelInfo()

    if (archiveLables) {
      AppContext.setStaged(archiveLables.staged)
    } else {
      AppContext.setStaged(0)
    }
  }

  render() {
    const { notifications } = this.state

    return (
      <AppContext.Context.Provider value={this.state}>
        <div id="app">
          <NavigationBar notifications={notifications} />
        </div>
      </AppContext.Context.Provider>
    )
  }
}
