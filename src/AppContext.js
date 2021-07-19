import { Storage } from "@/storage.js";
import React from "react";

class Context {
  constructor() {
    this.Context = React.createContext({});
    this.updateContext = null;
  }

  init(updateContext) {
    // set callback to update the global context
    this.updateContext = updateContext;

    // initialize the global context
    const user = Storage.getUser();
    const token = Storage.getToken();
    const isLoggedIn = !!user;
    updateContext({
      user,
      token,
      isLoggedIn,
      notifications: [],
    });
  }

  setToken(token) {
    Storage.setToken(token);
    this.updateContext({ token });
  }

  setUser(user) {
    Storage.setUser(user);
    this.updateContext({ user, isLoggedIn: true });
  }

  addNotification(notification) {
    this.updateContext((ctx) => {
      const notifications = ctx.notifications.slice();
      notifications.push(notification);
      return { notifications };
    });
  }

  removeNotification(notification) {
    this.updateContext((ctx) => {
      const notifications = ctx.notifications.filter((n) => n !== notification);
      return { notifications };
    });
  }

  logout() {
    Storage.removeToken();
    Storage.removeUser();
    this.updateContext({
      token: null,
      user: null,
      isLoggedIn: false,
    });
  }
}

export const AppContext = new Context();
