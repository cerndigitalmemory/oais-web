import { App } from '@/App.jsx'
import 'semantic-ui-less/semantic.less'
import '@/style.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/index'

import '@fontsource/inter' // Defaults to weight 400.
import '@fontsource/barlow/500.css' // Defaults to weight 400.
import "@fontsource/jetbrains-mono"; // Defaults to weight 400.

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
