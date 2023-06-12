import CalendarComponent from 'react-calendar'
import styled from '@emotion/styled'
import { theme } from 'utils/theme'

import 'react-calendar/dist/Calendar.css'

export const Calendar = styled(CalendarComponent as any)`
  && {
    padding: 5px;
    width: 100%;
    border-radius: 5px;
    border-width: 1px;
    .react-calendar__tile {
      padding: 25px;
      font-size: 16px;
      font-weight: 400;
      abbr {
        color: ${theme.colors.darkestGreen};
      }
    }
    button {
      color: ${theme.colors.green};
    }
    span {
      font-weight: 600;
      font-size: 18px;
    }

    .react-calendar__month-view__weekdays__weekday {
      abbr {
        text-decoration: none;
        font-size: 16px;
        color: ${theme.colors.darkestGreen};
      }
    }
    .react-calendar__tile--hasActive {
      button:hover {
        background: ${theme.colors.darkGreen};
      }
    }
    .react-calendar__tile--now,
    .react-calendar__tile--now:hover {
      background-color: ${theme.colors.darkGreen};
      abbr {
        color: white;
      }
    }
    .react-calendar__tile--active:enabled:hover,
    .react-calendar__tile--active:enabled:focus {
      background-color: ${theme.colors.green60};

      abbr {
        color: black;
      }
    }
    .react-calendar__tile--active {
      background-color: ${theme.colors.green20};
      abbr {
        color: ${theme.colors.darkestGreen};
      }
    }

    button.react-calendar__tile.holiday {
      background-color: ${theme.colors.green20};
      abbr {
        color: red;
      }
    }

    button.react-calendar__tile.before-date,
    button.react-calendar__tile.less-than-date {
      background-color: #f5f5f5;
    }

    .react-calendar__navigation {
      background-color: white;
      button,
      span {
        color: ${theme.colors.darkestGreen};
      }

      button:active,
      button:checked,
      button:hover {
        color: black;
        span {
          color: black;
        }
      }
    }

    .react-calendar__navigation button:disabled {
      background-color: ${theme.colors.green80};
      color: white;
    }
    @media screen and (max-width: 900px) {
      .react-calendar__tile {
        padding: 15px;
        padding-top: 25px;
        padding-bottom: 25px;
      }
    }
    @media screen and (max-width: 639.5px) {
      span {
        font-weight: 600;
        font-size: 14px;
      }
      .react-calendar__tile {
        padding: 2px;
        padding-top: 18px;
        padding-bottom: 18px;
      }
      .react-calendar__month-view__weekdays__weekday {
        abbr {
          text-decoration: none;
          font-size: 12px;
        }
      }
    }
  }
`
