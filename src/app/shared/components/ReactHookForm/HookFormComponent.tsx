import {FC} from 'react'
import {
    Control,
    Controller,
    ControllerProps,
    FieldError,
    FieldPath,
    FieldValues,
    useController,
    UseControllerProps,
} from 'react-hook-form'
import {Label, Error, Hint, FloatingLabel} from '@progress/kendo-react-labels'

export interface HookFormFieldProps {
    control: Control<any>
    name: string
    rules?: UseControllerProps['rules']
    initialValue?: any   // use useForm defaultValues instead
    label: string
    showAsLabel?: boolean
    postfix?: string
    componentWidth?: string | number | undefined
    //onChange?: (value:any) => void
}

export interface HookFormComponentProps {
    initialValue?: any   // use useForm defaultValues instead
    label: string,
}

const HookFormComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
    props: ControllerProps<TFieldValues, TName> & HookFormComponentProps
) => {
    //let renderParams = useController<TFieldValues, TName>(props)
    return (
        <Controller
            name={props.name}
            control={props.control}
            rules={props.rules}
            defaultValue={props.initialValue}
            render={({field, fieldState, formState}) => {
                let {invalid, error} = fieldState
                console.log('error: ', error, ' invalid = ', invalid)
                console.log('error type: ', typeof error)
                let err = error as FieldError
                console.log('err = ', err)
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
                            {props.render({field, fieldState, formState})}
                            {invalid && err.message && <Error id={errorId}>{err.message}</Error>}
                        </div>
                    </div>
                )
            }}
        />
    )
}

export {HookFormComponent}
