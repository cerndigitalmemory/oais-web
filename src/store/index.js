import { createStore } from 'redux';

const initialState = { 
    query: "",
    source: "",
    searchById: false,
};

//Redux state stores three values: query, source and searchByID
const searchReducer = (state = initialState, action) => {
    
    // Action to change the value of the query
    if (action.type === 'setQuery') {
      return {
        query: action.query,
        source: state.source,
        searchById: state.searchById,
      };
    }
    // Action to change the value of the source
    if (action.type === 'setSource') {
        return {
          query: state.query,
          source: action.source,
          searchById: state.searchById,
        };
      }
    // Action to toogle the ID search
    if (action.type === 'setID') {
      return {
        query: state.query,
        source: state.source,
        searchById: !state.searchById,
      };
    }

    return state;
  };
  
const store = createStore(searchReducer);

export default store;