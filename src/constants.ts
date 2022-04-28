export enum CustomerTypeEnum {
  home = 'ResidentialCustomer',
  business = 'NonResidentialPrivateCustomer',
  public = 'NonResidentialPublicCustomer',
}

export const API_AMPION_URL = 'https://api-staging.ampion.net'
export const ENROLLMENT_ENDPOINT = 'v1/enrollment';

export const BAD_RESPONSE_MESSAGE = 'Bad response from enrollment API';

export const CANNOT_PROCEED_CODE = 104;
export const INCOMPLETE_ENROLLMENT_CODE = 105;
export const COMPLETE_ENROLLMENT_CODE = 110;
export const COMPLETE_ENROLLMENT_PENDING_PAYMENT_VERIFICATION_CODE = 111;