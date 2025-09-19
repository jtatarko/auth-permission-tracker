import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, 'HH:mm')}`;
  }

  if (isYesterday(dateObj)) {
    return `Yesterday, ${format(dateObj, 'HH:mm')}`;
  }

  return format(dateObj, 'MMM d, yyyy HH:mm');
};

export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy HH:mm:ss');
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatDateForInput = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDateTimeForInput = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

export const getDateRange = (days: number): { from: Date; to: Date } => {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from, to };
};

export const isDateInRange = (date: Date, range: { from: Date; to: Date }): boolean => {
  return date >= range.from && date <= range.to;
};