import {createSlice} from '@reduxjs/toolkit'

const appDialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        open: false,
        options: {
            children: 'Hi',
            buttons: null
        },
    },
    reducers: {
        openDialog: (state, action) => {
            state.open = true
            state.options = action.payload
        },
        closeDialog: (state, action) => {
            state.open = false
        },
    },
})

export const {openDialog, closeDialog} = appDialogSlice.actions

export default appDialogSlice.reducer
