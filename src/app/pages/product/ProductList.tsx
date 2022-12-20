import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../../hooks'

import { Grid, GridCellProps, GridColumn, GridDataStateChangeEvent } from '@progress/kendo-react-grid'
import {
    Button,
} from '@progress/kendo-react-buttons'

import { DataResult, State, toDataSourceRequestString } from '@progress/kendo-data-query'
import { openDialog, closeDialog } from '../../shared/components/AppDialog/AppDialogSlice'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash } from '@fortawesome/pro-regular-svg-icons'

import { PageTitle } from '../../../_metronic/layout/core'
import { ContentContainer } from '../../layout/components/ContentContainer'
import { SearchTextBox } from '../../shared/components/SearchTextBox/SearchTextBox'

import { Toolbar } from '../../layout/components/Toolbar'
import { PageContainer } from '../../layout/components/PageContainer'
import { ShowDeleteConfirmation } from '../../shared/components/AppDialog/AppDialog'
import toast from 'react-hot-toast'
import { Product } from '../../interfaces/Product'
import { ProductLoader } from './ProductLoader'
import { Link, useHistory } from 'react-router-dom'

library.add(faEdit, faTrash)

export function ProductList() {
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const history = useHistory();
    const [gridHeight, setGridHeight] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [dataVersion, setDataVersion] = useState(0)

    const [items, setItems] = React.useState<DataResult>({
        data: [],
        total: 0,
    })
    const [dataState, setDataState] = React.useState<State>({
        take: 20,
        skip: 0,
    })

    const initialEditState = {
        visible: false,
        mode: '',
        title: 'Add Product',
        dataId: '',
    }

    const initialDialogState = {}

    const [editState, setEditState] = useState(initialEditState)

    // this effect to set grid height to match the container height
    useEffect(() => {
        const height = document.getElementById('gridContainer')?.clientHeight
        if (height) {
            setGridHeight(height - 1)
        }
    }, [])

  

    function onSearchTextChange(value: string) {
        setSearchText(value)
    }

    function onGridStateChange(e: GridDataStateChangeEvent) {
        setDataState(e.dataState)
    }

    function dataReceived(items: DataResult) {
        if (items.total > dataState.skip!) setItems(items)
        else {
            // calculate page
            let page = Math.floor(items.total / dataState.take!)
            console.log('Change page to ' + page)
            setDataState({ ...dataState, skip: (page - 1) * dataState.take! })
            setDataVersion(dataVersion + 1)
        }
    }

    function reloadGrid() {
        setDataVersion(dataVersion + 1)
    }

    function registerProduct() {
        history.push('/Product/new')
    }

    function handleFormClose() {
        setEditState({ ...editState, visible: false })
    }

    function handleFormSuccess(data: Product) {
        setEditState({ ...editState, visible: false })
        reloadGrid()
        let message = ''
        if (editState.mode === 'add') {
            message = t('DataHasBeenAdded', { data: data.inventory_item_name })
        } else {
            message = t('DataHasBeenUpdated', { data: data.inventory_item_name })
        }
        toast.success(message)
    }

    function handleEditButtonClick(data: any) {
        history.push(`Product/${data.inventory_item_id}`)
    }

    function handleDeleteButtonClick(data: Product) {
        ShowDeleteConfirmation(dispatch, t, t('Products'), data.inventory_item_name, () => {
            handleDeleteConfirm(data)
        })
    }

    function handleDeleteConfirm(data: Product) {
        dispatch(closeDialog(null))
        let loadingMsg = t('DeletingData', { data: data.inventory_item_name })
        let successMsg = t('DataHasBeenDeleted', { data: data.inventory_item_name })
        toast.promise(submitDeletePromise(data), {
            loading: loadingMsg,
            success: (result) => {
                reloadGrid()
                return successMsg
            },
            error: (err) => 'Error',
        })
    }

    function submitDeletePromise(data: Product) {
        let url = `api/inventoryItem/delete/${data.inventory_item_id}`
        // use delay to show deleting animation..
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
        return wait(1500).then(() => {
            return axios.post(url)
        })
    }

    const toolbar = (
        <Button primary={true} onClick={registerProduct} togglable={false}>
            {t('Add')} {t('Products')}
        </Button>
    )

 


    const ProductNameCell = (props: GridCellProps) => {
        let url = '/InventoryItem/' + props.dataItem.id;
        return (
            <td width='250px'>
                <Link to={url}>{props.dataItem.Product_name}</Link>
            </td>
     
        )
    }

    const ProductCodeCell = (props: GridCellProps) => {
        let url = '/InventoryItem/' + props.dataItem.id;
        return (
            <td width='200px'><Link to={url}>{props.dataItem.Product_code}</Link></td>
        )
    }

    const actionCell = (props: GridCellProps) => {
        return (
            <td>
                <div className='d-flex flex-row flex-1 align-items-center justify-content-center gap-2'>
                    <span
                        className='cursor-pointer'
                        onClick={() => handleEditButtonClick(props.dataItem)}
                    >
                        <FontAwesomeIcon icon={['far', 'edit']} />
                    </span>
                    {/* <span
                        className='cursor-pointer'
                        onClick={() => handleDeleteButtonClick(props.dataItem)}
                    >
                        <FontAwesomeIcon icon={['far', 'trash']} />
                    </span> */}
                </div>
            </td>
        )
    }

    return (
        <PageContainer>
            <PageTitle breadcrumbs={[]}>{t('Products')}</PageTitle>
            <Toolbar toolbar={toolbar}></Toolbar>
            <ContentContainer>
                <div className='d-flex align-items-center flex-wrap justify-content-between mt-2 mb-2 w-100'>
                    {/* <!-- left aligned controllers --> */}
                    <div className='d-flex align-items-center mb-3'>
                    <SearchTextBox onChange={onSearchTextChange}></SearchTextBox>
                    </div>
                  
                </div>
                <div id='gridContainer' className='w-100 h-100'>
                    {gridHeight > 0 ? (
                        <Grid
                            filterable={false}
                            sortable={true}
                            pageable={true}
                            scrollable='scrollable'
                            {...dataState}
                            data={items}
                            onDataStateChange={onGridStateChange}
                            style={{ height: `${gridHeight}px` }}
                        >
                            {/* <GridColumn field='inventory_group_id' title={t('InventoryGroupId')}  width='150px'  /> */}
                            <GridColumn field='inventory_item_name' title={t('InventoryItemName')} width='150px' />
                            <GridColumn field='inventory_group_name' title={t('InventoryGroupName')} width='150px' />
                            <GridColumn field='minimum_stock' title={t('InventoryMinStock')} width="100px" />
                            <GridColumn field='sku' title={t('InventoryItemSku')} width='100px' />
                            <GridColumn field='' title={'Stok Awal'} width="70px" />
                            <GridColumn field='' title={'+'} width="70px" />
                            <GridColumn field='' title={'-'} width="70px" />
                            <GridColumn field='' title={'Stok Akhir'} width="70px" />
                      
                            <GridColumn
                                    field='inventory_item_id'
                                    title={t('Menu')}
                                    width='120px'
                                    cell={actionCell}
                                    className='text-center'
                                    headerClassName='text-center'
                                />
                        </Grid>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                     <ProductLoader
                        dataState={dataState}
                        onDataReceived={dataReceived}
                        searchText={searchText}
                        version={dataVersion}  
                        productStatus={null}                   
                         /> 
                </div>
                {/* {editState.visible && (
                    <CustomerForm
                        title={editState.title}
                        mode={editState.mode}
                        dataId={editState.dataId}
                        onClose={handleFormClose}
                        onSuccess={handleFormSuccess}
                    />
                )} */}
            </ContentContainer>
        </PageContainer>
    )
}
