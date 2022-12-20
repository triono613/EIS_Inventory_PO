import React, {useState, useMemo, useLayoutEffect, useEffect, useRef, CSSProperties} from 'react'

import {ComboBox} from '@progress/kendo-react-dropdowns'
import {filterBy} from '@progress/kendo-data-query'
import {FieldWrapper} from '@progress/kendo-react-form'
import {Label, Error, Hint, FloatingLabel} from '@progress/kendo-react-labels'
import { withValueField } from './withValueField'

//export const ComboBoxWithValueField = withValueField(ComboBox)

interface FormComboBoxWithValueFieldProps {
    validationMessage: string,
    touched: boolean
    label: string
    id: string
    valid: boolean
    disabled: boolean
    hint: string
    wrapperStyle: CSSProperties | undefined
}

export const FormComboBoxWithValueField = (fieldRenderProps:FormComboBoxWithValueFieldProps) => {
    const {validationMessage, touched, label, id, valid, disabled, hint, wrapperStyle, ...others} =
        fieldRenderProps
    const editorRef = useRef(null)

    const showValidationMessage = touched && validationMessage
    const showHint = !showValidationMessage && hint
    const hintId = showHint ? `${id}_hint` : ''
    const errorId = showValidationMessage ? `${id}_error` : ''
    const labelId = label ? `${id}_label` : ''

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
                {/* <ComboBoxWithValueField
                    ariaLabelledBy={labelId}
                    ariaDescribedBy={`${hintId} ${errorId}`}
                    ref={editorRef}
                    valid={valid}
                    id={id}
                    disabled={disabled}
                    {...others}
                /> */}
                {showHint && <Hint id={hintId}>{hint}</Hint>}
                {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
            </div>
        </FieldWrapper>
    )
}
