import { Button, Card, Grid, Link, TextField, Typography } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import classNames from 'classnames';

const useStyles: Function = makeStyles(() =>
  createStyles({
    container: {
      paddingTop: 32
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
    whiteBg: {
      backgroundColor: 'white'
    },
  }),
);

export const ChannelAgentForm = () => {
  const classes = useStyles();
  return <Grid className={classes.container} container spacing={2}>
    <Grid item xs={12} md={4}>
      <Card className={classNames({
          [classes.flexColumn]: true,
          [classes.whiteBg]: true
        })}
        sx={{ padding: 8}}
      >
        <Typography>Start an enrollment</Typography>
        <Link href="#">Ampion Code of Conduct</Link>
        <Link href="#">ASR Report</Link>
        <Link href="#">Product News</Link>
        <Link href="#">Upload Prospects</Link>
        <Link href="#">View Prospects</Link>
      </Card>
    </Grid>
    <Grid item xs={12} md={8}>
      <Card className={classNames({
          [classes.flexColumn]: true,
          [classes.spaceBetween]: true,
          [classes.whiteBg]: true
        })}
        sx={{ padding: 8}}
      >
        <Typography>Welcome, Agent Smith!</Typography>
        <TextField id="email" label="Subscriber Email" variant="standard" autoComplete='off'/>
        <TextField id="zip" label="Zip Code" variant="standard" autoComplete='off'/>
        <TextField id="custom-message" label="Custom Message" multiline maxRows={8} autoComplete='off' sx={{mt: 4, mb: 4}}/>
        <Button variant='contained' sx={{width: 50}}>Send</Button>
      </Card>
    </Grid>
  </Grid>
}