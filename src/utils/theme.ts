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
      }
    },
    spacing: SPACING
  });
}