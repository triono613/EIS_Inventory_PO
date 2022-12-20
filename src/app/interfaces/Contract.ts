import { ContractAccessory } from "./ContractAccessory";

export interface Contract {
    contract_id: number,
    member_id: number,
    contract_number: string,
    contract_date: Date | null,
    po_number: string,
    po_date: Date | null,
    sales_person_id: number | null,
    device_contract_type_id: number,
    num_of_vehicles: number,
    notes: string,
    service_charge: number | null,
    rental_charge: number | null,
    inactive_service_charge: number | null,
    inactive_rental_charge: number | null,
    use_customer_gsm_card: boolean,
    use_voice: boolean,
    trade_in: boolean,
    realization?: number | null,
    accessories: Array<ContractAccessory> 
}