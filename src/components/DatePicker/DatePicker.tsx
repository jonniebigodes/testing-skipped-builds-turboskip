import { useTheme } from '@emotion/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { Theme } from '@emotion/react';
import type { ReactNode } from 'react';
import {
  CalendarDate,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import type { DateValue } from '@internationalized/date';

export type { DateValue };

export interface DatePickerProps {
  type?: 'single' | 'multiple';
  value?: DateValue[];
  onValueChange?: (details: {
    value: DateValue[];
    valueAsString: string[];
  }) => void;
  open?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  placeholder?: DateValue;
  isDateUnavailable?: (date: DateValue, locale: string) => boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  required?: boolean;
  onInvalid?: (details: { reason: string }) => void;
  errorMessageId?: string;
  disableDaysOutsideMonth?: boolean;
  closeOnDateSelect?: boolean;
  preventDeselect?: boolean;
  weekStartsOn?: number;
  weekdayFormat?: 'narrow' | 'short' | 'long';
  calendarLabel?: string;
  fixedWeeks?: boolean;
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  numberOfMonths?: number;
  disabled?: boolean;
  readOnly?: boolean;
  hideTimeZone?: boolean;
  monthFormat?:
    | 'short'
    | 'long'
    | 'narrow'
    | 'numeric'
    | '2-digit'
    | ((month: number) => string);
  yearFormat?: 'numeric' | '2-digit' | ((year: number) => string);
  children?: ReactNode;
  name?: string;
}

const navArrowCss = (t: Theme) => ({
  padding: `6px ${t.spacing[3]}`,
  fontSize: t.fontSize[14],
  border: `1px solid ${t.color.slate300}`,
  borderRadius: '6px',
  backgroundColor: t.color.white,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  '&:hover': { backgroundColor: t.color.slate100 },
});

const viewTriggerCss = (t: Theme) => ({
  padding: `6px ${t.spacing[3]}`,
  fontSize: t.fontSize[14],
  fontWeight: t.fontWeight.semibold,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: t.color.slate900,
});

const viewControlCss = (t: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: t.spacing[3],
});

const tableCss = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const toComparable = (date: DateValue | undefined) =>
  date ? date.year * 10000 + date.month * 100 + date.day : null;

const sameDay = (a: DateValue, b: DateValue) =>
  a.year === b.year && a.month === b.month && a.day === b.day;

const DatePicker = ({
  type = 'single',
  value,
  onValueChange,
  open,
  onOpenChange,
  placeholder,
  isDateUnavailable,
  isDateDisabled,
  required = false,
  errorMessageId,
  disableDaysOutsideMonth = false,
  closeOnDateSelect = false,
  weekStartsOn = 0,
  weekdayFormat = 'short',
  fixedWeeks = false,
  minValue,
  maxValue,
  locale = 'en-US',
  disabled = false,
  readOnly = false,
  monthFormat = 'long',
  children,
  name,
}: DatePickerProps) => {
  const t = useTheme();
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpenControlled = open !== undefined;
  const isOpen = isOpenControlled ? open : internalOpen;

  const initialFocus =
    (value && value[0]) ?? placeholder ?? today(getLocalTimeZone());
  const [focused, setFocused] = useState(
    new CalendarDate(initialFocus.year, initialFocus.month, 1),
  );

  const setOpen = (next: boolean) => {
    if (!isOpenControlled) setInternalOpen(next);
    onOpenChange?.({ open: next });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const minComparable = toComparable(minValue);
  const maxComparable = toComparable(maxValue);

  const monthLabelFormat: 'short' | 'long' | 'narrow' | 'numeric' | '2-digit' =
    typeof monthFormat === 'function' ? 'long' : monthFormat;

  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const dow = (weekStartsOn + i) % 7;
    const reference = new Date(2024, 0, 7 + dow);
    return new Intl.DateTimeFormat(locale, { weekday: weekdayFormat }).format(
      reference,
    );
  });

  const headerLabel = new Intl.DateTimeFormat(locale, {
    month: monthLabelFormat,
    year: 'numeric',
  }).format(new Date(focused.year, focused.month - 1, 1));

  const firstWeekdayOfMonth = new Date(
    focused.year,
    focused.month - 1,
    1,
  ).getDay();
  const leadingDays = (firstWeekdayOfMonth - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(focused.year, focused.month, 0).getDate();
  const firstVisible = focused.subtract({ days: leadingDays });
  const weekCount = fixedWeeks
    ? 6
    : Math.ceil((leadingDays + daysInMonth) / 7);

  const weeks: CalendarDate[][] = Array.from({ length: weekCount }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => firstVisible.add({ days: w * 7 + d })),
  );

  const formatInputDate = (d: DateValue) =>
    new Intl.DateTimeFormat(locale).format(
      new Date(d.year, d.month - 1, d.day),
    );
  const inputValue = value?.map(formatInputDate).join(', ') ?? '';

  const emit = (next: DateValue[]) =>
    onValueChange?.({
      value: next,
      valueAsString: next.map((v) => v.toString()),
    });

  const selectDay = (day: CalendarDate, outsideMonth: boolean) => {
    if (disabled || readOnly) return;
    if (outsideMonth && disableDaysOutsideMonth) return;

    if (type === 'multiple') {
      const exists = value?.some((v) => sameDay(v, day));
      emit(
        exists
          ? (value ?? []).filter((v) => !sameDay(v, day))
          : [...(value ?? []), day],
      );
    } else {
      emit([day]);
    }

    if (closeOnDateSelect) setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: t.spacing[2],
        width: '100%',
        maxWidth: '320px',
        position: 'relative',
      }}
    >
      {children && (
        <span
          id={labelId}
          css={{
            fontSize: t.fontSize[14],
            fontWeight: t.fontWeight.medium,
            color: t.color.slate700,
            marginBottom: t.spacing[1],
          }}
        >
          {children}
        </span>
      )}

      <div
        css={{
          display: 'flex',
          gap: t.spacing[1],
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <input
          type="text"
          readOnly
          value={inputValue}
          aria-describedby={errorMessageId}
          aria-labelledby={children ? labelId : undefined}
          required={required}
          disabled={disabled}
          css={{
            flex: 1,
            padding: `${t.spacing[2]} ${t.spacing[3]}`,
            fontSize: t.fontSize[14],
            border: `1px solid ${t.color.slate300}`,
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            backgroundColor: disabled ? t.color.slate100 : t.color.white,
            cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text',
            ...(!disabled &&
              !readOnly && {
                '&:focus': {
                  borderColor: t.color.blue500,
                  boxShadow: `0 0 0 3px ${t.color.blueTr10}`,
                },
              }),
          }}
        />

        <button
          type="button"
          aria-label="📅"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => setOpen(!isOpen)}
          css={{
            padding: `${t.spacing[2]} ${t.spacing[3]}`,
            fontSize: t.fontSize[14],
            border: `1px solid ${t.color.slate300}`,
            borderRadius: '6px',
            backgroundColor: disabled ? t.color.slate100 : t.color.white,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s, border-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...(!disabled && {
              '&:hover': {
                backgroundColor: t.color.slate50,
                borderColor: t.color.slate400,
              },
            }),
          }}
        >
          📅
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && emit([])}
          css={{
            padding: `6px 10px`,
            fontSize: t.fontSize[12],
            border: `1px solid ${t.color.slate300}`,
            borderRadius: '6px',
            backgroundColor: disabled ? t.color.slate100 : t.color.white,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
            color: t.color.slate500,
            ...(!disabled && {
              '&:hover': {
                backgroundColor: t.color.pink50,
                borderColor: t.color.pink600,
                color: t.color.pink600,
              },
            }),
          }}
        >
          Clear
        </button>
      </div>

      {isOpen && (
        <div
          role="dialog"
          css={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: t.spacing[1],
            backgroundColor: t.color.white,
            border: `1px solid ${t.color.slate200}`,
            borderRadius: t.spacing[3],
            boxShadow: `0 10px 15px -3px ${t.color.blackTr10}, 0 4px 6px -2px ${t.color.blackTr05}`,
            padding: t.spacing[4],
            zIndex: 1000,
            minWidth: '280px',
          }}
        >
          <div css={viewControlCss(t)}>
            <button
              type="button"
              aria-label="Previous month"
              css={navArrowCss(t)}
              onClick={() => setFocused(focused.subtract({ months: 1 }))}
            >
              ←
            </button>
            <button type="button" css={viewTriggerCss(t)}>
              {headerLabel}
            </button>
            <button
              type="button"
              aria-label="Next month"
              css={navArrowCss(t)}
              onClick={() => setFocused(focused.add({ months: 1 }))}
            >
              →
            </button>
          </div>

          <table role="grid" css={tableCss}>
            <thead>
              <tr>
                {weekdayLabels.map((weekDay, id) => (
                  <th
                    key={id}
                    scope="col"
                    css={{
                      padding: t.spacing[2],
                      fontSize: t.fontSize[12],
                      fontWeight: t.fontWeight.semibold,
                      color: t.color.slate500,
                      textAlign: 'center',
                    }}
                  >
                    {weekDay}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, weekId) => (
                <tr key={weekId}>
                  {week.map((day, dayId) => {
                    const outsideMonth = day.month !== focused.month;
                    const comparable = toComparable(day)!;
                    const outOfRange =
                      (minComparable !== null && comparable < minComparable) ||
                      (maxComparable !== null && comparable > maxComparable);
                    const isDisabled =
                      (isDateDisabled ? isDateDisabled(day) : false) ||
                      (isDateUnavailable
                        ? isDateUnavailable(day, locale)
                        : false) ||
                      outOfRange ||
                      (disableDaysOutsideMonth && outsideMonth);
                    const selected = !!value?.some((v) => sameDay(v, day));

                    return (
                      <td key={dayId} css={{ padding: t.spacing[0.5] }}>
                        <button
                          type="button"
                          aria-selected={selected}
                          aria-disabled={isDisabled || undefined}
                          disabled={disabled || readOnly || isDisabled}
                          onClick={() => selectDay(day, outsideMonth)}
                          css={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: t.fontSize[14],
                            border: 'none',
                            borderRadius: '6px',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            backgroundColor: selected
                              ? t.color.blue500
                              : 'transparent',
                            color: selected
                              ? t.color.white
                              : outsideMonth
                                ? t.color.slate400
                                : t.color.slate700,
                            transition: 'background-color 0.2s, color 0.2s',
                            opacity: isDisabled ? 0.4 : 1,
                            ...(!isDisabled &&
                              !selected && {
                                '&:hover': {
                                  backgroundColor: t.color.slate100,
                                },
                              }),
                          }}
                        >
                          {day.day}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {name && <input type="hidden" name={name} value={inputValue} />}
    </div>
  );
};

export default DatePicker;
