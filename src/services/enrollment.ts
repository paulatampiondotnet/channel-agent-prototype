import { API_AMPION_URL, BAD_RESPONSE_MESSAGE, ENROLLMENT_ENDPOINT } from "../constants"

export const InitializeEnrollment = (enrollment: any) => {
  let url = `${API_AMPION_URL}/${ENROLLMENT_ENDPOINT}`
  return fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      ...enrollment,
      send_verify_email: true
    })
  })
    .then((fetchResult) => {
      if (fetchResult.ok || fetchResult.status === 409) {
        return fetchResult;
      } else {
        throw Error(BAD_RESPONSE_MESSAGE);
      }
    })
}