import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Button} from '@progress/kendo-react-buttons'
import {
    Grid,
    GridCellProps,
    GridColumn as Column,
    GridItemChangeEvent,
    GridToolbar,
} from '@progress/kendo-react-grid'

import {Product} from './interfaces'
import {SelectProductInv} from '../../../shared/components/SelectProduct/SelectProductInv'
import PoEditForm from './PoEditForm'
import {dataProduct} from './dataProduct'


export function PoItem() {
    const [openForm, setOpenForm] = React.useState(false)
    const [editItem, setEditItem] = React.useState({
        ProductID: 1,
    })
    const [data, setData] = React.useState(dataProduct)
    const enterEdit = (item: any) => {
        setOpenForm(true)
        setEditItem(item)
    }

    const EditCommandCell = (props: any) => {
        return (
            <td>
                <button
                    className='k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary'
                    onClick={() => props.enterEdit(props.dataItem)}
                >
                    Edit
                </button>
            </td>
        )
    }

    const handleSubmit = (event: any) => {
        let newItem = true
        let newData = data.map((item: any) => {
            if (event.ProductID === item.ProductID) {
                newItem = false
                item = {
                    ...event,
                }
            }
            return item
        })
        if (newItem) {
            newData.push(event)
        }
        setData(newData)
        setOpenForm(false)
    }
    const addNew = () => {
        setOpenForm(true)
        setEditItem({
            ProductID: 99,
        }) // you need to change the logic for adding unique ID value;
    }

    const handleCancelEdit = () => {
        setOpenForm(false)
    }
    const MyEditCommandCell = (props: any) => <EditCommandCell {...props} enterEdit={enterEdit} />

    return (
        <>
            {/* <SelectInventory
            onChange={onProductChange} 
            // onChange={undefined}
            /> */}
            <br />
            <br />

            <Grid style={{height: '420px'}} data={data}>
                <GridToolbar>
                    <Button
                        primary={true}
                        title='Add new'
                        className='position-absolute top-10 end-0'
                        onClick={addNew}
                    >
                        Add Item
                    </Button>
                </GridToolbar>
                <Column field='ProductID' title='Id' width='50px' editable={false} />
                <Column field='ProductName' title='Product Name' width='200px' />
                <Column field='ProductName2' title='Product Name 2' width='200px' />
                <Column field='qty' title='Qty' width='80px' />
                <Column field='UnitPrice' title='Price' width='80px' />
                <Column field='Discount' title='Discount' width='80px' />
                <Column field='UnitsInStock' title='Availability' width='80px' editor='numeric' />

                {/* <Column field="Discontinued" title="Discontinued" editor="boolean" /> */}
                {/* <Column field='Category.CategoryName' title='CategoryName' /> */}

                <Column cell={MyEditCommandCell} width='200px' />
            </Grid>
            {openForm && (
                <PoEditForm cancelEdit={handleCancelEdit} onSubmit={handleSubmit} item={editItem} />
            )}
        </>
    )
}
