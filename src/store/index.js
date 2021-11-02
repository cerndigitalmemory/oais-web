import { createStore } from 'redux';

const initialState = { 
    query: "",
    source: "",
    searchById: false,
};

//Redux state stores three values: query, source and searchByID

const searchReducer = (state = initialState, action) => {
    
    if (action.type === 'setQuery') {
      return {
        query: action.query,
        source: state.source,
        searchById: state.searchById,
      };
    }
    if (action.type === 'setSource') {
        return {
          query: state.query,
          source: action.source,
          searchById: state.searchById,
        };
      }
    if (action.type === 'setID') {
      return {
        query: state.query,
        source: state.source,
        searchById: action.searchById,
      };
    }

    return state;
  };
  
const store = createStore(searchReducer);

export default store;