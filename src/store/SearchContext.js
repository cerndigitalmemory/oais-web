import React from "react";

class Context {
  constructor() {
    this.Context = React.createContext({});
    this.updateContext = null;
  }

  init(updateContext) {

    updateContext({
      query: '',
      searchByID: false,
      source: '',
    });
  }

  setSearch(query, searchID, source){
    this.updateContext({
      query: query,
      searchByID: searchID,
      source: source, 
    })
  }

  clearSearch() {
    this.updateContext({
      query: '',
      searchByID: false,
      source: '', 
    });
  }
}

export const SearchContext = new Context();
