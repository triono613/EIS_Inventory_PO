import { Controller, ControllerProps, FieldError, FieldPath, FieldValues } from 'react-hook-form'
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels'
import { HookFormComponentProps, HookFormFieldProps } from './HookFormComponent'
import { DatePicker, DatePickerProps } from '@progress/kendo-react-dateinputs'
import { formatDate } from '@telerik/kendo-intl';

export const HookFormDatePicker = (props: DatePickerProps & HookFormFieldProps) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            rules={props.rules}
            defaultValue={props.initialValue}
            render={({ field, fieldState, formState }) => {
                let { invalid, error } = fieldState
                let { errors } = formState
                let err = error as FieldError
                //const errorId: string = invalid ? `${props.name}_error` : ''
                const errorId: string = `${props.name}_error`
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
                        <div className='k-form-field-wrap flex-grow-0 w-150px'>
                            {props.showAsLabel ? (
                                <div style={{ fontSize: '1rem', marginTop: '5px', marginLeft: '10px', fontWeight: 'bold' }}>{formatDate(field.value, props.format ?? 'dd/MM/yyyy')}</div>
                            ) : (
                                <>
                                        <DatePicker
                                            {...field}
                                            id={props.id}
                                            //type={props.type}
                                            valid={!invalid}
                                            disabled={props.disabled}
                                            format={props.format}
                                        //label='' //{props.postfix}
                                        />
                                        {invalid && err.message && <Error id={errorId}>{err.message}</Error>}
                                </>
                            )}
                        </div>
                        {props.postfix && (
                            <span className='ms-2' style={{ paddingTop: '5px' }}>{props.postfix}</span>
                        )}
                    </div>
                )
            }}
        />
    )
}
