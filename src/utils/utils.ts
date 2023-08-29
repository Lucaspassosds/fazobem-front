import { Location } from 'src/constants/interfaces';

export const formatAddress = ({
  addressLine1,
  addressLine2,
  city,
  state,
}: Location) => `${addressLine1} ${addressLine2}, ${city}, ${state}`;
