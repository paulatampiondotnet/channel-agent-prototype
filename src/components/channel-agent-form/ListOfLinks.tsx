import {
  Card, Grid, Link,
} from '@mui/material';
import classNames from 'classnames';
import { getTheme } from 'src/utils/theme';
import { useChannelAgentFormStyles } from './ChannelAgentForm';

export function ListOfLinks() {
  const classes = useChannelAgentFormStyles();
  const theme = getTheme();
  return (
    <Grid item xs={12} md={12}>
      <Card
        className={classNames({
          [classes.whiteBg]: true,
          [classes.height100]: true,
        })}
        sx={{ padding: theme.spacing(4), display: 'flex', justifyContent: 'space-around', margin: '0 auto' }}
      >
        <Link href='#'>Start an enrollment</Link>
        <Link href="#">Ampion Code of Conduct</Link>
      </Card>
    </Grid>
  );
}
