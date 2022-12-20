import {Controller, ControllerProps, FieldError, FieldPath, FieldValues} from 'react-hook-form'
import {Label, Error, Hint, FloatingLabel} from '@progress/kendo-react-labels'
import {Input, InputProps, NumericTextBox, NumericTextBoxProps, TextArea, TextAreaProps} from '@progress/kendo-react-inputs'
import {HookFormComponentProps, HookFormFieldProps} from './HookFormComponent'
import { formatNumber } from '@telerik/kendo-intl'

export const HookFormNumericTextBox = (props: HookFormFieldProps & NumericTextBoxProps) => {
    const componentProps: NumericTextBoxProps = props
    return (
        <Controller
            name={props.name}
            control={props.control}
            rules={props.rules}
            defaultValue={props.initialValue}
            render={({field, fieldState, formState}) => {
                let {invalid, error} = fieldState
                let err = error as FieldError
                const errorId: string = invalid ? `${props.name}_error` : ''
                return (
                    <div className='k-form-field'>
                        <Label
                            editorId={props.name}
                            editorValid={!invalid}
                            editorDisabled={false}
                            optional={false}
                        >
                            {props.label}
                        </Label>
                        <div className='k-form-field-wrap'>
                            {props.showAsLabel ? (
                                <div className='d-flex'>
                                    <div style={{ fontSize: '1rem', marginTop: '5px', marginLeft: '10px', fontWeight: 'bold' }}>{formatNumber(field.value, props.format ?? 'n0')}</div>
                                    {props.postfix && (
                                        <Label className='ms-5 flex-grow-1 align-items-start' style={{ marginTop: '5px' }}>{props.postfix}</Label>
                                    )}
                                </div>
                            ) : (
                                <>
                                        <div className='d-flex w-100'>
                                            <NumericTextBox
                                                {...componentProps}
                                                {...field}
                                                label={undefined}  // do not use component label
                                                valid={!invalid}
                                                width={props.componentWidth}
                                                onChange={(event) => {
                                                    field.onChange(event.value)
                                                    if (props.onChange) props.onChange(event)
                                                }}
                                            />
                                            {props.postfix && (
                                                <Label className='ms-5 flex-grow-1 align-items-start' style={{ marginTop: '5px' }}>{props.postfix}</Label>
                                            )}
                                        </div>
                                        {invalid && err.message && <Error id={errorId}>{err.message}</Error>}
                                </>
                            )}
                        </div>
                    </div>
                )
            }}
        />
    )
}
