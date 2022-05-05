import usePlacesAutocomplete from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import { List, ListItem, TextField } from '@mui/material';
import { useChannelAgentFormStyles } from './ChannelAgentForm';

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
    console.log(data);
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
        onClick={handleManualEntryClick}
      >
        Can't find the address? Enter it manually.
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
        onFocus={scrollToBottom}
        sx={{ width: 782, height: 48 }}
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <List>{renderSuggestions()}</List>}
    </div>
  );
}
