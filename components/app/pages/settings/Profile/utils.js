import moment from 'moment';

const DATE_FORMAT = 'DD.MM.YYYY';

export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
};

export const getFormattedDate = (date) => moment(date).format(DATE_FORMAT);

export default {
  getToday,
  getFormattedDate,
};
