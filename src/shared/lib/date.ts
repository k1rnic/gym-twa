export const sortByCreated = <T extends { create_dttm: string }>(
  a: T,
  b: T,
) => {
  return new Date(b.create_dttm).getTime() - new Date(a.create_dttm).getTime();
};

export const formatDate = (
  maybeDate: string | null | Date,
  format: 'date' | 'datetime' | 'time' = 'date',
) => {
  const locale = 'ru-RU';

  if (!maybeDate) {
    return 'Неверная дата';
  }

  const date = typeof maybeDate === 'string' ? new Date(maybeDate) : maybeDate;

  if (format === 'date') {
    return date.toLocaleDateString(locale);
  }
  if (format === 'datetime') {
    return date.toLocaleString(locale);
  }
  if (format === 'time') {
    return date.toLocaleTimeString(locale);
  }
};
