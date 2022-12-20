import React, {useEffect, useState, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import axios from 'axios'
import {useAppSelector, useAppDispatch} from '../../hooks'

import {Grid, GridCellProps, GridColumn, GridDataStateChangeEvent} from '@progress/kendo-react-grid'
import {
    Button,
    ButtonGroup,
    DropDownButton,
    DropDownButtonItem,
    FloatingActionButton,
    SplitButton,
    SplitButtonItem,
    Chip,
    ChipList,
    ToolbarItem,
} from '@progress/kendo-react-buttons'
import {DropDownList} from '@progress/kendo-react-dropdowns'
import {DataResult, State, toDataSourceRequestString} from '@progress/kendo-data-query'
// import {SubHeader} from '../../layout/components/subheader/SubHeader'
// import {ContentContainer} from '../../layout/components/ContentContainer'
// import SearchTextBox from '../../shared/components/SearchTextBox'
import {openDialog, closeDialog} from '../../shared/components/AppDialog/AppDialogSlice'
// import {addNotification} from '../../shared/helpers/notification'
import {gridStateChanged, gridPageChanged, loadGridData} from './CustomerSlice'
import {LoadParameter} from './CustomerSlice'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faEdit, faTrash} from '@fortawesome/pro-regular-svg-icons'

import {PageTitle} from '../../../_metronic/layout/core'
import {ContentContainer} from '../../layout/components/ContentContainer'
import {SearchTextBox} from '../../shared/components/SearchTextBox/SearchTextBox'
import { CustomerLoader } from './CustomerLoader'
import CustomerForm from './CustomerForm'
import { Customer } from '../../interfaces/Customer'
import {Toolbar} from '../../layout/components/Toolbar'
import {PageContainer} from '../../layout/components/PageContainer'
import {ShowDeleteConfirmation} from '../../shared/components/AppDialog/AppDialog'
import toast from 'react-hot-toast'

library.add(faEdit, faTrash)

export function CustomerPage() {
    const {t} = useTranslation('translation')
    const dispatch = useDispatch()
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
        title: 'Add Customer',
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
            setDataState({...dataState, skip: (page - 1) * dataState.take!})
            setDataVersion(dataVersion + 1)
        }
    }

    function reloadGrid() {
        setDataVersion(dataVersion + 1)
    }

    function addData() {
        setEditState({
            visible: true,
            mode: 'add',
            title: t('Add') + ' ' + t('Customer'),
            dataId: '',
        })
    }

    function handleFormClose() {
        setEditState({...editState, visible: false})
    }

    function handleFormSuccess(data: Customer) {
        setEditState({...editState, visible: false})
        reloadGrid()
        let message = ''
        if (editState.mode === 'add') {
            message = t('DataHasBeenAdded', {data: data.customer_name})
        } else {
            message = t('DataHasBeenUpdated', {data: data.customer_name})
        }
        toast.success(message)
    }

    function hadleEditButtonClick(data: any) {
        setEditState({
            visible: true,
            mode: 'edit',
            title: t('Edit') + ' ' + t('Customer'),
            dataId: data.customer_id,
        })
    }

    function hadleDeleteButtonClick(data: Customer) {
        ShowDeleteConfirmation(dispatch, t, t('Customer'), data.customer_name, () => {
            handleDeleteConfirm(data)
        })
    }

    function handleDeleteConfirm(data: Customer) {
        dispatch(closeDialog(null))
        let loadingMsg = t('DeletingData', { data: data.customer_name})
        let successMsg = t('DataHasBeenDeleted', { data: data.customer_name})
        toast.promise(submitDeletePromise(data), {
            loading: loadingMsg,
            success: (result) => {
                reloadGrid()
                return successMsg
            },
            error: (err) => 'Error',
        })
    }

    function submitDeletePromise(data: Customer) {
        let url = `api/Customer/delete/${data.customer_id}`
        // use delay to show deleting animation..
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
        return wait(1500).then(() => {
            return axios.post(url)
        })
    }

    const toolbar = (
        <Button primary={true} onClick={addData} togglable={false}>
            {t('Add')} {t('Customer')}
        </Button>
    )

    const actionCell = (props: GridCellProps) => {
        return (
            <td>
                <div className='d-flex flex-row flex-1 align-items-center justify-content-center gap-2'>
                    <span
                        className='cursor-pointer'
                        onClick={() => hadleEditButtonClick(props.dataItem)}
                    >
                        <FontAwesomeIcon icon={['far', 'edit']} />
                    </span>
                    <span
                        className='cursor-pointer'
                        onClick={() => hadleDeleteButtonClick(props.dataItem)}
                    >
                        <FontAwesomeIcon icon={['far', 'trash']} />
                    </span>
                </div>
            </td>
        )
    }

    return (
        <PageContainer>
            <PageTitle breadcrumbs={[]}>{t('Customer')}</PageTitle>
            <Toolbar toolbar={toolbar}></Toolbar>
            <ContentContainer>
                <div className='d-flex align-items-center flex-wrap justify-content-between mt-2 mb-2 w-100'>
                    {/* <!-- right aligned controllers --> */}
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
                            style={{height: `${gridHeight}px`}}
                        >
                            <GridColumn field='customer_code' title={t('CustomerCode')} width='150px' />
                            <GridColumn field='customer_name' title={t('CustomerName')} width='250px' />
                            <GridColumn field='customer_address' title={t('CustomerAddress')} width='350px' />
                            <GridColumn field='phone_number' title={t('PhoneNumber')} width='150px' />
                            <GridColumn
                                field='customer_id'
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
                    <CustomerLoader
                        dataState={dataState}
                        onDataReceived={dataReceived}
                        searchText={searchText}
                        version={dataVersion}
                    />
                </div>
                {editState.visible && (
                    <CustomerForm
                        title={editState.title}
                        mode={editState.mode}
                        dataId={editState.dataId}
                        onClose={handleFormClose}
                        onSuccess={handleFormSuccess}
                    />
                )}
            </ContentContainer>
        </PageContainer>
    )
}
