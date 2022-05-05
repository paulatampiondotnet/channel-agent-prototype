import { API_AMPION_URL, BAD_RESPONSE_MESSAGE, ENROLLMENT_ENDPOINT } from '../constants';

type EnrollmentObject = {
  agent_name?: string;
  email?: string;
  billing_zip_code?: string;
  create_new_on_conflict?: boolean;
  customer_type?: string;
  first_name?: string;
  last_name?: string;
  billing_address_1?: string;
  billing_address_2?: string;
  billing_city?: string;
  billing_state?: string;
  service_address_1?: string;
  service_address_2?: string;
  service_city?: string;
  service_state?: string;
  service_zip_code?: string;
  phone?: string;
  company_name?: string;
  title?: string;
  vanity_id?: string;
}

export const initializeEnrollment = (enrollment: EnrollmentObject) => {
  const url = `${API_AMPION_URL}/${ENROLLMENT_ENDPOINT}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...enrollment,
      send_verify_email: true,
    }),
  })
    .then((fetchResult) => {
      if (fetchResult.ok || fetchResult.status === 409) {
        return fetchResult;
      }
      throw Error(BAD_RESPONSE_MESSAGE);
    });
};
