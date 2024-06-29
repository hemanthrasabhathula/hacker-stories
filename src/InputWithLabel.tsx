import React from "react";
import styles from "./App.module.css";
import { InputWithLabelProps } from "./definitions";

const InputWithLabel = ({
  id,
  type = "text",
  onInputChange,
  value,
  isFocused,
  children,
}: InputWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className={styles.label}>
        {children}
      </label>

      <input
        className={styles.input}
        ref={inputRef}
        id={id}
        type={type}
        onChange={onInputChange}
        value={value}
      />
    </>
  );
};

export { InputWithLabel };
