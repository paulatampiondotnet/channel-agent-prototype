export enum CustomerTypeEnum {
  home = 'ResidentialCustomer',
  business = 'NonResidentialPrivateCustomer',
  public = 'NonResidentialPublicCustomer',
}

export const API_AMPION_URL = 'https://api-staging.ampion.net';
export const ENROLLMENT_ENDPOINT = 'v1/enrollment';

export const BAD_RESPONSE_MESSAGE = 'Bad response from enrollment API';
export const ENROLLMENT_ERROR_MESSAGE = `There was an error processing this enrollment.
 Please double check your data and try again or contact Ampion support.`;

export const CANNOT_PROCEED_CODE = 104;
export const INCOMPLETE_ENROLLMENT_CODE = 105;
export const COMPLETE_ENROLLMENT_CODE = 110;
export const COMPLETE_ENROLLMENT_PENDING_PAYMENT_VERIFICATION_CODE = 111;

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const SPACING = 4;