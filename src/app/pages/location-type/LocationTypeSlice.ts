import {createSlice, nanoid, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import DataSourceResult from '../../interfaces/DataSourceResult'

export interface LoadParameter {
    queryString: string,
    searchText: string
}

export const loadGridData = createAsyncThunk<DataSourceResult,LoadParameter>(
    'locationType/loadGridData',
    async (param:LoadParameter) => {
        //const url = `api/member/grid?${queryString}&searchText=${searchText}&memberStatus=${memberStatus}`;
        console.log('loadGridData() param = ' + JSON.stringify(param));
        const url = `api/locationType/grid?${param.queryString}`
        const params = {
            searchText: param.searchText,
        }
        console.log('Loading grid.. URL = ' + url)
        const response = await axios.get(url, {params})
        return response.data // this is the payload
    }
)

export const locationTypeSlice = createSlice({
    name: 'locationType',
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
            console.log('gridStateChanged.. action.payload: ' + JSON.stringify(action.payload))
            state.dataState = {...action.payload}
        },
        gridPageChanged(state, action) {
            // payload is pageNumber
            console.log('gridPageChanged.. action.payload: ' + JSON.stringify(action.payload))
            //state.dataState = { ...action.payload };
            state.dataState.skip = (action.payload - 1) * state.dataState.take
        },
        userGridLoaded(state, action) {},
    },
    extraReducers: (builder) => {
        builder.addCase(loadGridData.fulfilled, (state, action) => {
            //console.log("Fullfiled.. payload: " + JSON.stringify(action.payload));
            state.items = action.payload
        })
        // [loadGridData.fulfilled]: (state, action) => {
        //     //console.log("Fullfiled.. payload: " + JSON.stringify(action.payload));
        //     state.items = action.payload
        // },
    },
})

export const {gridStateChanged, gridPageChanged, userGridLoaded} = locationTypeSlice.actions

export default locationTypeSlice.reducer
