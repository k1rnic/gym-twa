type SortOrder = 'asc' | 'desc';

const createDateSorter =
  <T, K extends keyof T>(field: K, order: SortOrder = 'desc') =>
  (a: T, b: T) => {
    const diff =
      new Date(a[field] as string).getTime() -
      new Date(b[field] as string).getTime();

    return order === 'asc' ? diff : -diff;
  };

export const sortByCreated = <T extends { create_dttm: string }>(
  order: SortOrder = 'desc',
) => createDateSorter<T, 'create_dttm'>('create_dttm', order);

export const sortByUpdated = <T extends { update_dttm: string }>(
  order: SortOrder = 'desc',
) => createDateSorter<T, 'update_dttm'>('update_dttm', order);

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
