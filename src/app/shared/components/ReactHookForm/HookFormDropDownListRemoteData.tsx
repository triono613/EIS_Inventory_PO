import { Controller, ControllerProps, FieldError, FieldPath, FieldValues } from 'react-hook-form'
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels'
import { Input, InputProps } from '@progress/kendo-react-inputs'
import { HookFormFieldProps } from './HookFormComponent'
import { DropDownListWithRemoteData, DropDownListWithRemoteDataProps } from '../Dropdowns/DropDownListWithRemoteData'

export const HookFormDropDownListWithRemoteData = (
    props: HookFormFieldProps & DropDownListWithRemoteDataProps
) => {
    const dropDownProps: DropDownListWithRemoteDataProps = props
    return (
        <Controller
            name={props.name}
            control={props.control}
            rules={props.rules}
            defaultValue={props.initialValue}
            render={({ field, fieldState, formState }) => {
                let { invalid, error } = fieldState
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
                            <DropDownListWithRemoteData {...dropDownProps} value={field.value} onChange={field.onChange} />
                            {invalid && err.message && <Error id={errorId}>{err.message}</Error>}
                        </div>
                    </div>
                )
            }}
        />
    )
}
