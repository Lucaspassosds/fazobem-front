import { Location } from 'src/constants/interfaces';

export const formatAddress = ({
  addressLine1,
  addressLine2,
  city,
  state,
}: Location) => `${addressLine1} ${addressLine2}, ${city}, ${state}`;

import { DateTime } from 'luxon';

export const getFormattedTime = (timeStr: string) => {
  const timeArray = timeStr.split(':');
  const hour = parseInt(timeArray[0]);
  const minute = parseInt(timeArray[1]);

  const time = DateTime.local().set({ hour, minute });

  return time.toFormat('HH:mm');
};
