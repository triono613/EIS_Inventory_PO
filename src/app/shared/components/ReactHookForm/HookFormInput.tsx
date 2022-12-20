import { Controller, ControllerProps, FieldError, FieldPath, FieldValues } from 'react-hook-form'
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels'
import { Input, InputProps } from '@progress/kendo-react-inputs'
import { HookFormComponentProps, HookFormFieldProps } from './HookFormComponent'

export const HookFormInput = (props: InputProps & HookFormFieldProps) => {
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
                        <div className='k-form-field-wrap'>
                            {props.showAsLabel ? (
                                <div style={{ fontSize: '1rem', marginTop: '5px', marginLeft: '10px', fontWeight:'bold' }}>{field.value}</div>
                            ) : (
                                <>
                                    <Input
                                        {...field}
                                        id={props.id}
                                        type={props.type}
                                        valid={!invalid}
                                        disabled={props.disabled}
                                    />
                                    {invalid && err.message && <Error id={errorId}>{err.message}</Error>}
                                </>
                            )}
                        </div>
                        {props.postfix && (
                            <span className='ms-10'>{props.postfix}</span>
                        )}
                    </div>
                )
            }}
        />
    )
}
