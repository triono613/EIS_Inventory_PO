import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { number, string } from 'yup/lib/locale'
import { Contract } from '../../../interfaces/Contract'
import DataSourceResult from '../../../interfaces/DataSourceResult'

export interface LoadParameter {
    queryString: string,
    memberId: number,
    searchText: string
}

export const loadGridData = createAsyncThunk<DataSourceResult, LoadParameter>(
    'memberContract/loadGridData',
    async (param: LoadParameter) => {
        const url = `api/contract/gridPerMember?${param.queryString}`
        const params = {
            memberId: param.memberId,
            searchText: param.searchText,
        }
        console.log('Loading grid.. URL = ' + url)
        const response = await axios.get(url, { params })
        return response.data // this is the payload
    }
)

export const loadData = createAsyncThunk<Contract, string>(
    'memberContract/loadData',
    async (id: string) => {
        const url = `api/contract/${id}`
        console.log('Loading data.. URL = ' + url)
        const response = await axios.get(url)
        console.log('Response.data = ', response.data)
        return response.data // this is the payload
    }
)

interface MemberContractState {
    state: '' | 'loading' | 'loaded' | 'draft',
    data: Contract | null,
    items: { data: Array<any> | null, total: number },
    dataState: {
        take: number,
        skip: number
    }
}

const initialState: MemberContractState = {
    state: '',
    data: null,
    items: { data: new Array<any>(), total: 0 },
    dataState: {
        take: 20,
        skip: 0
    }
}

export const memberContractSlice = createSlice({
    name: 'memberContract',
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
            state.state = 'draft'
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

export const { gridStateChanged, gridPageChanged, userGridLoaded, dataLoading, dataLoaded, newData } = memberContractSlice.actions

export default memberContractSlice.reducer
