import usePlacesAutocomplete from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import { Link, List, ListItem, TextField } from '@mui/material';
import { useChannelAgentFormStyles } from './ChannelAgentForm';
import React from 'react';

type PlacesAutoCompleteProps = {
  onSelect: (description: string) => void;
  handleManualEntryClick: () => void;
};

export function PlacesAutocomplete({ onSelect, handleManualEntryClick }: PlacesAutoCompleteProps) {
  const classes = useChannelAgentFormStyles();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['address'],
      componentRestrictions: {
        country: 'us',
      },
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the keyword of the input element
    setValue(e.target.value);
    scrollToBottom();
  };

  const handleSelect = ({ description }: { description: string }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();

    onSelect(description);
  };

  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  const renderSuggestions = () => {
    const suggestions = data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <ListItem 
          className={classes.autocompleteListItem} 
          component="li" 
          key={place_id} 
          onClick={handleSelect(suggestion)}
        >
          {`${main_text}, ${secondary_text}`}
        </ListItem>
      );
    });
    suggestions.push(
      <ListItem 
        className={classes.autocompleteListItem} 
        component="li" 
        key={'enter-manually'} 
        sx={{ 
          justifyContent: 'center',
          cursor: 'default',
          boxShadow: '0px -1px 1px rgba(0, 0, 0, 0.03)',
          ':hover': {
            backgroundColor: 'inherit'
          }
        }}
      >
        Can't find the address?&nbsp;
        <Link onClick={handleManualEntryClick}>Enter it manually</Link>
      </ListItem>
    );
    return suggestions;
  };

  return (
    <div ref={ref}>
      <TextField
        fullWidth
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Start typing an address"
        variant="standard"
        inputProps={{
          autoComplete: 'new-password',
        }}
        sx={{ width: 782, height: 48 }}
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && 
        <List>
          {renderSuggestions()}
        </List>}
    </div>
  );
}
