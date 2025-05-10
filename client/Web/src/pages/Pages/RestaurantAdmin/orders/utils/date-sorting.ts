/**
 * Sorts an array of objects by date field
 * @param data Array of objects to sort
 * @param field Field name containing the date string
 * @param direction Sort direction ('asc', 'desc', or null for original order)
 * @returns Sorted array
 */
export const sortByDate = <T extends Record<string, any>>(data: T[], field: keyof T, direction: 'asc' | 'desc' | null): T[] => {
    if (!direction) return [...data];

    return [...data].sort((a, b) => {
        const dateA = new Date(a[field]).getTime();
        const dateB = new Date(b[field]).getTime();

        if (direction === 'asc') {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });
};
