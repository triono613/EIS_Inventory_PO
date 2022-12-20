import { UserModel } from "./UserModel";

export interface AuthResultModel {
    authToken: string,
    user: UserModel
}