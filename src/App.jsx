import { AppContext } from '@/AppContext.js'
import { NavigationBar } from '@/components/Navigation/NavigationBar.jsx'
import React from 'react'

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    AppContext.init(this.setState.bind(this))
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
