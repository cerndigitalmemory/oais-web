import { App } from "@/App.jsx";
import "@/style.css";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store/index';

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
        <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
