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
import {gridStateChanged, gridPageChanged, loadGridData} from './LocationTypeSlice'
import {LoadParameter} from './LocationTypeSlice'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faEdit, faTrash} from '@fortawesome/pro-regular-svg-icons'

import {PageTitle} from '../../../_metronic/layout/core'
import {ContentContainer} from '../../layout/components/ContentContainer'
import {SearchTextBox} from '../../shared/components/SearchTextBox/SearchTextBox'
import {LocationTypeLoader} from './LocationTypeLoader'
import LocationTypeForm from './LocationTypeForm'
import {LocationType} from '../../interfaces/LocationType'
import {Toolbar} from '../../layout/components/Toolbar'
import {PageContainer} from '../../layout/components/PageContainer'
import {ShowDeleteConfirmation} from '../../shared/components/AppDialog/AppDialog'
import toast from 'react-hot-toast'

library.add(faEdit, faTrash)

export function LocationTypePage() {
    const {t} = useTranslation('translation')
    const dispatch = useDispatch()
    const locationTypeState = useAppSelector((state) => state.locationType)
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
        title: 'Add Location Type',
        dataId: '',
    }

    const initialDialogState = {}

    const [editState, setEditState] = useState(initialEditState)

    // useEffect(() => {
    //     console.log(
    //         'useEffect() #1.. locationTypeState = ' + JSON.stringify(locationTypeState.dataState)
    //     )
    //     var queryString = toDataSourceRequestString(locationTypeState.dataState)
    //     dispatch(
    //         loadGridData({
    //             queryString: queryString,
    //             searchText: searchText,
    //         })
    //     )
    // }, [dispatch, locationTypeState.dataState, searchText])

    // this effect to set grid height to match the container height
    useEffect(() => {
        console.log('useEffect() #2..')
        const height = document.getElementById('gridContainer')?.clientHeight
        if (height) {
            setGridHeight(height - 1)
        }
    }, [])

    function onSearchTextChange(value: string) {
        console.log('Search text changed: [' + value + ']')
        setSearchText(value)
        //dispatch(gridPageChanged(1))
    }

    function onGridStateChange(e: GridDataStateChangeEvent) {
        console.log('onGridStateChange.. data: ' + JSON.stringify(e.dataState))
        //dispatch(gridStateChanged(e.dataState))
        setDataState(e.dataState)
    }

    function dataReceived(items: DataResult) {
        console.log('dataReceived. total items: ' + items.total + ', skip = ' + dataState.skip)
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
        console.log('reloadGrid()')
        //var queryString = toDataSourceRequestString(locationTypeState.dataState)
        //dispatch(loadGridData({queryString, searchText}))
        setDataVersion(dataVersion + 1)
    }

    function addData() {
        console.log('addData()')
        setEditState({
            visible: true,
            mode: 'add',
            title: t('Add') + ' ' + t('LocationType'),
            dataId: '',
        })
    }

    function handleFormClose() {
        setEditState({...editState, visible: false})
    }

    function handleFormSuccess(data: LocationType) {
        setEditState({...editState, visible: false})
        reloadGrid()
        let message = ''
        if (editState.mode === 'add') {
            message = t('DataHasBeenAdded', {data: data.location_type_name})
        } else {
            message = t('DataHasBeenUpdated', {data: data.location_type_name})
        }
        toast.success(message)
        //addNotification(message, 'success')
    }

    function hadleEditButtonClick(data: any) {
        console.log('hadleEditButtonClick(): ' + JSON.stringify(data))
        setEditState({
            visible: true,
            mode: 'edit',
            title: t('Edit') + ' ' + t('LocationType'),
            dataId: data.location_type_id,
        })
    }

    function hadleDeleteButtonClick(data: LocationType) {
        console.log('hadleDeleteButtonClick(): ' + JSON.stringify(data))
        ShowDeleteConfirmation(dispatch, t, t('LocationType'), data.location_type_name, () => {
            handleDeleteConfirm(data)
        })
        // dispatch(
        //     openDialog({
        //         title: t('DeleteData', {data: t('LocationType')}),
        //         style: {minWidth: 300},
        //         children: (
        //             <React.Fragment>
        //                 <p className='p-10'>
        //                     {t('AreYouSureWantToDeleteData', {data: data.location_type_name})}
        //                 </p>
        //             </React.Fragment>
        //         ),
        //         buttons: (
        //             <React.Fragment>
        //                 <Button
        //                     onClick={() => handleDeleteConfirm(data)}
        //                     primary={true}
        //                     style={{minWidth: 100}}
        //                 >
        //                     {t('Yes')}
        //                 </Button>
        //                 <Button onClick={() => dispatch(closeDialog(null))} style={{minWidth: 80}}>
        //                     {t('Cancel')}
        //                 </Button>
        //             </React.Fragment>
        //         ),
        //     })
        // )
    }

    function handleDeleteConfirm(data: LocationType) {
        console.log('handleDeleteConfirm() ' + JSON.stringify(data))
        dispatch(closeDialog(null))
        let loadingMsg = t('DeletingData', {data: data.location_type_name})
        let successMsg = t('DataHasBeenDeleted', {data: data.location_type_name})
        toast.promise(submitDeletePromise(data), {
            loading: loadingMsg,
            success: (result) => {
                reloadGrid()
                return successMsg
            },
            error: (err) => 'Error',
        })
    }

    function submitDeletePromise(data: LocationType) {
        let url = `api/LocationType/delete/${data.location_type_id}`
        // use delay to show deleting animation..
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
        return wait(1500).then(() => {
            return axios.post(url)
        })
    }

    // function submitDelete(data: LocationType) {
    //     let url = `api/LocationType/delete/${data.location_type_id}`
    //     axios
    //         .post(url)
    //         .then((response) => {
    //             if (response.data.success) {
    //                 dispatch(
    //                     openDialog({
    //                         title: null,
    //                         style: {minWidth: 300},
    //                         children: (
    //                             <div className='p-10'>
    //                                 {t('DataHasBeenDeleted', {data: data.location_type_name})}
    //                             </div>
    //                         ),
    //                         buttons: (
    //                             <Button
    //                                 onClick={() => dispatch(closeDialog(''))}
    //                                 style={{minWidth: 80}}
    //                             >
    //                                 OK
    //                             </Button>
    //                         ),
    //                     })
    //                 )
    //                 reloadGrid()
    //                 // addNotification(
    //                 //     t('DataHasBeenDeleted', {data: data.location_type_name}),
    //                 //     'success'
    //                 // )
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             dispatch(
    //                 openDialog({
    //                     title: null,
    //                     style: {minWidth: 300},
    //                     children: <div className='p-10'>Gagal menghapus data</div>,
    //                     buttons: (
    //                         <Button
    //                             onClick={() => dispatch(closeDialog(''))}
    //                             style={{minWidth: 80}}
    //                         >
    //                             {t('Close')}
    //                         </Button>
    //                     ),
    //                 })
    //             )
    //         })
    // }

    const toolbar = (
        <Button primary={true} onClick={addData} togglable={false}>
            {t('Add')} {t('LocationType')}
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
            <PageTitle breadcrumbs={[]}>{t('LocationTypes')}</PageTitle>
            <Toolbar toolbar={toolbar}></Toolbar>
            <ContentContainer>
                <div className='d-flex align-items-center flex-wrap justify-content-between mt-2 mb-2 w-100'>
                    {/* <!-- left aligned controllers --> */}
                    {/* <div className="d-flex align-items-center mr-10 mb-3">
						<div className=""><span>Status</span></div>
						<div className="ml-5">
							<DropDownList
								data={memberStatusList}
								textField="value"
								dataItemKey="key"
								value={filterMemberStatus}
								onChange={onFilterMemberStatusChange}
							/>
						</div>
					</div> */}
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
                            <GridColumn field='location_type_name' title={t('LocationType')} />
                            <GridColumn field='icon' title={t('Icon')} width='260px' />
                            <GridColumn
                                field='location_type_id'
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
                    <LocationTypeLoader
                        dataState={dataState}
                        onDataReceived={dataReceived}
                        searchText={searchText}
                        version={dataVersion}
                    />
                </div>
                {editState.visible && (
                    <LocationTypeForm
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
