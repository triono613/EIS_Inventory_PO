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
import {object} from 'yup/lib/locale'
import {IdTextTuple} from '../../interfaces/IdTextTuple'
// import {ComboBoxWithValueField} from './ComboBoxWithValueField'
// import {withValueField} from './withValueField'

interface FormDataSelectorProps { 
    validationMessage: string
    touched: boolean
    label: string
    id: string
    valid: boolean
    disabled: boolean
    hint: string
    wrapperStyle: CSSProperties | undefined
    dataUrl: string
    value?: string
    onChange: (value: string | null) => void
}

const delay = 500
const textField = 'text'
const idField = 'id'
const emptyItem = 'loading..'
const pageSize = 20

export const FormDataSelector = (props: FormDataSelectorProps) => {
    const {validationMessage, touched, label, id, valid, disabled, hint, wrapperStyle, ...others} =
        props
    const editorRef = useRef(null)

    const showValidationMessage = touched && validationMessage
    const showHint = !showValidationMessage && hint
    const hintId = showHint ? `${id}_hint` : ''
    const errorId = showValidationMessage ? `${id}_error` : ''
    const labelId = label ? `${id}_label` : ''

    const [sourceData, setSourceData] = useState(new Array<IdTextTuple>())
    const [data, setData] = React.useState(new Array<IdTextTuple>())
    const [loading, setLoading] = React.useState(false)
    const {t} = useTranslation('translation')
    const timeout = React.useRef<any>()
    const [value, setValue] = React.useState(null)

    const loadData = () => {
        console.log('ReferenceDataSelector.loadData()..')
        axios
            .get(props.dataUrl)
            .then((response) => {
                console.log('response: ' + JSON.stringify(response))
                setSourceData(response.data)
                setData(response.data)
                if (props.value) {
                    var val = response.data.find((obj: any) => {
                        return obj.id === props.value
                    })
                    if (val) setValue(val)
                }
                setLoading(false)
            })
            .catch((error) => console.error(`Error: ${error}`))
    }

    useEffect(() => {
        console.log('ReferenceDataSelector.useEffect() ..')
        // load customer
        loadData()
    }, [])

    function triggerChange(value: string | null) {
        if (props.onChange) props.onChange(value)
    }

    const handleChange = (event: ComboBoxChangeEvent) => {
        if (event) {
            let value = event.target.value
            console.log('handleChange; value = ' + JSON.stringify(value))
            setValue(value)
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
    //console.log("FormDbComboBox others = " + JSON.stringify(others));

    return (
        <FieldWrapper style={wrapperStyle}>
            <Label
                id={labelId}
                editorRef={editorRef}
                editorId={id}
                editorValid={valid}
                editorDisabled={disabled}
            >
                {label}
            </Label>
            <div className={'k-form-field-wrap'}>
                <ComboBox
                    ariaLabelledBy={labelId}
                    ariaDescribedBy={`${hintId} ${errorId}`}
                    ref={editorRef}
                    valid={valid}
                    id={id}
                    disabled={disabled}
                    data={data}
                    textField='text'
                    //valueField='id'
                    dataItemKey='id'
                    value={value}
                    filterable={true}
                    onFilterChange={handleFilterChange}
                    loading={loading}
                    //className='w-350px'
                    onChange={handleChange}
                    //{...others}
                />
                {showHint && <Hint id={hintId}>{hint}</Hint>}
                {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
            </div>
        </FieldWrapper>
    )
}
