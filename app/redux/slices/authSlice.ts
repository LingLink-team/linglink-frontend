import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TokenPayload {
    accessToken: string,
    refreshToken: string
}

export interface UserInfor {
    avatar: string,
    name: string,
    email: string,
    _id: string,
}

export interface IAuthState {
    userinfor: UserInfor;
    accessToken: string;
    refreshToken: string;
}

const initialState: IAuthState = {
    userinfor: {
        avatar: "",
        name: "",
        email: "",
        _id: ""
    },
    accessToken: "",
    refreshToken: ""
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<TokenPayload>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken
        },
        setInfor: (state, action: PayloadAction<UserInfor>) => {
            state.userinfor = action.payload;
        },
        deleteInfor: (state) => {
            state.userinfor = {
                avatar: "",
                name: "",
                email: "",
                _id: ""
            };
        },
    },
});

// Action creators are generated for each case reducer function
export const { setToken, setInfor, deleteInfor } = authSlice.actions;

export const authReducer = authSlice.reducer;