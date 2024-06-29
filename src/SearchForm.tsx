import { SearchFormProps } from "./definitions";
import React, { ReactNode } from "react";
import styles from "./App.module.css";
import { InputWithLabel } from "./InputWithLabel";

const Text = ({ children }: { children: ReactNode }) => (
  <strong>{children}</strong>
);
const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  buttonStyle,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSearchSubmit} className={styles.searchForm}>
      <InputWithLabel
        id="search"
        onInputChange={onSearchInput}
        value={searchTerm}
        isFocused
      >
        <Text>Search : </Text>
      </InputWithLabel>
      <button
        className={`${styles.button} ${buttonStyle}`}
        type="submit"
        disabled={!searchTerm}
      >
        Submit
      </button>
    </form>
  );
};

export { SearchForm };
