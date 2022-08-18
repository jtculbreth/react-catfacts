import React, { useContext, useState, createContext } from 'react';

//selected cat context + utils
const CatContext = createContext();
const CatUpdateContext = createContext();

export function useCat(){
    return useContext(CatContext);
}

export function useCatUpdate(){
    return useContext(CatUpdateContext);
}

export function CatProvider({ children }) {
    const [selected, select] = useState();

    return (
        <CatContext.Provider value={selected}>
            <CatUpdateContext.Provider value={select}>
                {children}
            </CatUpdateContext.Provider>
        </CatContext.Provider>
    )
}

//search value context + utils

const SearchContext = createContext();
const SearchUpdateContext = createContext();

export function useSearch(){
    return useContext(SearchContext);
}

export function useSearchUpdate(){
    return useContext(SearchUpdateContext);    
}

export function SearchProvider({children}) {
    const [searchValue, search] = useState();

    return (
        <SearchContext.Provider value = {searchValue}>
            <SearchUpdateContext.Provider value = {search}>
                {children}
            </SearchUpdateContext.Provider>
        </SearchContext.Provider>
    )
}

