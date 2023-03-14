import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { getter } from "@progress/kendo-react-common";

import { Grid, 
    GridCellProps, 
    GridColumn, 
    GridDataStateChangeEvent,
    GridSelectionChangeEvent,
    GridKeyDownEvent,
    getSelectedState,
    getSelectedStateFromKeyDown,
    GridSelectableMode, 
} from '@progress/kendo-react-grid'

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
import { DataResult, State, toDataSourceRequestString } from '@progress/kendo-data-query'
import { closeDialog } from '../../shared/components/AppDialog/AppDialogSlice'

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
import { Supplier } from '../../interfaces/Supplier'
import { SupplierLoader } from './SupplierLoader'
import { Link, useHistory } from 'react-router-dom'
import { SelectProductInv } from '../../shared/components/SelectProduct/SelectProductInv'


library.add(faEdit, faTrash)

export function SupplierList() {
    const { t } = useTranslation('translation')
    const dispatch = useDispatch()
    const history = useHistory();
    const [gridHeight, setGridHeight] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [dataVersion, setDataVersion] = useState(0)
    const [pageName, setPageName ] = useState('')
    const [productId, setProductId] = React.useState<string | null>(null)
    
    const [items, setItems] = React.useState<DataResult>({
        data: [],
        total: 0,
    })
    const [dataState, setDataState] = React.useState<State>({
        take: 20,
        skip: 0,
    })

    interface selectionModesType {
        value: GridSelectableMode | undefined;
        label: string;
      }

    const DATA_ITEM_KEY = "supplier_id";
    const SELECTED_FIELD = "selected";
    const idGetter = getter(DATA_ITEM_KEY);
    const selectionModes: selectionModesType[] = [
        { value: "single", label: "Single selection mode" },
        { value: "multiple", label: "Multiple selection mode" },
      ];
       
      const [selectedState, setSelectedState] = React.useState<{
        [id: string]: boolean | number[];
      }>({});
      const [dragEnabled, setDragEnabled] = React.useState<boolean>(true);
      const [cellEnabled, setCellEnabled] = React.useState<boolean>(true);
      const [selectionMode, setSelectionMode] = React.useState<
        GridSelectableMode | undefined
      >(selectionModes[1].value);

      const onSelectionChange = (event: GridSelectionChangeEvent) => {
        const newSelectedState = getSelectedState({
          event,
          selectedState: selectedState,
          dataItemKey: DATA_ITEM_KEY,
        });
        setSelectedState(newSelectedState);
        
    };
    // DATA_ITEM_KEY

    console.log('DATA_ITEM_KEY=', DATA_ITEM_KEY)

      const onKeyDown = (event: GridKeyDownEvent) => {
        const newSelectedState = getSelectedStateFromKeyDown({
          event,
          selectedState: selectedState,
          dataItemKey: DATA_ITEM_KEY,
        });
        setSelectedState(newSelectedState);
      };

    const initialEditState = {
        visible: false,
        mode: '',
        title: 'Add Supplier',
        dataId: '',
    }

   

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
        setPageName('Supplier')
    }

    function registerSupplier() {
        history.push('/supplier/new')
    }

    function handleFormClose() {
        setEditState({ ...editState, visible: false })
    }

    function handleFormSuccess(data: Supplier) {
        setEditState({ ...editState, visible: false })
        reloadGrid()
        let message = ''
        if (editState.mode === 'add') {
            message = t('DataHasBeenAdded', { data: data.supplier_name })
        } else {
            message = t('DataHasBeenUpdated', { data: data.supplier_name })
        }
        toast.success(message)
    }

    function handleEditButtonClick(data: any) {
        history.push(`supplier/${data.supplier_id}`)
    }

    function handleDeleteButtonClick(data: Supplier) {
        ShowDeleteConfirmation(dispatch, t, t('Suppliers'), data.supplier_name, () => {
            handleDeleteConfirm(data)
        })
    }

    function handleDeleteConfirm(data: Supplier) {
        dispatch(closeDialog(null))
        let loadingMsg = t('DeletingData', { data: data.supplier_name })
        let successMsg = t('DataHasBeenDeleted', { data: data.supplier_name })
        toast.promise(submitDeletePromise(data), {
            loading: loadingMsg,
            success: (result) => {
                reloadGrid()
                return successMsg
            },
            error: (err) => 'Error',
        })
    }

    function submitDeletePromise(data: Supplier) {
        let url = `api/Customer/delete/${data.supplier_id}`
        // use delay to show deleting animation..
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
        return wait(1500).then(() => {
            return axios.post(url)
        })
    }

    const toolbar = (
        <Button primary={true} onClick={registerSupplier} togglable={false}>
            {t('Add')} {t('Suppliers')}
        </Button>
    )

 


    const supplierNameCell = (props: GridCellProps) => {
        let url = '/supplier/' + props.dataItem.supplier_id;
        return (
            <td width='250px'>
                <Link to={url}>{props.dataItem.supplier_name}</Link>
            </td>
     
        )
    }

    const supplierCodeCell = (props: GridCellProps) => {
        let url = '/supplier/' + props.dataItem.supplier_code;
        return (
            <td width='200px'><Link to={url}>{props.dataItem.supplier_code}</Link></td>
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

 
    function onProductChange(value: string | null) {
        // setProductId(value)
    }

   

    return (
        <PageContainer>
      

        {/* <CekPage pageName={'Supplier'} /> */}
    
    <ContentContainer>
        <div className='d-flex align-items-center flex-wrap justify-content-between mt-1 mb-1 w-100'>
            {/* <!-- left aligned controllers --> */}
            <div className='d-flex align-items-center mb-3'>
            <SearchTextBox onChange={onSearchTextChange}></SearchTextBox>
            </div>
            <div className='d-flex align-items-center mb-3'>
            <SelectProductInv 
              onChange={function (value1: number, value2: string): void {
                            throw new Error('Function not implemented.')
                        } }            
            />    
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
                    data={
                        items
                    }
                    onDataStateChange={onGridStateChange}
                    style={{ height: `${gridHeight}px` }}
                    // data={items.map((item) => ({
                    // ...item,
                    // [SELECTED_FIELD]: selectedState[idGetter(item)],
                    // }))}
                    dataItemKey={DATA_ITEM_KEY}
                    selectedField={SELECTED_FIELD}
                    selectable={{
                    enabled: true,
                    drag: dragEnabled,
                    cell: cellEnabled,
                    mode: selectionMode,
                    }}
                    navigatable={true}
                    onSelectionChange={onSelectionChange}
                    onKeyDown={onKeyDown}

                >
                    <GridColumn field='supplier_name' title={t('SupplierName')}  width='350px'  />
                    <GridColumn field='supplier_code' title={t('SupplierCode')}  width='150px' />
                    <GridColumn field='city' title={t('SupplierCity')} width='150px' />
                    <GridColumn field='country_name' title={t('SupplierCountry')} width="150px" />
                    <GridColumn field='currency' title={t('SupplierCurrency')} width='150px' />
                    <GridColumn
                            field='supplier_id'
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
            <SupplierLoader
                dataState={dataState}
                onDataReceived={dataReceived}
                searchText={searchText}
                version={dataVersion}                     />
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
