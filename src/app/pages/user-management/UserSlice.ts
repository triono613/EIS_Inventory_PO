import {createSlice, nanoid, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import DataSourceResult from '../../interfaces/DataSourceResult'

export interface LoadParameter {
    queryString: string,
    searchText: string
}

export const loadGridData = createAsyncThunk<DataSourceResult,LoadParameter>(
    'user/loadGridData',
    async (param:LoadParameter) => {
        const url = `api/user/grid?${param.queryString}`
        const params = {
            searchText: param.searchText,
        }
        console.log('Loading grid.. URL = ' + url)
        const response = await axios.get(url, {params})
        return response.data // this is the payload
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        selected: undefined,
        items: {data: new Array<any>(), total: 0},
        dataState: {
            take: 20,
            skip: 0,
        },
    },
    reducers: {
        gridStateChanged(state, action) {
            state.dataState = {...action.payload}
        },
        gridPageChanged(state, action) {
            state.dataState.skip = (action.payload - 1) * state.dataState.take
        },
        userGridLoaded(state, action) {},
    },
    extraReducers: (builder) => {
        builder.addCase(loadGridData.fulfilled, (state, action) => {
            state.items = action.payload
        })
    },
})

export const { gridStateChanged, gridPageChanged, userGridLoaded } = userSlice.actions

export default userSlice.reducer
