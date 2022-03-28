export class Storage {
  static getUser() {
    return JSON.parse(localStorage.getItem('user'))
  }

  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  static removeUser() {
    localStorage.removeItem('user')
  }
}
