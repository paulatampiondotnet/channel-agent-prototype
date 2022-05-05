import {
  Card, Checkbox, Grid, Link, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { createStyles, makeStyles } from '@mui/styles';
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import NumberFormat from 'react-number-format';
import {
  CustomerTypeEnum, 
} from '../../constants';
import { parseAddress } from '../../utils/parseAddress';
import { ListOfLinks } from './ListOfLinks';
import { PlacesAutocomplete } from './PlacesAutocomplete';
import { getTheme } from 'src/utils/theme';
import { useChannelAgentForm } from 'src/hooks/useFormState';

const theme = getTheme();

export const useChannelAgentFormStyles = makeStyles(() => createStyles({
  container: {
    paddingTop: 32,
    width: 1000,
    margin: '0 auto'
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
    height: 25,
    fontSize: '16px',
    fontWeight: 400,
    fontFamily: 'Jost',
    lineHeight: '22.4px',
    '&:hover': {
      backgroundColor: '#E5E5E5',
    },
  },
  width251: {
    width: 251
  },
  lightText: {
    fontWeight: 400,
    fontSize: '14px'
  },
}));

export function ChannelAgentForm() {
  const classes = useChannelAgentFormStyles();
  // const vid = window.location.pathname.replace('/', '');

  const {
    email,
    zip,
    customerType,
    firstName,
    lastName,
    phoneNumber,
    streetAddress, setStreetAddress,
    city, setCity,
    state, setState,
    serviceAddress, setServiceAddress,
    serviceCity, setServiceCity,
    serviceState, setServiceState,
    serviceZip, setServiceZip,
    loading,
    emailValidation,
    handleEmailChange,
    handleZipChange,
    handleFirstNameChange,
    handleLastNameChange,
    handleStreetAddressChange,
    handleCityChange,
    handleStateChange,
    handleServiceAddressChange,
    handleServiceCityChange,
    handleServiceStateChange,
    handleServiceZipChange,
    handleCustomerTypeChange,
    phoneNumberValueChangeHandler,
    handleSubmit,
  } = useChannelAgentForm();

  const [fullAddressFormVisible, setFullAddressFormVisible] = useState(false);

  const handleManualEntryClick = useCallback(() => {
    setFullAddressFormVisible(true);
  }, [setFullAddressFormVisible]);

  const handleAddressSelected = (longAddress: string) => {
    const address = parseAddress(longAddress);
    setStreetAddress(address.streetAddress);
    setCity(address.city);
    setState(address.state);
    setServiceAddressToNewAddress(address.streetAddress, address.city, address.state);
    setFullAddressFormVisible(true);
  };

  const [serviceAddressSameAsMailing, setServiceAddressSameAsMailing] = useState(true);

  function setServiceAddressToNewAddress(streetAddress: string, city: string, state: string) {
    setServiceAddress(streetAddress);
    setServiceCity(city);
    setServiceState(state);
    setServiceZip(zip);
  }

  const handleServiceAddressSameAsMailingChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setServiceAddressSameAsMailing(value);
    if (value === true) {
      setServiceAddressToNewAddress(streetAddress, city, state);
    } else {
      setServiceAddressToNewAddress('', '', '');
    }
  }, [setServiceAddressSameAsMailing, setServiceAddressToNewAddress]);

  const handleAddressResetClick = useCallback(() => {
    setStreetAddress('');
    setFullAddressFormVisible(false);
    setCity('');
    setState('');
  }, [setStreetAddress, setFullAddressFormVisible, setCity, setState]);

  const submitDisabled = useMemo(() =>
    Boolean(emailValidation.error || email.length === 0 || zip.length !== 5), [emailValidation, email, zip]
  );
  const sendButton = (
    <LoadingButton
      size="small"
      variant="contained"
      loading={loading}
      sx={{ width: 191, height: 45, backgroundColor: '#0088FD', borderRadius: '5px' }}
      disabled={submitDisabled}
      onClick={handleSubmit}
    >
      Send Invitation
    </LoadingButton>
  );

  const showServiceAddressForm = useMemo(() => 
    (fullAddressFormVisible && !serviceAddressSameAsMailing), [fullAddressFormVisible, serviceAddressSameAsMailing]
  );

  return (
    <Grid className={classes.container} container spacing={2}>
      <ListOfLinks />
      <Grid item xs={12} md={12}>
        <Card
          className={classNames({
            [classes.flexColumn]: true,
            [classes.spaceBetween]: true,
            [classes.whiteBg]: true,
          })}
          sx={{ padding: '60px' }}
        >
          <Typography variant="h3" mb={1}>Start an Enrollment</Typography>
          <Typography mb={4}>Please enter subscriber information below and invite via email.</Typography>
          <Grid mb={6}>
            <TextField
              id="email"
              label="Subscriber's Email"
              variant="standard"
              autoComplete="new-password"
              value={email}
              error={emailValidation.error}
              helperText={emailValidation.helperText} 
              onChange={handleEmailChange}
              sx={{ mb: theme.spacing(1), mr: theme.spacing(1), width: 380 }}
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
              sx={{ mb: theme.spacing(1), width: 128 }}
            />
          </Grid>
          {(zip?.length === 5 && email && !emailValidation.error) && (
            <Grid className={classes.container} container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography 
                  variant="h5"
                >
                    Contact Info <span className={classes.lightText}>(Optional)</span>
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={customerType}
                  exclusive
                  onChange={handleCustomerTypeChange}
                  sx={{ marginBottom: theme.spacing(3) }}
                >
                  <ToggleButton value={CustomerTypeEnum.home}>Residential</ToggleButton>
                  <ToggleButton value={CustomerTypeEnum.business}>Business</ToggleButton>
                </ToggleButtonGroup>
                <Grid sx={{ marginBottom: theme.spacing(1), marginTop: theme.spacing(1) }}>
                  <TextField 
                    className={classes.width251}
                    id="first-name" 
                    label="First Name" 
                    variant="standard" 
                    autoComplete="new-password" 
                    value={firstName} 
                    onChange={handleFirstNameChange} 
                    sx={{ marginRight: theme.spacing(1) }} 
                  />
                  <TextField 
                    className={classes.width251}
                    id="last-name" 
                    label="Last Name" 
                    variant="standard" 
                    autoComplete="new-password" 
                    value={lastName} 
                    onChange={handleLastNameChange}
                    sx={{ marginRight: theme.spacing(1) }} 
                  />
                  <NumberFormat
                    className={classes.width251}
                    id="phoneNumber"
                    name="phoneNumber"
                    customInput={TextField}
                    format="(###) ###-####"
                    mask="_"
                    onValueChange={phoneNumberValueChangeHandler}
                    label="Phone"
                    value={phoneNumber}
                    variant="standard"
                  />
                </Grid>
                {customerType === CustomerTypeEnum.business && 
                  <Grid sx={{ marginTop: theme.spacing(1) }}>
                    <TextField
                      className={classes.width251}
                      id='job-description'
                      label='Job Description'
                      variant='standard'
                      autoComplete='new-password'
                      sx={{ marginRight: theme.spacing(1) }}
                    />
                    <TextField
                      className={classes.width251}
                      id='org-name'
                      label='Organization Name'
                      variant='standard'
                      autoComplete='new-password'
                    />
                  </Grid>
                }
                <Typography mt={4} mb={4} variant="h5">
                  Mailing Address <span className={classes.lightText}>(Optional)&nbsp;</span>
                  <Link className={classes.lightText} onClick={handleAddressResetClick}>Reset</Link>
                </Typography>
                {!fullAddressFormVisible && <PlacesAutocomplete 
                  onSelect={handleAddressSelected} 
                  handleManualEntryClick={handleManualEntryClick} 
                />}
                {fullAddressFormVisible && 
                  <TextField 
                    label="Street Address" 
                    value={streetAddress} 
                    onChange={handleStreetAddressChange}
                    variant="standard"
                    sx={{ width: 782, height: 48 }}
                  />
                }
                {fullAddressFormVisible && (
                  <Grid>
                    <TextField 
                      margin="normal" 
                      label="City" 
                      value={city}
                      variant="standard"
                      sx={{ width: 180, marginRight: theme.spacing(1) }} 
                      onChange={handleCityChange} 
                    />
                    <TextField 
                      margin="normal" 
                      label="State" 
                      value={state}
                      variant="standard"
                      sx={{ width: 180, marginRight: theme.spacing(1) }} 
                      onChange={handleStateChange} 
                    />
                    <NumberFormat
                      id="zip-2"
                      name="zip-2"
                      customInput={TextField}
                      variant='standard'
                      format="#####"
                      onValueChange={handleZipChange}
                      label="Zip Code"
                      value={zip}
                      sx={{ width: 133, marginTop: theme.spacing(2) }}
                    />
                  </Grid>
                )}
                <Grid display='flex' flexDirection='row' alignItems='center' mb={theme.spacing(2)}>
                  <Checkbox
                    checked={serviceAddressSameAsMailing}
                    onChange={handleServiceAddressSameAsMailingChange}
                    sx={{ paddingLeft: 0 }}
                  />
                  <Typography>Same as utility service address</Typography>
                </Grid>

                {showServiceAddressForm && 
                  <Typography mb={2} variant="h5">
                    Service Address <span className={classes.lightText}>(Optional)</span>
                  </Typography>
                }

                {showServiceAddressForm && 
                  <TextField 
                    label="Street Address" 
                    value={serviceAddress}
                    variant="standard"
                    onChange={handleServiceAddressChange} 
                    sx={{ width: 782, height: 48 }} 
                  />
                }
                {showServiceAddressForm && (
                  <Grid mb={theme.spacing(2)}>
                    <TextField 
                      margin="normal" 
                      label="City" 
                      value={serviceCity}
                      variant="standard"
                      sx={{ width: 180, marginRight: theme.spacing(1) }} 
                      onChange={handleServiceCityChange} 
                    />
                    <TextField 
                      margin="normal" 
                      label="State" 
                      value={serviceState}
                      variant="standard"
                      sx={{ width: 180, marginRight: theme.spacing(1) }} 
                      onChange={handleServiceStateChange} 
                    />
                    <NumberFormat
                      id="service-zip"
                      name="service-zip"
                      customInput={TextField}
                      variant='standard'
                      format="#####"
                      onValueChange={handleServiceZipChange}
                      label="Zip Code"
                      value={serviceZip}
                      sx={{ width: 133, marginTop: theme.spacing(2) }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
          {sendButton}
        </Card>
      </Grid>
    </Grid>
  );
}
