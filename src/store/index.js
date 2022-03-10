import { createStore } from 'redux';

const initialState = {
  query: '',
  source: 'cds-test',
  searchById: false,
  checkedRecords: [],
};

// Redux state stores three values: query, source and searchByID
const searchReducer = (state = initialState, action) => {
  // Action to change the value of the query
  if (action.type === 'setQuery') {
    return {
      query: action.query,
      source: state.source,
      searchById: state.searchById,
      checkedRecords: state.checkedRecords,
    };
  }
  // Action to change the value of the source
  if (action.type === 'setSource') {
    return {
      query: state.query,
      source: action.source,
      searchById: state.searchById,
      checkedRecords: state.checkedRecords,
    };
  }
  // Action to toogle the ID search
  if (action.type === 'setID') {
    return {
      query: state.query,
      source: state.source,
      searchById: !state.searchById,
      checkedRecords: state.checkedRecords,
    };
  }

  if (action.type === 'addRecord') {
    /*
      Checks if a record is in the checkedList and if not it appends it
      */
    let new_list = state.checkedRecords.concat(action.record);
    if (state.checkedRecords.length != 0) {
      state.checkedRecords.map((checkedRecord) => {
        if (checkedRecord == action.record) {
          console.log(action.record.recid, ' already in the list!');
          new_list = state.checkedRecords;
        }
      });
    }
    return {
      query: state.query,
      source: state.source,
      searchById: state.searchById,
      checkedRecords: new_list,
    };
  }

  if (action.type === 'removeRecord') {
    /*

      */
    let new_list = [];
    state.checkedRecords.map((uncheckedRecord) => {
      if (uncheckedRecord == action.record) {
        new_list = state.checkedRecords.filter((item) => item != action.record);
      }
    });
    return {
      query: state.query,
      source: state.source,
      searchById: state.searchById,
      checkedRecords: new_list,
    };
  }

  if (action.type === 'removeAll') {
    /*
        Removes all records from the checklist
      */
    return {
      query: state.query,
      source: state.source,
      searchById: state.searchById,
      checkedRecords: [],
    };
  }

  if (action.type === 'addAll') {
    /* 
      For all the records, checks if it is in the checkedList and if not, it adds it 
    */
    const new_list = action.record;
    return {
      query: state.query,
      source: state.source,
      searchById: state.searchById,
      checkedRecords: new_list,
    };
  }

  return state;
};

const store = createStore(searchReducer);

export default store;
