import {createSlice, nanoid, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import DataSourceResult from '../../interfaces/DataSourceResult'

export interface LoadParameter {
    queryString: string
    searchText: string
}
