export class Storage {
  static getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static removeUser() {
    localStorage.removeItem('user');
  }

  static setRecord (record) {
    const old = JSON.parse(localStorage.getItem('Records'));
    let newArry;
    if (old) {
      newArry = old.concat(record);
    } else {
      newArry = [record];
    }
    localStorage.setItem('Records', JSON.stringify(newArry));
 
  }

  static getRecord (record) {
    const old = JSON.parse(localStorage.getItem('Records'));
    const wantedRecord = old.filter(
      (item) => item.recid === record.recid || item.source === record.source
    );
    return wantedRecord[0]
  }

  static removeRecord (record) {
    const old = JSON.parse(localStorage.getItem('Records'));
    const newArry = old.filter(
      (item) => item.recid !== record.recid || item.source !== record.source
    );
    localStorage.setItem('Records', JSON.stringify(newArry));
  }

  static getAllRecords(page, hits) {
    return JSON.parse(localStorage.getItem('Records'));
  }
}
