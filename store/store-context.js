import {createContext, useReducer} from "react";

export const StoreContext = createContext();


export const ACTION_TYPES = {
    SET_LATLONG: `SET_LATLONG`,
    SET_COFFEE_STORES: `SET_COFFEE_STORES`
}

const storeReducer = (state, action) => {

    switch (action.type) {
        case ACTION_TYPES.SET_LATLONG:

            return {
                ...state,
                latLong: action.payload
            }

        case ACTION_TYPES.SET_COFFEE_STORES:
            return {
                ...state,
                coffeeStoresFromContext: action.payload
            }

        default:
            throw new Error(`Unhandled action type:${action.type} `)

    }

}

const StoreProvider = ({children}) => {
    const initialState = {
        latLong: "",
        coffeeStoresFromContext: []
    }
    const [state, dispatch] = useReducer(storeReducer, initialState);

    return (<StoreContext.Provider value={{state, dispatch}}>
        {children}
    </StoreContext.Provider>)
}

export default StoreProvider;