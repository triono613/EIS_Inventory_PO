export interface ContractAccessory {
    id: number,
    contract_id: number,
    number: number,
    accessories_id: number,
    qty: number,
    notes: string,
    // for editing
    tempId?: string,
    inEdit?: boolean | string
}