export interface User {
    id: number,
    userName: string,
    userFullName: string,
    roleId: number,
    email: string,
    phone?: string,
    password?: string,
    confirmPassword?: string,
}