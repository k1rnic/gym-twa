export const sortByProp = <T, SortValue extends string | number | boolean>(
  items: T[],
  getter: (item: T) => SortValue,
  order: Array<SortValue> = [],
): T[] => {
  return [...items].sort((a, b) => {
    const valueA = getter(a);
    const valueB = getter(b);

    if (order.length > 0) {
      const indexA = order.indexOf(valueA);
      const indexB = order.indexOf(valueB);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      } else if (indexA !== -1) {
        return -1;
      } else if (indexB !== -1) {
        return 1;
      }
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB);
    }

    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  });
};
