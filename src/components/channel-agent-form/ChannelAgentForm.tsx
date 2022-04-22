import { Card, Grid, Link, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { createStyles, makeStyles } from '@mui/styles'
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { useSnackbar } from 'notistack';
import { CustomerTypeEnum } from '../../constants';
import { InitializeEnrollment as initializeEnrollment } from '../../services/enrollment';
import { parseAddress } from '../../utils/parseAddress';
import { ListOfLinks } from './ListOfLinks';
import { PlacesAutocomplete } from './PlacesAutocomplete';

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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [message, setMessage] = useState('')
  const [customerType, setCustomerType] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const [loading, setLoading] = useState(false)

  const clearForm = useCallback(() => {
    setEmail('')
    setZip('')
    setMessage('')
    setCustomerType('')
    setFirstName('')
    setLastName('')
    setPhoneNumber('')
    setStreetAddress('')
    setCity('')
    setState('')
  }, [
    setEmail,
    setZip,
    setMessage,
    setCustomerType,
    setFirstName,
    setLastName,
    setPhoneNumber,
    setStreetAddress,
    setCity,
    setState,
  ])
  
  const [fullAddressFormVisible, setFullAddressFormVisible] = useState(false)

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

  const handleAddressSelected = (longAddress: string) => {
    const { streetAddress, city, state } = parseAddress(longAddress);
    setStreetAddress(streetAddress);
    setCity(city);
    setState(state);
    setFullAddressFormVisible(true)
  }

  const handleManualEntryClick = useCallback(() => {
    setFullAddressFormVisible(true)
  }, [setFullAddressFormVisible])

  const handleSubmit = async () => {
    setLoading(true);
    await initializeEnrollment({
      email: email,
      billing_zip_code: zip,
      message,
      customer_type: customerType,
      first_name: firstName,
      last_name: lastName,
      billing_address_1: streetAddress,
      billing_address_2: '',
      billing_city: city,
      billing_state: state,
      phone: phoneNumber
    })
    enqueueSnackbar(`Invitation sent to ${email}!`, {
      variant: 'success', 
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      }
    });
    clearForm();
    setLoading(false);
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
          <TextField id="email" label="Subscriber Email" variant="standard" autoComplete='new-password' value={email} onChange={handleEmailChange}/>
          <TextField id="zip" label="Zip Code" variant="standard" autoComplete='new-password' value={zip} onChange={handleZipChange}/>
          <TextField id="custom-message" label="Custom Message (Optional)" multiline maxRows={8} autoComplete='new-password' sx={{mt: 4, mb: 4}} value={message} onChange={handleMessageChange}/>
          <LoadingButton
            size="small"
            variant='contained' 
            loading={loading} 
            endIcon={<SendIcon />}
            loadingPosition="end"
            sx={{width: 100}} 
            disabled={submitDisabled} 
            onClick={handleSubmit}
          >Send</LoadingButton>
        </Card>
      </Grid>
    </Grid>
    {(zip?.length === 5 && email) && <Grid className={classes.container} container spacing={2}>
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
              <TextField id="first-name" label="First Name" variant="standard" autoComplete='new-password' value={firstName} onChange={handleFirstNameChange} sx={{ width: '40%', marginRight: 8 }}/>
              <TextField id="last-name" label="Last Name" variant="standard" autoComplete='new-password' value={lastName} onChange={handleLastNameChange} sx={{ width: '40%' }} />
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
              variant='standard'
            />
            <Typography mt={4} mb={4} variant='h5'>Street Address</Typography>

            {!fullAddressFormVisible && <PlacesAutocomplete onSelect={handleAddressSelected}/>}
            {!fullAddressFormVisible && <Link href='#' sx={{ cursor: 'pointer' }} onClick={handleManualEntryClick}>Manually Enter Address</Link>}

            {fullAddressFormVisible && <TextField label={'Street Address'} value={streetAddress} />}
            {fullAddressFormVisible && <Grid>
              <TextField margin='normal' label={'City'} value={city} sx={{ width: '52%', marginRight: 4 }}/>
              <TextField margin='normal' label={'State'} value={state} sx={{ width: '20%', marginRight: 4 }}/>
              <TextField margin='normal' label={'Zip'} value={zip} sx={{ width: '20%' }}/>
            </Grid>}
          </Card>
      </Grid>
    </Grid>}
  </div>
};

