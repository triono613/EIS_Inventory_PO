import axios from 'axios'
import {AuthModel} from '../models/AuthModel'
import { AuthResultModel } from '../models/AuthResultModel'
import {UserModel} from '../models/UserModel'

const API_URL = process.env.REACT_APP_API_URL || 'api'

export const GET_USER_BY_ACCESSTOKEN_URL = `api/user/get-user`
//export const LOGIN_URL = `${API_URL}/auth/login`
export const LOGIN_URL = `api/auth/login`
export const REGISTER_URL = `${API_URL}/auth/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/auth/forgot-password`

// Server should return AuthModel
export function login(userName: string, password: string) {
  console.log("login(" + userName + "," + password + ")");
  console.log('process.env.REACT_APP_API_URL = ' + process.env.REACT_APP_API_URL);
  console.log("URL: " + LOGIN_URL);
  var param = {
    userName,
    password,
  }
  return axios.post<AuthResultModel>(LOGIN_URL, param);
}

// Server should return AuthModel
export function register(email: string, firstname: string, lastname: string, password: string) {
  return axios.post<AuthModel>(REGISTER_URL, {
    email,
    firstname,
    lastname,
    password,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {email})
}

export function getUserByToken() {
  console.log("getUserByToken()")

  // Authorization head should be fulfilled in interceptor.
  // Check common redux folder => setupAxios
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL)
}
