import { Storage } from '@/storage.js'
import React from 'react'

class Context {
  constructor() {
    this.Context = React.createContext({})
    this.updateContext = null
  }

  init(updateContext) {
    // set callback to update the global context
    this.updateContext = updateContext

    // initialize the global context
    const user = Storage.getUser()
    const isLoggedIn = !!user
    updateContext({
      user,
      isLoggedIn,
      notifications: [],
      stagedArchives: 0,
    })
  }

  setUser(user) {
    Storage.setUser(user)
    this.updateContext({ user, isLoggedIn: true })
  }

  addNotification(notification) {
    this.updateContext((ctx) => {
      const notifications = ctx.notifications.slice()
      notifications.push(notification)
      return { notifications }
    })
  }

  removeNotification(notification) {
    this.updateContext((ctx) => {
      const notifications = ctx.notifications.filter((n) => n !== notification)
      return { notifications }
    })
  }

  clearNotifications() {
    this.updateContext(() => {
      const notifications = []
      return { notifications }
    })
  }

  logout() {
    Storage.removeUser()
    this.updateContext({
      user: null,
      isLoggedIn: false,
    })
  }

  setStaged(number) {
    this.updateContext({
      staged: number,
    })
  }

  clearStaged() {
    this.updateContext({
      staged: 0,
    })
  }
}

export const AppContext = new Context()
