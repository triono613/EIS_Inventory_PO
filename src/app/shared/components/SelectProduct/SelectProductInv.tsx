import {filterBy} from '@progress/kendo-data-query'
import {
    ComboBoxChangeEvent,
    ComboBoxFilterChangeEvent,
    MultiColumnComboBox,
    MultiColumnComboBoxChangeEvent,
} from '@progress/kendo-react-dropdowns'
import {FilterDescriptor} from '@progress/kendo-react-dropdowns/dist/npm/common/filterDescriptor'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {object} from 'yup/lib/locale'
// import {inventory} from '../../../interfaces/inventory'
import { InventoryList } from '../../../interfaces/InventoryList'

interface SelectProductInvProps {
    value?: string | null
    onChange: (value1: number, value2: string ) => void
}

const delay = 500
const dataUrl = 'api/InventoryItem/list'

export function SelectProductInv( props: SelectProductInvProps) {

    const [inventoryList, setInventoryList] = useState(new Array<InventoryList>())
    const [data, setData] = React.useState(new Array<InventoryList>())
    const [loading, setLoading] = React.useState(false)
    const {t} = useTranslation('translation')
    const timeout = React.useRef<any>()
    const [value, setValue] = React.useState(null)

    const loadData = () => {
        axios
            .get(dataUrl)
            .then((response) => {
                console.log('response inventory_item: ' + JSON.stringify(response))
                // setinventorys(response.data)
                setInventoryList(response.data)
                setData(response.data)

                console.log('props.value= ',props.value)

                if (props.value) {
                    var val = response.data.find((obj: any) => {
                        return obj.id === props.value
                    })
                    if (val) setValue(val)
                }
                setLoading(false)
            })
            .catch((error) => console.error(`Error: ${error}`))
            

            
            const dataDummy = [
                {
                    id: 1,
                    name: "Fuel Level Sensor",
                    // group: "Asesori",
                    // invsku: "SKU32",
                    // stock: 550 
                },
             {
                    id: 2,
                    name: "Teltonika FM 5300",
                    // group: "Tracking Device",
                    // invsku: "SKU-2",
                    // stock: 150 
             },
            ]

            setValue(null)

            // setInventoryList(dataDummy)
            // setData(dataDummy)
    }

    useEffect(() => {
        console.log('Selectinventory.useEffect() ..')
        // load inventory
        loadData()
    }, [])

    const columns = [
        {field: 'name', header: ('Product Name'), width: '300px'},
        {field: 'stock', header: ('Availability'), width: '100px'},
        // {field: 'id', header: ('Id'), width: '100px'},
    ]

    function triggerChange(value1: number,value2: string ) {
        if (props.onChange) props.onChange(value1,value2)
    }

    const handleChange = (event: ComboBoxChangeEvent) => {
        if (event) {
            console.log('event.target id= ', event.target.value.id)
            console.log('event.target name= ', event.target.value.name)
            let value = event.target.value
            console.log('handleChange; value = ',value.name)
            setValue(value)
            // triggerChange(value ? value.name : null)
            triggerChange(value.id ,value ? value.name : null)
        }
    }

    const filterData = (value: string) => {
        if (value && value.length > 0) {
            let upperCase = value.toUpperCase()
            const localData = inventoryList.slice().filter((rec) => {
                return (
                    rec.name.toUpperCase().includes(upperCase)
                )
            })
            return localData
        } else {
            return inventoryList.slice()
        }
        //return filterBy(localData, filter)
    }

    const handleFilterChange = (event: ComboBoxFilterChangeEvent) => {
        if (timeout.current) {
            clearTimeout(timeout.current)
        }

        timeout.current = setTimeout(() => {
            console.log('event.filter = ' + JSON.stringify(event.filter))
            if (event.filter && event.filter.value) {
                setData(filterData(event.filter.value))
            } else {
                setData(inventoryList.slice())
            }
            setLoading(false)
        }, delay)

        setLoading(true)
    }

    return (
        <MultiColumnComboBox
            
            name='ProductName'
            data={data}
            columns={columns}
            textField={'name'}
            dataItemKey='id'
            value={value}
            filterable={true}
            onFilterChange={handleFilterChange}
            loading={loading}
            className='w-350px'
            onChange={handleChange}
        />
    )
}
