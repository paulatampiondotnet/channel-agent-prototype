import { useSnackbar, VariantType } from 'notistack';
import { useCallback, useState } from 'react';
import { NumberFormatValues } from 'react-number-format';
import { 
  EMAIL_REGEX, 
  CANNOT_PROCEED_CODE, 
  INCOMPLETE_ENROLLMENT_CODE, 
  COMPLETE_ENROLLMENT_CODE, 
  COMPLETE_ENROLLMENT_PENDING_PAYMENT_VERIFICATION_CODE, 
  ENROLLMENT_ERROR_MESSAGE 
} from 'src/constants';
import { initializeEnrollment } from 'src/services/enrollment';

export function useChannelAgentForm() {
  const { enqueueSnackbar } = useSnackbar();

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

  return {
    email, setEmail,
    zip, setZip,
    customerType, setCustomerType,
    firstName, setFirstName,
    lastName, setLastName,
    phoneNumber, setPhoneNumber,
    streetAddress, setStreetAddress,
    city, setCity,
    state, setState,
    serviceAddress, setServiceAddress,
    serviceCity, setServiceCity,
    serviceState, setServiceState,
    serviceZip, setServiceZip,
    loading, setLoading,
    emailValidation, setEmailValidation,
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
    handlePhoneNumberChange,
    phoneNumberValueChangeHandler,
    handleSubmit,
    clearForm
  };
}
