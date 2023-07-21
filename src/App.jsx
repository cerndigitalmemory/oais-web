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
    /*
    Let's fetch the staged archives for the user so we can (optionally)
    show the "Staged Archive" menu entry with the number
    */
    const StagedArchivesList = await api.stagedArchives()

    if (StagedArchivesList) {
      AppContext.setStaged(StagedArchivesList.length)
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
