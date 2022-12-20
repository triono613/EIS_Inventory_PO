import React, {useEffect, useState, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import axios from 'axios'

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
import {DataResult, State, toDataSourceRequestString} from '@progress/kendo-data-query'
import {openDialog, closeDialog} from '../../shared/components/AppDialog/AppDialogSlice'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faEdit, faTrash} from '@fortawesome/pro-regular-svg-icons'

import {PageTitle} from '../../../_metronic/layout/core'
import {ContentContainer} from '../../layout/components/ContentContainer'
import {SearchTextBox} from '../../shared/components/SearchTextBox/SearchTextBox'
import { AccessoriesLoader } from './AccessoriesLoader'
import AccessoriesForm from './AccessoriesForm'
import {Toolbar} from '../../layout/components/Toolbar'
import {PageContainer} from '../../layout/components/PageContainer'
import {ShowDeleteConfirmation} from '../../shared/components/AppDialog/AppDialog'
import toast from 'react-hot-toast'
import { DropDownListWithRemoteData } from '../../shared/components/Dropdowns/DropDownListWithRemoteData'
import { ComboBoxWithRemoteData } from '../../shared/components/Dropdowns/ComboBoxWithRemoteData'

library.add(faEdit, faTrash)

export function AccessoriesPage() {
    const {t} = useTranslation('translation')
    const dispatch = useDispatch()
    const [gridHeight, setGridHeight] = useState(0)
    const [accessoriesId, setAccessoriesId] = useState<string|null>(null)
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
        title: 'Add Accessories',
        dataId: 0,
    }

    const initialDialogState = {}

    const [editState, setEditState] = useState(initialEditState)

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
            let page = Math.floor(items.total / dataState.take!)
            console.log('Change page to ' + page)
            setDataState({...dataState, skip: (page - 1) * dataState.take!})
            setDataVersion(dataVersion + 1)
        }
    }

    function reloadGrid() {
        setDataVersion(dataVersion + 1)
    }

    function onFilterAccessoriesIdChange(value:string|null) {
        setAccessoriesId(value)
    }

    function addData() {
        setEditState({
            visible: true,
            mode: 'add',
            title: t('Add') + ' ' + t('Accessories'),
            dataId: 0,
        })
    }

    function handleFormClose() {
        setEditState({ ...editState, visible: false })
    }

    function handleFormSuccess(data: any) {
        setEditState({ ...editState, visible: false })
        reloadGrid()
        let message = ''
        if (editState.mode === 'add') {
            message = t('DataHasBeenAdded', { data: data.accessoriesName })
        } else {
            message = t('DataHasBeenUpdated', { data: data.description })
        }
        toast.success(message)
    }

    function handleEditButtonClick(data: any) {
        setEditState({
            visible: true,
            mode: 'edit',
            title: t('Edit') + ' ' + t('Accessories'),
            dataId: data.accessories_id,
        })
    }

    function handleDeleteButtonClick(data: any) {
        ShowDeleteConfirmation(dispatch, t, t('Accessories'), data.accessoriesName, () => {
            handleDeleteConfirm(data)
        })
    }

    function handleDeleteConfirm(data: any) {
        dispatch(closeDialog(null))
        let loadingMsg = t('DeletingData', { data: data.accessoriesName })
        let successMsg = t('DataHasBeenDeleted', { data: data.accessoriesName })
        toast.promise(submitDeletePromise(data), {
            loading: loadingMsg,
            success: (result) => {
                reloadGrid()
                return successMsg
            },
            error: (err) => 'Error',
        })
    }


    function submitDeletePromise(data: any) {
        let url = `api/accessories/delete/${data.accessories_id}`
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
        return wait(1500).then(() => {
            return axios.post(url)
        })
    }
   

    const toolbar = (
        <Button primary={true} onClick={addData} togglable={false}>
            {t('Add')} {t('Accessories')}   
        </Button>
    )

    const accessoriesIdCell = (props: GridCellProps) => {
        return (
            <td width='200px'><a href='#' onClick={() => handleEditButtonClick(props.dataItem)}  >{props.dataItem.accessories_id}</a></td>
        )
    }
    const accessoriesNameCell = (props: GridCellProps) => {
        return (
            <td width='200px'><a href='#' onClick={() => handleEditButtonClick(props.dataItem)}  >{props.dataItem.accessories_name}</a></td>
        )
    }

    const descriptionCell = (props: GridCellProps) => {
        return (
            <td width='200px'><a href='#' onClick={() => handleEditButtonClick(props.dataItem)}  >{props.dataItem.description}</a></td>
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
                    <span
                        className='cursor-pointer'
                        onClick={() => handleDeleteButtonClick(props.dataItem)}
                    >
                        <FontAwesomeIcon icon={['far', 'trash']} />
                    </span>
                </div>
            </td>
        )
    }

    return (
        <PageContainer>
            <PageTitle breadcrumbs={[]}>{t('Accessories')}</PageTitle>
            <Toolbar toolbar={toolbar}></Toolbar>
            <ContentContainer>
                <div className='d-flex align-items-center flex-wrap justify-content-between mt-2 mb-2 w-100'>
                    {/* <!-- left aligned controllers --> */}
                   
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
                            <GridColumn field='accessories_id' title={t('AccessoriesId')} cell={accessoriesIdCell} width='200px' />
                            <GridColumn field='accessories_name' title={t('AccessoriesName')} cell={accessoriesNameCell} width='200px' />
                            <GridColumn field='description' title={t('Description')} cell={descriptionCell} width='260px' />
                           
                            <GridColumn
                                field='id'
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
                    <AccessoriesLoader
                        dataState={dataState}
                        onDataReceived={dataReceived}
                        accessoriesId={accessoriesId}
                        searchText={searchText}
                        version={dataVersion}
                    />
                </div>
                {editState.visible && (
                    <AccessoriesForm
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
