import { API_AMPION_URL, ENROLLMENT_ENDPOINT } from "../constants"

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
}