import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { List, ListItem, TextField } from "@mui/material";

export const PlacesAutocomplete = ({ onSelect }: { onSelect: (description: string) => void }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
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

  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      onSelect(description);
    };

  const renderSuggestions = () => {
    console.log(data)
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <ListItem component='li' key={place_id} onClick={handleSelect(suggestion)} sx={{ cursor: 'pointer' }}>
          {`${main_text}, ${secondary_text}`}
        </ListItem>
      );
    })
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
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <List>{renderSuggestions()}</List>}
    </div>
  );
};