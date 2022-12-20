import {filterBy} from '@progress/kendo-data-query'
import {FilterChangeEvent} from '@progress/kendo-react-data-tools'
import {
    ComboBox,
    ComboBoxChangeEvent,
    ComboBoxFilterChangeEvent,
    DropDownListChangeEvent,
    DropDownListFilterChangeEvent,
    MultiColumnComboBox,
    MultiColumnComboBoxChangeEvent,
} from '@progress/kendo-react-dropdowns'
import {FilterDescriptor} from '@progress/kendo-react-dropdowns/dist/npm/common/filterDescriptor'
import {FieldWrapper} from '@progress/kendo-react-form'
import {Error, Hint, Label} from '@progress/kendo-react-labels'
import axios from 'axios'
import React, {CSSProperties, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {IdTextTuple} from '../../../interfaces/IdTextTuple'

export interface ComboBoxWithRemoteDataProps {
    value?: string | null
    dataUrl: string
    className?: string
    onChange?: (value: string | null) => void
    disabled?: boolean
    showAsLabel?: boolean
}

const delay = 500
const textField = 'text'
const idField = 'id'
const emptyItem = 'loading..'
const pageSize = 20

//const dataUrl = 'api/locationType/list'

export function ComboBoxWithRemoteData(props: ComboBoxWithRemoteDataProps) {
    const [sourceData, setSourceData] = useState(new Array<IdTextTuple>())
    const [data, setData] = React.useState(new Array<IdTextTuple>())
    const [loading, setLoading] = React.useState(false)
    const {t} = useTranslation('translation')
    const timeout = React.useRef<any>()
    const componentRef = React.createRef<ComboBox>()

    //console.log('ComboBoxWithRemoteData.Props: ', props)
    
    const loadData = () => {
        console.log('ComboBoxWithRemoteData.loadData()..')
        axios
            .get(props.dataUrl)
            .then((response) => {
                console.log('ComboBoxWithRemoteData.loadData() response: ', response)
                setSourceData(response.data)
                setData(response.data)
                setLoading(false)
            })
            .catch((error) => console.error(`Error: ${error}`))
    }

    useEffect(() => {
        console.log('ComboBoxWithRemoteData.useEffect() ..')
        // load customer
        loadData()
    }, [])

    function triggerChange(value: string | null) {
        if (props.onChange) props.onChange(value)
    }

    const handleChange = (event: ComboBoxChangeEvent) => {
        if (event) {
            let value = event.target.value
            console.log('ComboBoxWithRemoteData.handleChange(); value = ', value)
            //setValue(value)
            triggerChange(value ? value.id : null)
        }
    }

    const filterData = (value: string) => {
        if (value && value.length > 0) {
            let upperCase = value.toUpperCase()
            const localData = sourceData.slice().filter((rec) => {
                return rec.text.toUpperCase().includes(upperCase)
            })
            return localData
        } else {
            return sourceData.slice()
        }
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
                setData(sourceData.slice())
            }
            setLoading(false)
        }, delay)

        setLoading(true)
    }

    const itemFromValue = (value: any) => {
        return value !== null && value !== undefined
            ? sourceData.find((item: any) => item['id'] === value)
            : value
    }

    console.log('ComboBoxWithRemoteData redraw(); props.value = ', props.value)

    return props.showAsLabel ? (
        <div style={{ fontSize: '1rem', marginTop: '5px', marginLeft: '10px', fontWeight: 'bold' }}>
            {itemFromValue(props.value)?.text ?? ''}
        </div>
        ) : (
        <ComboBox
            data={data}
            textField='text'
            dataItemKey='id'
            value={itemFromValue(props.value)}
            filterable={true}
            onFilterChange={handleFilterChange}
            loading={loading}
            onChange={handleChange}
            ref={componentRef}
            className={props.className}
            disabled={props.disabled}
        />
    )
}

