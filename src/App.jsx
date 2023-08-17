import { AppContext } from '@/AppContext.js'
import { NavigationBar } from '@/components/Navigation/NavigationBar.jsx'
import { api } from '@/api.js'
import { getNavbarLabels } from '@/utils.js'
import React from 'react'

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    AppContext.init(this.setState.bind(this))
    // This gets the navbar labels after a full refresh (or a new instance)
    // while the user is authenticated (not going through the)
    getNavbarLabels()
  }



  render() {
    const { notifications } = this.state
    console.log(this.state)
    return (
      <AppContext.Context.Provider value={this.state}>
        <div id="app">
          <NavigationBar notifications={notifications} />
        </div>
      </AppContext.Context.Provider>
    )
  }
}
