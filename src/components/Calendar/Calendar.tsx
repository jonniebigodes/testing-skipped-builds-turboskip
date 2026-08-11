import { useTheme } from '@emotion/react';
import { useState } from 'react';
import type { Theme } from '@emotion/react';
import type { ReactNode } from 'react';
import {
  CalendarDate,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import type { DateValue } from '@internationalized/date';

export type { DateValue };

export interface CalendarProps {
  type?: 'single' | 'multiple';
  value?: DateValue[];
  onValueChange?: (details: {
    value: DateValue[];
    valueAsString: string[];
  }) => void;
  placeholder?: DateValue;
  weekStartsOn?: number;
  weekdayFormat?: 'narrow' | 'short' | 'long';
  calendarLabel?: string;
  fixedWeeks?: boolean;
  isDateDisabled?: (date: DateValue) => boolean;
  isDateUnavailable?: (date: DateValue, locale: string) => boolean;
  minValue?: DateValue;
  maxValue?: DateValue;
  locale?: string;
  disabled?: boolean;
  readOnly?: boolean;
  disableDaysOutsideMonth?: boolean;
  maxDays?: number;
  monthFormat?: 'short' | 'long';
  yearFormat?: 'numeric' | '2-digit';
  children?: ReactNode;
  name?: string;
}

const viewControlCss = (t: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: t.spacing[4],
  gap: t.spacing[2],
});

const arrowTriggerCss = (t: Theme, disabled: boolean) => ({
  padding: t.spacing[2],
  border: 'none',
  background: 'transparent',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: t.fontSize[16],
  color: disabled ? t.color.slate400 : t.color.blue500,
  borderRadius: t.spacing[2],
  transition: 'background-color 0.2s',
});

const viewTriggerCss = (t: Theme, notInteractive: boolean) => ({
  flex: 1,
  padding: `${t.spacing[2]} ${t.spacing[3]}`,
  border: 'none',
  background: 'transparent',
  cursor: notInteractive ? 'default' : 'pointer',
  fontSize: t.fontSize[14],
  fontWeight: t.fontWeight.semibold,
  color: t.color.slate900,
  borderRadius: t.spacing[2],
  transition: 'background-color 0.2s',
});

const tableCss = (t: Theme) => ({
  width: '100%',
  borderCollapse: 'separate' as const,
  borderSpacing: t.spacing[1],
});

const toComparable = (date: DateValue | undefined) =>
  date ? date.year * 10000 + date.month * 100 + date.day : null;

const sameDay = (a: DateValue, b: DateValue) =>
  a.year === b.year && a.month === b.month && a.day === b.day;

export default function Calendar({
  type = 'single',
  value,
  onValueChange,
  placeholder,
  weekStartsOn = 0,
  weekdayFormat = 'short',
  fixedWeeks = false,
  isDateDisabled,
  isDateUnavailable,
  minValue,
  maxValue,
  locale = 'en-US',
  disabled = false,
  readOnly = false,
  disableDaysOutsideMonth = false,
  maxDays,
  monthFormat = 'long',
  children,
  name,
}: CalendarProps) {
  const t = useTheme();

  const initialFocus =
    (value && value[0]) ?? placeholder ?? today(getLocalTimeZone());
  const [focused, setFocused] = useState(
    new CalendarDate(initialFocus.year, initialFocus.month, 1),
  );

  const minComparable = toComparable(minValue);
  const maxComparable = toComparable(maxValue);

  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const dow = (weekStartsOn + i) % 7;
    // 2024-01-07 is a Sunday; offset by the weekday index.
    const reference = new Date(2024, 0, 7 + dow);
    return new Intl.DateTimeFormat(locale, { weekday: weekdayFormat }).format(
      reference,
    );
  });

  const headerLabel = new Intl.DateTimeFormat(locale, {
    month: monthFormat,
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

  const isSelected = (day: DateValue) =>
    !!value?.some((v) => sameDay(v, day));

  const changeMonth = (delta: number) => {
    if (disabled) return;
    setFocused(focused.add({ months: delta }));
  };

  const selectDay = (day: CalendarDate, outsideMonth: boolean) => {
    if (disabled || readOnly) return;
    if (outsideMonth && disableDaysOutsideMonth) return;

    let nextValue: DateValue[];
    if (type === 'multiple') {
      const exists = value?.some((v) => sameDay(v, day));
      nextValue = exists
        ? (value ?? []).filter((v) => !sameDay(v, day))
        : [...(value ?? []), day];
      if (maxDays && nextValue.length > maxDays) return;
    } else {
      nextValue = [day];
    }

    onValueChange?.({
      value: nextValue,
      valueAsString: nextValue.map((v) => v.toString()),
    });
  };

  return (
    <div
      css={{
        display: 'inline-block',
        padding: t.spacing[4],
        border: `1px solid ${t.color.slate200}`,
        borderRadius: t.spacing[3],
        backgroundColor: t.color.white,
      }}
    >
      {children && (
        <div
          css={{
            marginBottom: t.spacing[3],
            fontSize: t.fontSize[16],
            fontWeight: t.fontWeight.semibold,
            color: t.color.slate900,
          }}
        >
          {children}
        </div>
      )}

      <div css={viewControlCss(t)}>
        <button
          type="button"
          aria-label="Previous month"
          css={arrowTriggerCss(t, disabled)}
          disabled={disabled}
          onClick={() => changeMonth(-1)}
        >
          ←
        </button>

        <button
          type="button"
          css={viewTriggerCss(t, disabled || readOnly)}
          disabled={disabled || readOnly}
        >
          {headerLabel}
        </button>

        <button
          type="button"
          aria-label="Next month"
          css={arrowTriggerCss(t, disabled)}
          disabled={disabled}
          onClick={() => changeMonth(1)}
        >
          →
        </button>
      </div>

      <table role="grid" css={tableCss(t)}>
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
                  textTransform: 'uppercase',
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
                  (isDateUnavailable ? isDateUnavailable(day, locale) : false) ||
                  outOfRange ||
                  (outsideMonth && disableDaysOutsideMonth);
                const selected = isSelected(day);

                return (
                  <td key={dayId} css={{ padding: 0 }}>
                    <button
                      type="button"
                      aria-selected={selected}
                      aria-disabled={isDisabled || undefined}
                      disabled={disabled || readOnly || isDisabled}
                      onClick={() => selectDay(day, outsideMonth)}
                      css={{
                        width: t.spacing[10],
                        height: t.spacing[10],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        background: selected ? t.color.blue500 : 'transparent',
                        borderRadius: t.spacing[2],
                        fontSize: t.fontSize[14],
                        fontWeight: t.fontWeight.medium,
                        cursor:
                          disabled || readOnly || isDisabled
                            ? 'not-allowed'
                            : 'pointer',
                        transition: 'all 0.2s',
                        color: selected
                          ? t.color.white
                          : isDisabled
                            ? t.color.slate300
                            : outsideMonth
                              ? t.color.slate400
                              : t.color.slate700,
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

      {name && (
        <input
          type="hidden"
          name={name}
          value={value?.map((v) => v.toString()).join(',') ?? ''}
        />
      )}
    </div>
  );
}
