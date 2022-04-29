import {
  Card, Grid, Link, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { createStyles, makeStyles } from '@mui/styles';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { useSnackbar, VariantType } from 'notistack';
import {
  CANNOT_PROCEED_CODE,
  COMPLETE_ENROLLMENT_CODE, 
  COMPLETE_ENROLLMENT_PENDING_PAYMENT_VERIFICATION_CODE, 
  CustomerTypeEnum, 
  EMAIL_REGEX, 
  ENROLLMENT_ERROR_MESSAGE, 
  INCOMPLETE_ENROLLMENT_CODE,
  SPACING,
} from '../../constants';
import { InitializeEnrollment as initializeEnrollment } from '../../services/enrollment';
import { parseAddress } from '../../utils/parseAddress';
import { ListOfLinks } from './ListOfLinks';
import { PlacesAutocomplete } from './PlacesAutocomplete';

export const useChannelAgentFormStyles = makeStyles(() => createStyles({
  container: {
    paddingTop: 32,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  whiteBg: {
    backgroundColor: 'white',
  },
  height100: {
    height: '100%',
    boxSizing: 'border-box',
  },
  autocompleteListItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'black',
      color: 'whitesmoke',
    },
  },
}));

export function ChannelAgentForm() {
  const classes = useChannelAgentFormStyles();
  const { enqueueSnackbar } = useSnackbar();
  // const vid = window.location.pathname.replace('/', '');

  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceCity, setServiceCity] = useState('');
  const [serviceState, setServiceState] = useState('');
  const [serviceZip, setServiceZip] = useState('');

  const [loading, setLoading] = useState(false);

  const clearForm = useCallback(() => {
    setEmail('');
    // setZip('')
    setCustomerType('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setStreetAddress('');
    setCity('');
    setState('');
    setServiceAddress('');
    setServiceCity('');
    setServiceState('');
    // setServiceZip('')
  }, [
    setEmail,
    setZip,
    setCustomerType,
    setFirstName,
    setLastName,
    setPhoneNumber,
    setStreetAddress,
    setCity,
    setState,
    setServiceAddress,
    setServiceCity,
    setServiceState,
    setServiceZip,
  ]);

  const [fullAddressFormVisible, setFullAddressFormVisible] = useState(false);
  const [emailValidation, setEmailValidation] = useState({ error: false, helperText: '' });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = event.target.value;
    setEmail(emailInput);
    if (!EMAIL_REGEX.test(emailInput)) {
      setEmailValidation({ error: true, helperText: 'Not a valid email address.' });
    } else {
      setEmailValidation({ error: false, helperText: '' });
    }
  };

  const handleZipChange = (v: NumberFormatValues) => {
    setZip(v.value);
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleStreetAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStreetAddress(event.target.value);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  };

  const handleServiceAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServiceAddress(event.target.value);
  };

  const handleServiceCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServiceCity(event.target.value);
  };

  const handleServiceStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServiceState(event.target.value);
  };

  const handleServiceZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServiceZip(event.target.value);
  };

  const handleCustomerTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    setCustomerType(newValue);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
  };
  const phoneNumberValueChangeHandler = useCallback((v: NumberFormatValues): void => {
    handlePhoneNumberChange(v.value);
  }, [handlePhoneNumberChange]);

  const handleAddressSelected = (longAddress: string) => {
    const { streetAddress, city, state } = parseAddress(longAddress);
    setStreetAddress(streetAddress);
    setCity(city);
    setState(state);
    setServiceAddress(streetAddress);
    setServiceCity(city);
    setServiceState(state);
    setServiceZip(zip);
    setFullAddressFormVisible(true);
  };

  const handleManualEntryClick = useCallback(() => {
    setFullAddressFormVisible(true);
  }, [setFullAddressFormVisible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fetchResult = await initializeEnrollment({
        agent_name: 'Agent Smith',
        email,
        billing_zip_code: zip,
        create_new_on_conflict: true,
        customer_type: customerType,
        first_name: firstName,
        last_name: lastName,
        billing_address_1: streetAddress,
        billing_address_2: '',
        billing_city: city,
        billing_state: state,
        service_address_1: serviceAddress,
        service_address_2: '',
        service_city: serviceCity,
        service_state: serviceState,
        service_zip_code: serviceZip,
        phone: phoneNumber,
        // vanity_id: vid,
      });
      let messageToShow = `Invitation sent to ${email}!`;
      let variant: VariantType = 'success';
      let autoHideDuration = 5000;
      if (fetchResult.status === 409) {
        variant = 'info';
        autoHideDuration = 10000;
        const [codedMessage] = await fetchResult.json();
        const { code } = codedMessage;

        switch (code) {
        case CANNOT_PROCEED_CODE:
          throw Error('Cannot proceed.');
        case INCOMPLETE_ENROLLMENT_CODE:
          messageToShow = `An incomplete enrollment already exists for email address ${email}.  An email has been sent
           to this address to resume their existing enrollment.`;
          break;
        case COMPLETE_ENROLLMENT_CODE:
          messageToShow = `A complete enrollment already exists for email address ${email}.  An email has been sent to
           this address to create a new one.`;
          break;
        case COMPLETE_ENROLLMENT_PENDING_PAYMENT_VERIFICATION_CODE:
          throw Error('Payment verification pending.');
        }
      }
      enqueueSnackbar(messageToShow, {
        variant,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        autoHideDuration,
      });
      clearForm();
    } catch {
      enqueueSnackbar(ENROLLMENT_ERROR_MESSAGE, 
        {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
    }
    setLoading(false);
  };

  const submitDisabled = Boolean(emailValidation.error || email.length === 0 || zip.length !== 5);
  const sendButton = (
    <LoadingButton
      size="small"
      variant="contained"
      loading={loading}
      endIcon={<SendIcon />}
      loadingPosition="end"
      sx={{ width: 100 }}
      disabled={submitDisabled}
      onClick={handleSubmit}
    >
      Send
    </LoadingButton>
  );
  return (
    <div className={classes.flexColumn}>
      <Grid className={classes.container} container spacing={2}>
        <ListOfLinks />
        <Grid item xs={12} md={8}>
          <Card
            className={classNames({
              [classes.flexColumn]: true,
              [classes.spaceBetween]: true,
              [classes.whiteBg]: true,
            })}
            sx={{ padding: '16px 32px 32px 32px' }}
          >
            <Typography variant="h5" mb={1}>Welcome, Agent Smith!</Typography>
            <TextField
              id="email"
              label="Subscriber Email"
              variant="standard"
              autoComplete="new-password"
              value={email}
              error={emailValidation.error}
              helperText={emailValidation.helperText} 
              onChange={handleEmailChange}
              sx={{ mb: SPACING }}
            />
            <NumberFormat
              id="zip"
              name="zip"
              customInput={TextField}
              variant='standard'
              format="#####"
              onValueChange={handleZipChange}
              label="Zip Code"
              value={zip}
              sx={{ mb: SPACING }}
            />
            {sendButton}
          </Card>
        </Grid>
      </Grid>
      {(zip?.length === 5 && email && !emailValidation.error) && (
        <Grid className={classes.container} container spacing={2}>
          <Grid item xs={12} md={12}>
            <Card
              className={classNames({
                [classes.flexColumn]: true,
                [classes.spaceBetween]: true,
                [classes.whiteBg]: true,
              })}
              sx={{ padding: 8 }}
            >
              <Typography mb={4} variant="h5">Contact Info</Typography>
              <ToggleButtonGroup
                color="primary"
                value={customerType}
                exclusive
                onChange={handleCustomerTypeChange}
              >
                <ToggleButton value={CustomerTypeEnum.home}>Residential</ToggleButton>
                <ToggleButton value={CustomerTypeEnum.business}>Business</ToggleButton>
              </ToggleButtonGroup>
              <Grid sx={{ marginBottom: SPACING, marginTop: SPACING }}>
                <TextField 
                  id="first-name" 
                  label="First Name" 
                  variant="standard" 
                  autoComplete="new-password" 
                  value={firstName} 
                  onChange={handleFirstNameChange} 
                  sx={{ width: '40%', marginRight: 8 }} 
                />
                <TextField 
                  id="last-name" 
                  label="Last Name" 
                  variant="standard" 
                  autoComplete="new-password" 
                  value={lastName} 
                  onChange={handleLastNameChange} 
                  sx={{ width: '40%' }} 
                />
              </Grid>
              <NumberFormat
                id="phoneNumber"
                name="phoneNumber"
                customInput={TextField}
                format="(###) ###-####"
                mask="_"
                onValueChange={phoneNumberValueChangeHandler}
                label="Phone"
                value={phoneNumber}
                sx={{ width: '40%' }}
                variant="standard"
              />
              <Typography mt={4} mb={4} variant="h5">Billing Address</Typography>

              {!fullAddressFormVisible && <PlacesAutocomplete onSelect={handleAddressSelected} />}
              {!fullAddressFormVisible && 
                <Link href="#" sx={{ 
                  cursor: 'pointer', mb: SPACING 
                }} onClick={handleManualEntryClick}>
                  Manually Enter Address
                </Link>
              }

              {fullAddressFormVisible && 
                <TextField label="Street Address" value={streetAddress} onChange={handleStreetAddressChange} />
              }
              {fullAddressFormVisible && (
                <Grid>
                  <TextField 
                    margin="normal" 
                    label="City" 
                    value={city} 
                    sx={{ width: '40%', marginRight: SPACING }} 
                    onChange={handleCityChange} 
                  />
                  <TextField 
                    margin="normal" 
                    label="State" 
                    value={state} 
                    sx={{ width: '20%', marginRight: SPACING }} 
                    onChange={handleStateChange} 
                  />
                  {/* <TextField 
                    margin='normal' 
                    label={'Zip'} 
                    value={zip} 
                    sx={{ width: '20%' }} 
                    onChange={handleZipChange} 
                  /> */}
                </Grid>
              )}

              {fullAddressFormVisible && <Typography mt={4} mb={4} variant="h5">Service Address</Typography>}

              {fullAddressFormVisible && 
                <TextField label="Street Address" value={serviceAddress} onChange={handleServiceAddressChange} />}
              {fullAddressFormVisible && (
                <Grid mb={SPACING}>
                  <TextField 
                    margin="normal" 
                    label="City" 
                    value={serviceCity} 
                    sx={{ width: '40%', marginRight: SPACING }} 
                    onChange={handleServiceCityChange} 
                  />
                  <TextField 
                    margin="normal" 
                    label="State" 
                    value={serviceState} 
                    sx={{ width: '20%', marginRight: SPACING }} 
                    onChange={handleServiceStateChange} 
                  />
                  <TextField 
                    type="number" 
                    margin="normal" 
                    label="Zip" 
                    value={serviceZip} 
                    sx={{ width: '30%' }} 
                    onChange={handleServiceZipChange} 
                  />
                </Grid>
              )}
              {sendButton}
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
