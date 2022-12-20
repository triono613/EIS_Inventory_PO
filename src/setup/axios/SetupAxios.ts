const API_URL = process.env.REACT_APP_API_URL

export default function setupAxios(axios: any, store: any) {
  axios.defaults.baseURL = API_URL;

  axios.interceptors.request.use(
    (config: any) => {
      const {
        auth: {accessToken},
      } = store.getState()

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )

  axios.interceptors.response.use((originalResponse:any) => {
    handleDates(originalResponse.data);
    return originalResponse;
  })
}

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:Z|[+-][01]\d:[0-5]\d)?$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoDateFormat.test(value);
}

export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object")
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = new Date(value)  // Date.parse(value)
    else if (typeof value === "object") handleDates(value);
  }
}