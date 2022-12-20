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
import {Customer} from '../../../interfaces/Customer'

interface SelectCustomerProps {
    value?: string | null
    onChange: (value: string | null) => void
}

const delay = 500
const dataUrl = 'api/customer/list'

export function SelectCustomer(props: SelectCustomerProps) {
    const [customers, setCustomers] = useState(new Array<Customer>())
    const [data, setData] = React.useState(new Array<Customer>())
    const [loading, setLoading] = React.useState(false)
    const {t} = useTranslation('translation')
    const timeout = React.useRef<any>()
    const [value, setValue] = React.useState(null)

    const loadData = () => {
        console.log('SelectCustomer.loadData()..')
        axios
            .get(dataUrl)
            .then((response) => {
                console.log('response: ' + JSON.stringify(response))
                setCustomers(response.data)
                setData(response.data)
                if (props.value) {
                    var val = response.data.find((obj: any) => {
                        return obj.customer_id === props.value
                    })
                    if (val) setValue(val)
                }
                setLoading(false)
            })
            .catch((error) => console.error(`Error: ${error}`))
    }

    useEffect(() => {
        console.log('SelectCustomer.useEffect() ..')
        // load customer
        loadData()
    }, [])

    const columns = [
        {field: 'customer_name', header: t('CustomerName'), width: '300px'},
        {field: 'customer_code', header: t('Code'), width: '100px'},
    ]

    function triggerChange(value: string | null) {
        if (props.onChange) props.onChange(value)
    }

    const handleChange = (event: ComboBoxChangeEvent) => {
        if (event) {
            let value = event.target.value
            console.log('handleChange; value = ' + JSON.stringify(value))
            setValue(value)
            triggerChange(value ? value.customer_id : null)
        }
    }

    const filterData = (value: string) => {
        if (value && value.length > 0) {
            let upperCase = value.toUpperCase()
            const localData = customers.slice().filter((rec) => {
                return (
                    rec.customer_name.toUpperCase().includes(upperCase) ||
                    rec.customer_code?.toUpperCase().includes(upperCase)
                )
            })
            return localData
        } else {
            return customers.slice()
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
                setData(customers.slice())
            }
            setLoading(false)
        }, delay)

        setLoading(true)
    }

    return (
        <MultiColumnComboBox
            data={data}
            columns={columns}
            textField={'customer_name'}
            dataItemKey='customer_id'
            value={value}
            filterable={true}
            onFilterChange={handleFilterChange}
            loading={loading}
            className='w-350px'
            onChange={handleChange}
        />
    )
}
