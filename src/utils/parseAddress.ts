export interface Address {
  streetAddress: string;
  city: string;
  state: string;
}

export function parseAddress(longAddress: string): Address {
  const address = longAddress.split(',');
  return {
    streetAddress: address[0],
    city: address[1],
    state: address[2],
  };
}
