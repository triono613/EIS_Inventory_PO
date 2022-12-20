import {Controller, ControllerProps, FieldError, FieldPath, FieldValues} from 'react-hook-form'
import {Label, Error, Hint, FloatingLabel} from '@progress/kendo-react-labels'
import {Input, InputProps, TextArea, TextAreaProps} from '@progress/kendo-react-inputs'
import {HookFormComponentProps, HookFormFieldProps} from './HookFormComponent'

export const HookFormTextArea = (props: HookFormFieldProps & TextAreaProps) => {
    const componentProps: TextAreaProps = props
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
                                <p style={{ fontSize: '1rem', marginTop: '5px', marginLeft: '10px', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: field.value?.replaceAll('\n','<br />') }} />
                            ) : (
                                <>
                                        <TextArea
                                            {...componentProps}
                                            {...field}
                                            valid={!invalid}
                                            readOnly={props.showAsLabel}
                                            onChange={(event) => {
                                                field.onChange(event.value)
                                            }}
                                        />
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
