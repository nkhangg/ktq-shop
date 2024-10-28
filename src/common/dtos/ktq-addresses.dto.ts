export default interface GeneralKtqAddressDto {
  customer_id: number;
  address_line: string;
  ward: string;
  district: string;
  city: string;
  postal_code: string;
  state: string;
  country_id: number;
  region_id: number;
  is_default: boolean;
}
