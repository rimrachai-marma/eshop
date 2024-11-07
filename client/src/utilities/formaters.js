export const formatCurrency = (number, currency, type = undefined) => {
  const CURRENCY_FORMATTER = new Intl.NumberFormat(type, {
    currency,
    style: "currency",
  });
  return CURRENCY_FORMATTER.format(number);
};

export const formatRelativeDate = (toDate, fromDate = new Date()) => {
  const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];

  const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });

  let duration = (toDate - fromDate) / 1000;

  for (let i = 0; i <= DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return RELATIVE_DATE_FORMATTER.format(
        Math.round(duration),
        division.name
      );
    }
    duration /= division.amount;
  }
};

export function formatDate(date, options) {
  return new Intl.DateTimeFormat("en-us", options).format(date);
}
