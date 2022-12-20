export interface GsmCardList {
    Id: number,
    gsmNumber: string,
    locked: boolean,
    purchaseDate: Date,
    owned?: boolean,
    status: string,
    customerName: string,
    vehicleNumber: string,
    notes: string,
}