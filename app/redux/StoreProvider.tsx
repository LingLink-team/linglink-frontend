"use client"
import { store } from "./store";
import React from "react"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux"

export const StoreProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const persistor = persistStore(store)
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}