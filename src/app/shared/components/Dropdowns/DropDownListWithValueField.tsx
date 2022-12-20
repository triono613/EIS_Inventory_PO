import {filterBy} from '@progress/kendo-data-query'
import {FilterChangeEvent} from '@progress/kendo-react-data-tools'
import {
    ComboBox,
    ComboBoxChangeEvent,
    ComboBoxFilterChangeEvent,
    DropDownList,
    DropDownListChangeEvent,
    DropDownListFilterChangeEvent,
    DropDownListProps,
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

export interface DropDownListWithValueFieldProps {
    value?: string | null
    data: Array<IdTextTuple>
    onChange?: (value: string | null) => void
}

const delay = 500
const textField = 'text'
const idField = 'id'
const emptyItem = 'loading..'
const pageSize = 20

//const dataUrl = 'api/locationType/list'

export function DropDownListWithValueField(props: DropDownListWithValueFieldProps & DropDownListProps) {
    const {t} = useTranslation('translation')

    function triggerChange(value: string | null) {
        if (props.onChange) props.onChange(value)
    }

    const handleChange = (event: DropDownListChangeEvent) => {
        if (event) {
            let value = event.target.value
            console.log('DropDownListWithValueField.handleChange(); value = ', value)
            //setValue(value)
            triggerChange(value ? value.id : null)
        }
    }

    const itemFromValue = (value: any) => {
        return value !== null && value !== undefined
            ? props.data.find((item: any) => item['id'] === value)
            : value
    }

    console.log('DropDownListWithValueField redraw(); props.value = ', props.value)

    return (
        <DropDownList
            data={props.data}
            textField='text'
            dataItemKey='id'
            value={itemFromValue(props.value)}
            valid={props.valid}
            onChange={handleChange}
        />
    )
}
