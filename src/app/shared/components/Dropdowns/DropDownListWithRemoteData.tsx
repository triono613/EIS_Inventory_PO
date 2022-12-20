import { filterBy } from '@progress/kendo-data-query'
import { FilterChangeEvent } from '@progress/kendo-react-data-tools'
import {
    ComboBox,
    ComboBoxChangeEvent,
    ComboBoxFilterChangeEvent,
    DropDownList,
    DropDownListChangeEvent,
    DropDownListFilterChangeEvent,
    MultiColumnComboBox,
    MultiColumnComboBoxChangeEvent,
} from '@progress/kendo-react-dropdowns'
import { FilterDescriptor } from '@progress/kendo-react-dropdowns/dist/npm/common/filterDescriptor'
import { FieldWrapper } from '@progress/kendo-react-form'
import { Error, Hint, Label } from '@progress/kendo-react-labels'
import axios from 'axios'
import React, { CSSProperties, SyntheticEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IdTextTuple } from '../../../interfaces/IdTextTuple'

export interface DropDownListWithRemoteDataProps {
    value?: string | null
    dataUrl: string
    className?: string
    filterable?: boolean
    addAllAsDefault?: boolean
    onChange?: (value: string | null, syntheticEvent: SyntheticEvent) => void
}

const delay = 500
const textField = 'text'
const idField = 'id'
const emptyItem = 'loading..'
const pageSize = 20

//const dataUrl = 'api/locationType/list'

export function DropDownListWithRemoteData(props: DropDownListWithRemoteDataProps) {
    const [sourceData, setSourceData] = useState(new Array<IdTextTuple>())
    const [data, setData] = React.useState(new Array<IdTextTuple>())
    const [loading, setLoading] = React.useState(false)
    const { t } = useTranslation('translation')
    const timeout = React.useRef<any>()
    const componentRef = React.createRef<DropDownList>()

    //console.log('ComboBoxWithRemoteData.Props: ', props)

    const loadData = () => {
        console.log('DropDownListWithRemoteData.loadData()..')
        axios
            .get(props.dataUrl)
            .then((response) => {
                console.log('DropDownListWithRemoteData.loadData() response: ', response)
                //setSourceData(response.data)
                if (props.addAllAsDefault) {
                    let list = response.data;
                    console.log('list = ', list);
                    list.unshift({ id: '', text: '(All)' })
                    setSourceData(list)
                }
                else {
                    setSourceData(response.data)
                }
                setLoading(false)
            })
            .catch((error) => console.error(`Error: ${error}`))
    }

    useEffect(() => {
        console.log('DropDownListWithRemoteData.useEffect() ..')
        // load customer
        loadData()
    }, [])

    function triggerChange(value: string | null, syntheticEvent: SyntheticEvent) {
        if (props.onChange) props.onChange(value, syntheticEvent)
    }

    const handleChange = (event: DropDownListChangeEvent) => {
        if (event) {
            let value = event.target.value
            console.log('DropDownListWithRemoteData.handleChange(); value = ', value)
            //setValue(value)
            triggerChange(value ? value.id : null, event.syntheticEvent)
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

    const handleFilterChange = (event: DropDownListFilterChangeEvent) => {
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
        let result = value !== null && value !== undefined
            ? sourceData.find((item: any) => item['id'] === value)
            : value
        console.log('value: "' + value + '" item: ', result);
        return result;
    }

    function getData(filterable:boolean|undefined) {
        if (filterable === true) return data;
        else return sourceData;
    }

    console.log('DropDownListWithRemoteData redraw(); props.value = ', props.value)

    return (
        <DropDownList
            data={getData(props.filterable)}
            textField='text'
            dataItemKey='id'
            value={itemFromValue(props.value)}
            filterable={props.filterable}
            onFilterChange={handleFilterChange}
            loading={loading}
            onChange={handleChange}
            ref={componentRef}
            className={props.className}
        />
    )
}

