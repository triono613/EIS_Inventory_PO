import { SupplierReturn } from '../../interfaces/SupplierReturn';
import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { number, string } from 'yup/lib/locale'
import DataSourceResult from '../../interfaces/DataSourceResult'


export interface LoadParameter {
    queryString: string,
    searchText: string
}

export const loadGridData = createAsyncThunk<DataSourceResult, LoadParameter>(
    'InventoryItem/loadGridData',
    async (param: LoadParameter) => {
        const url = `api/InventoryItem/grid?${param.queryString}`
        const params = {
            searchText: param.searchText,
        }
        console.log('Loading grid.. URL = ' + url)
        const response = await axios.get(url, { params })
        return response.data // this is the payload
    }
)

export const loadData = createAsyncThunk<SupplierReturn, string>(
    'InventoryItem/loadData',
    async (param: string) => {
        const url = `api/InventoryItem/${param}`
        console.log('Loading data.. URL = ' + url)
        const response = await axios.get(url)
        return response.data // this is the payload
    }
)

interface supplierReturnState {
    state: '' | 'loading' | 'loaded' | 'new',
    data: SupplierReturn | null,
    items: { data: Array<any> | null, total: number },
    dataState: {
        take: number,
        skip: number
    }
}

const initialState: supplierReturnState = {
    state: '',
    data: null,
    items: { data: new Array<any>(), total: 0 },
    dataState: {
        take: 20,
        skip: 0
    }
}

export const supplierReturnSlice = createSlice({
    name: 'supplierReturn',
    initialState,
    reducers: {
        gridStateChanged(state, action) {
            state.dataState = { ...action.payload }
        },
        gridPageChanged(state, action) {
            // payload is pageNumber
            //state.dataState = { ...action.payload };
            state.dataState.skip = (action.payload - 1) * state.dataState.take
        },
        userGridLoaded(state, action) { },
        dataLoading(state, action) {
            state.state = 'loading'
            state.data = null
        },
        dataLoaded(state, action) {
            state.state = 'loaded'
            state.data = action.payload
        },
        newData(state, action) {
            state.state = 'new'
            state.data = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadGridData.fulfilled, (state, action) => {
            state.items = action.payload
        })
        builder.addCase(loadData.pending, (state, action) => {
            state.state = 'loading'
            state.data = null
        })
        builder.addCase(loadData.fulfilled, (state, action) => {
            state.state = 'loaded'
            state.data = action.payload
        })
        builder.addCase(loadData.rejected, (state, action) => {
            state.state = ''
            state.data = null
        })
    },
})

export const { gridStateChanged, gridPageChanged, userGridLoaded, dataLoading, dataLoaded, newData } = supplierReturnSlice.actions

export default supplierReturnSlice.reducer
