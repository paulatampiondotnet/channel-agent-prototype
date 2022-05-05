import { createTheme } from '@mui/material';

const SPACING = 8;

function spacing(multiple: number) {
  return SPACING * multiple;
}

export function getTheme() {
  return createTheme({
    typography: {
      fontFamily: 'Jost',
      body1: {
        fontFamily: 'Jost',
      },
      h3: {
        fontSize: '23px',
        fontWeight: 400,
        lineHeight: '28px',
        marginBottom: spacing(2)
      },
      h5: {
        fontWeight: 600,
        fontSize: '16px',
        marginBottom: spacing(3)
      },
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            cursor: 'pointer'
          }
        }
      },
      MuiList: {
        styleOverrides: {
          root: {
            width: 783,
            padding: `${spacing(1)}px 0`,
            boxShadow: `
              0px 2px 1px -1px rgb(0 0 0 / 20%), 
              0px 1px 1px 0px rgb(0 0 0 / 14%), 
              0px 1px 3px 0px rgb(0 0 0 / 12%)`
          }
        }
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            padding: `${spacing(1)}px ${spacing(4)}px`,
            boxSizing: 'inherit',
            width: (783 - 64),
          }
        }
      }
    },
    spacing: SPACING
  });
}