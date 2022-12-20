import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios from 'axios'
import {
    DataResult,
    State,
    toODataString,
    toDataSourceRequestString,
} from '@progress/kendo-data-query'

interface CustomerLoaderProps {
    dataState: State,
    searchText: string,
    version: number,
    onDataReceived: (products: DataResult) => void
}

export const CustomerLoader = (props: CustomerLoaderProps) => {
    const baseUrl = 'https://demos.telerik.com/kendo-ui/service-v4/odata/Products?$count=true&'
    const init = {method: 'GET', accept: 'application/json', headers: {}}

    const lastSuccess = React.useRef<string>('')
    const pending = React.useRef<string>('')

    const requestDataIfNeeded = () => {
        let queryString = toDataSourceRequestString(props.dataState);
        let key = queryString + '|' + props.searchText + '|' + props.version;
        if (pending.current || key === lastSuccess.current) {
            console.log('exit')
            return
        }
        pending.current = key;
        const url = `api/customer/grid?${queryString}`
        const params = {
            searchText: props.searchText,
        };
        axios.get(url, { params })
            .then((response) => {
                lastSuccess.current = pending.current
                pending.current = ''
                if (key === lastSuccess.current) {
                    props.onDataReceived.call(undefined, response.data)
                } else {
                    requestDataIfNeeded()
                }
            });
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
