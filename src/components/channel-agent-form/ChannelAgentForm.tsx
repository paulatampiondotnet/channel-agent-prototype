import { Button, Card, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { CustomerTypeEnum } from '../../constants';
import { InitializeEnrollment } from '../../services/enrollment';
import { ListOfLinks } from './ListOfLinks';

export const useChannelAgentFormStyles: Function = makeStyles(() =>
  createStyles({
    container: {
      paddingTop: 32
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
    whiteBg: {
      backgroundColor: 'white'
    },
    height100: {
      height: '100%',
      boxSizing: 'border-box'
    }
  }),
);

export const ChannelAgentForm = () => {
  const classes = useChannelAgentFormStyles();

  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [message, setMessage] = useState('')
  const [customerType, setCustomerType] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZip(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleCustomerTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    setCustomerType(newValue);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
  }
  const phoneNumberValueChangeHandler = useCallback((v: NumberFormatValues): void => {
    handlePhoneNumberChange(v.value);
  }, [handlePhoneNumberChange]);

  const handleSubmit = () => {
    InitializeEnrollment({
      email: email,
      billing_zip_code: zip,
      message,
      customer_type: customerType,
      first_name: firstName,
      last_name: lastName
    })
  }

  const submitDisabled = Boolean(email.length <= 0 || zip.length !== 5);
  return <div className={classes.flexColumn}>
    <Grid className={classes.container} container spacing={2}>
      <ListOfLinks />
      <Grid item xs={12} md={8}>
        <Card className={classNames({
            [classes.flexColumn]: true,
            [classes.spaceBetween]: true,
            [classes.whiteBg]: true
          })}
          sx={{ padding: 8}}
        >
          <Typography>Welcome, Agent Smith!</Typography>
          <TextField id="email" label="Subscriber Email" variant="standard" autoComplete='off' value={email} onChange={handleEmailChange}/>
          <TextField id="zip" label="Zip Code" variant="standard" autoComplete='off' value={zip} onChange={handleZipChange}/>
          <TextField id="custom-message" label="Custom Message (Optional)" multiline maxRows={8} autoComplete='off' sx={{mt: 4, mb: 4}} value={message} onChange={handleMessageChange}/>
          <Button variant='contained' sx={{width: 50}} disabled={submitDisabled} onClick={handleSubmit}>Send</Button>
        </Card>
      </Grid>
    </Grid>
    <Grid className={classes.container} container spacing={2}>
      <Grid item xs={12} md={12}>
          <Card className={classNames({
            [classes.flexColumn]: true,
            [classes.spaceBetween]: true,
            [classes.whiteBg]: true
          })}
          sx={{ padding: 8}}>
            <Typography mb={4} variant='h5'>Contact Info</Typography>
            <ToggleButtonGroup
              color="primary"
              value={customerType}
              exclusive
              onChange={handleCustomerTypeChange}
            >
              <ToggleButton value={CustomerTypeEnum.home}>Residential</ToggleButton>
              <ToggleButton value={CustomerTypeEnum.business}>Business</ToggleButton>
            </ToggleButtonGroup>
            <Grid sx={{ marginBottom: 4 }}>
              <TextField id="first-name" label="First Name" variant="standard" autoComplete='off' value={firstName} onChange={handleFirstNameChange} sx={{ width: '40%', marginRight: '7px' }}/>
              <TextField id="last-name" label="Last Name" variant="standard" autoComplete='off' value={lastName} onChange={handleLastNameChange} sx={{ width: '40%' }} />
            </Grid>
            <NumberFormat
              id='phoneNumber'
              name={'phoneNumber'}
              customInput={TextField}
              format="(###) ###-####"
              mask="_"
              onValueChange={phoneNumberValueChangeHandler}
              label={'Phone'}
              value={phoneNumber}
              sx={{ width: '40%' }}
            />
            <Typography mt={4} variant='h5'>Street Address</Typography>
          </Card>
      </Grid>
    </Grid>
  </div>
}

