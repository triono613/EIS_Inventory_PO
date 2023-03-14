import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios from 'axios'
import {
    DataResult,
    State,
    toODataString,
    toDataSourceRequestString,
} from '@progress/kendo-data-query'

interface SupplierReturnLoaderProps{
    dataState : State,
    supplierReturnStatus : string|null,
    searchText : string,
    version: number,
    onDataReceived : ( supplierReturn : DataResult) => void
}

export const SupplierReturnLoader = ( props : SupplierReturnLoaderProps) => {
    const baseUrl = 'https://demos.telerik.com/kendo-ui/service-v4/odata/SupplierReturns?$count=true&'
    const init = { method: 'GET', accept: 'application/json', headers: {} }

    const lastSuccess = React.useRef<string>('');
    const pending = React.useRef<string>('');

    const requestDataIfNeeded = () => {
        let queryString = toDataSourceRequestString(props.dataState);
        let key = queryString + '|' + props.supplierReturnStatus + '|' + props.searchText + '|' + props.version;
        if (pending.current || key === lastSuccess.current) {
            console.log('exit')
            return
        }
        pending.current = key;
        const url = `api/InventoryItem/grid?${queryString}`
        //const url = `baseUrl?${queryString}`
        const params = {
            // memberStatus: props.supplierStatus,
            searchText: props.searchText,
        };
        axios.get(url, { params })
            .then((response) => {
                lastSuccess.current = pending.current
                pending.current = ''
                if (key === lastSuccess.current) {
                  
                    console.log('-- response.data InventoryItem: ', response.data)
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