import { Controller, ControllerProps, FieldError, FieldPath, FieldValues } from 'react-hook-form'
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels'
import { Checkbox, CheckboxProps, } from '@progress/kendo-react-inputs'
import { HookFormComponentProps, HookFormFieldProps } from './HookFormComponent'

export const HookFormCheckbox = (props: CheckboxProps & HookFormFieldProps) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            rules={props.rules}
            defaultValue={props.initialValue}
            render={({ field, fieldState, formState }) => {
                let { value } = field
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
                        <div className='k-form-field-wrap flex-grow-0' style={{ paddingTop: '5px' }}>
                            {props.showAsLabel ? (
                                <>
                                    <Checkbox
                                        {...field}
                                        id={props.id}
                                        //type={props.type}
                                        valid={!invalid}
                                        disabled={false}
                                        label='' //{props.postfix}
                                        style={{ pointerEvents: 'none', marginLeft: '10px' }}
                                    />
                                </>
                            ) : (
                                <>
                                    <Checkbox
                                        {...field}
                                        id={props.id}
                                        //type={props.type}
                                        valid={!invalid}
                                        disabled={props.disabled}
                                        label='' //{props.postfix}
                                        style={{ marginLeft: '10px' }}
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
