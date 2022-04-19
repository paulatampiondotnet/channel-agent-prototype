import { Card, Grid, Link, Typography } from '@mui/material';
import classNames from 'classnames';
import { useChannelAgentFormStyles } from './ChannelAgentForm';

export function ListOfLinks() {
  const classes = useChannelAgentFormStyles();
  return <Grid item xs={12} md={4}>
    <Card className={classNames({
      [classes.flexColumn]: true,
      [classes.whiteBg]: true,
      [classes.height100]: true
    })}
      sx={{ padding: 8 }}
    >
      <Typography>Start an enrollment</Typography>
      <Link href="#">Ampion Code of Conduct</Link>
      <Link href="#">ASR Report</Link>
      <Link href="#">Product News</Link>
      <Link href="#">Upload Prospects</Link>
      <Link href="#">View Prospects</Link>
    </Card>
  </Grid>;
}
