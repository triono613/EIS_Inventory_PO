import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios from 'axios'
import {
    DataResult,
    State,
    toODataString,
    toDataSourceRequestString,
} from '@progress/kendo-data-query'
import { Customer } from '../../interfaces/Customer'

interface LocationLoaderProps {
    dataState: State
    searchText: string
    customerId: string | null
    version: number
    onDataReceived: (products: DataResult) => void
}

export const LocationLoader = (props: LocationLoaderProps) => {
    const lastSuccess = React.useRef<string>('')
    const pending = React.useRef<string>('')

    const requestDataIfNeeded = () => {
        let queryString = toDataSourceRequestString(props.dataState)
        let key = queryString + '|' + props?.customerId + '|' + props.searchText + '|' + props.version
        console.log(
            'Key = [' +
                key +
                '], Pending.current = [' +
                pending.current +
                '], lastSuccess.current = [' +
                lastSuccess.current +
                ']'
        )
        if (pending.current || key === lastSuccess.current) {
            console.log('exit')
            return
        }
        //pending.current = toODataString(props.dataState)
        console.log('Loading data..')
        pending.current = key
        const url = `api/location/grid?${queryString}`
        const params = {
            searchText: props.searchText,
        }
        axios
            .get(url, {params})
            //fetch(baseUrl + pending.current, init)
            //.then((response) => response.json())
            .then((response) => {
                console.log('Response.data: ' + JSON.stringify(response.data))
                lastSuccess.current = pending.current
                pending.current = ''
                console.log(
                    'Key = [' + key + '], lastSuccess.current = [' + lastSuccess.current + ']'
                )
                if (key === lastSuccess.current) {
                    props.onDataReceived.call(undefined, response.data)
                } else {
                    requestDataIfNeeded()
                }
            })
    }

    requestDataIfNeeded()
    return pending.current ? <LoadingPanel /> : null
}

const LoadingPanel = () => {
    const loadingPanel = (
        <div className='k-loading-mask'>
            <span className='k-loading-text'>Loading</span>
            <div className='k-loading-image' />
            <div className='k-loading-color' />
        </div>
    )

    const gridContent = document && document.querySelector('.k-grid-content')
    return gridContent ? ReactDOM.createPortal(loadingPanel, gridContent) : loadingPanel
}
