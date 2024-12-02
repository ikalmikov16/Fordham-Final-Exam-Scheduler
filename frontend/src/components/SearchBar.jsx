import React, { useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import Autosuggest from "react-autosuggest";
import debounce from "lodash.debounce";
import "../styles/SearchBar.css";

const SearchBar = ({ addCourse }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions from the API
  const fetchSuggestions = async (inputValue) => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axiosInstance.get(`/courses/?q=${inputValue}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Debounce the fetchSuggestions function to wait until the user stops typing
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 250),
    []
  );

  // Only call debouncedFetchSuggestions after the user stops typing
  const onSuggestionsFetchRequested = ({ value }) => {
    debouncedFetchSuggestions(value);
  };

  // Clear suggestions when needed
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Render each suggestion item
  const renderSuggestion = (suggestion) => (
    <div className="suggestion-item">
      {suggestion.title} | {suggestion.major_and_number} {suggestion.section} |{" "}
      Prof. {suggestion.professor} | CRN: {suggestion.crn}
    </div>
  );

  // Update input value when user types
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Handle suggestion selection
  const onSuggestionSelected = (event, { suggestion }) => {
    console.log(suggestion);
    addCourse(suggestion); // Call addCourse to update the selected courses in the parent
    setSuggestions([]);
    setValue(""); // Clear the input field
  };

  // Define input props for Autosuggest
  const inputProps = {
    placeholder: "Search by course, major, professor, or CRN... ",
    value,
    onChange,
  };

  return (
    <div className="searchbar-container">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion.title}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />
    </div>
  );
};

export default SearchBar;
