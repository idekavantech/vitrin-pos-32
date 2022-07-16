import { createMuiTheme } from "@material-ui/core/styles";
import {
  jungleI,
  jungleIII,
  peachI,
  peachIII,
  oceanI,
  oceanIII,
  skyI,
  skyIII,
  white,
  strawberryI,
  strawberryIII,
  coal,
  graphite,
  pollution,
  dust,
  tiramisoo,
  vanilla,
  night,
  smoke,
  cement,
} from "./colors";
const baseTheme = () => ({
  typography: {
    fontFamily: "IranSans",
    button: {
      fontSize: "14px",
      fontWeight: 700,
    },
    htmlFontSize: 16,
  },
});
const lightTheme = () =>
  createMuiTheme({
    ...baseTheme(),
    palette: {
      type: "light",
      primary: {
        main: oceanI,
        contrastText: white,
      },
      secondary: {
        main: oceanI,
        contrastText: white,
      },
      success: {
        main: jungleI,
      },
      error: {
        main: strawberryI,
      },
      warning: {
        main: peachI,
      },
      info: {
        main: skyI,
      },
      text: {
        primary: coal,
        secondary: graphite,
        disabled: pollution,
        tertiary: night,
        quaternary: smoke,
      },
      background: {
        default: white,
        paper: vanilla,
        secondary: dust,
      },
      divider: tiramisoo,
    },
    overrides: {
      MuiPaper: {
        elevation1: {
          boxShadow: "0px 0px 20px rgba(204, 212, 215, 0.2)",
          borderRadius: 8,
          background: "white",
        },
        elevation2: {
          boxShadow: "0px 0px 20px rgba(204, 212, 215, 0.2)",
          background: "white",
        },
        elevation3: {
          boxShadow:
            "0px 3px 3px -2px rgba(102, 126, 138, 0.2),0px 3px 4px 0px rgba(102, 126, 138, 0.14),0px 1px 8px 0px rgba(102, 126, 138, 0.12)",
          background: "white",
        },
      },
      MuiInputBase: {
        root: {
          transformOrigin: "top right",
          height: 56,
          fontSize: 16,

          "&.medium": {
            height: 40,
            fontSize: 14,
          },
          "&.small": {
            height: 36,
            fontSize: 13,
          },
        },
        input: {
          ".placeholder-error&::placeholder": {
            opacity: 1,
            color: strawberryI,
          },
          "&.placeholder-active&::placeholder": {
            color: night,
            opacity: 1,
          },
        },
      },
      MuiInputLabel: {
        outlined: {
          transformOrigin: "top right",
          fontSize: 14,
          transform: "translate(-12px, 20px) scale(1)",
          zIndex: 1,
          right: 0,
          pointerEvents: "none",
          "&.MuiInputLabel-shrink": {
            transform: "translate(-10px, -6px) scale(0.75)",
            right: 0,
            left: "unset",
          },
          "&.medium": {
            transform: "translate(-12px, 12px) scale(1)",
            "&.MuiInputLabel-shrink": {
              transform: "translate(-10px, -6px) scale(0.75)",
              right: 0,
              left: "unset",
            },
          },
          "&.small": {
            transform: "translate(-12px, 10px) scale(1)",
            "&.MuiInputLabel-shrink": {
              transform: "translate(-10px, -6px) scale(0.75)",
              right: 0,
              left: "unset",
            },
          },
        },
        formControl: {
          fontFamily: "inherit",
          left: "auto",
          fontSize: 16,
        },
      },
      MuiOutlinedInput: {
        multiline: {
          height: "auto",
        },
      },
      MuiTableCell: {
        root: {
          borderBottom: "unset",
          color: night,
        },
      },
      MuiSelect: {
        icon: {
          marginLeft: 5,
        },
      },
    },
  });
export const themeCreator = () => lightTheme();
