import { TypeResource } from "../enums/type-resource.enum";

export default class GeneralKtqResourceDto {
  resource_name: string;
  type_resource?: TypeResource;
  resource_code: string;
  resource_method?: string;
  description: string;
}
