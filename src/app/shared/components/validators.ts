export const requiredValidator = (errMessage:string) => {
    const validator = (value:string) => {
        if (!value) return errMessage
        return ''
    }
    return validator
}

const emailRegex: RegExp = new RegExp(/\S+@\S+\.\S+/)
export const emailValidator = (errMessage: string) => {
    const validator = (value: string) =>
        emailRegex.test(value) ? '' : errMessage;
    return validator;
}