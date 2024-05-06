import { createContext, useReducer } from "react";

const INITIAL_STATE2 = {
  city: undefined,
  dates: []
};

export const SearchContextCity = createContext(INITIAL_STATE2);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH2":
      return action.payload;
    case "RESET_SEARCH2":
      return INITIAL_STATE2;
    default:
      return state;
  }
};

export const SearchContextProviderCity =({children}) =>{
    const [state,dispatch] =useReducer(SearchReducer,INITIAL_STATE2)
    return(
        <SearchContextCity.Provider value={{city:state.city,dates:state.dates, dispatch}} >
            {children}
        </SearchContextCity.Provider>
    )
}
