import { useRef, useState } from "react";
import styles from "./Select.module.css";

export default function Select({ multiple, value, onChange, options = [] }) {
  const containerRef = useRef(null);
  const optionRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option) {
    if (multiple) {
      if (value.find(({ label }) => label === option.label)) {
        onChange(value.filter(({ label }) => label !== option.label));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option) {
    return multiple ? value.includes(option) : option === value;
  }

  const handleKeyDownContainer = (e) => {
    switch (e.code) {
      case "Enter":
      case "Space":
        setIsOpen((prev) => !prev);
        if (isOpen) selectOption(options[highlightedIndex]);
        break;
      case "ArrowUp":
      case "ArrowDown": {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          break;
        }

        const newIndex = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
        if (newIndex >= 0 && newIndex < options.length) {
          setHighlightedIndex(newIndex);
          optionRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        break;
      }
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleBlur = (event) => {
    if (containerRef?.current && containerRef?.current.contains(event.relatedTarget)) {
      event.preventDefault();
      return;
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDownContainer}
      onBlur={handleBlur}
      onClick={() => {
        setIsOpen((prev) => !prev);
        setHighlightedIndex(0);
      }}
      tabIndex={0}
      className={styles.container}
    >
      <div className={styles.value}>
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectOption(v);
                }}
                className={styles["option-badge"]}
              >
                {v.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : value?.label}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          clearOptions();
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            ref={(el) => (optionRefs.current[index] = el)}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} ${index === highlightedIndex ? styles.highlighted : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CMultiselect({ selectedOptions, onChange, options = [] }) {
  const inputRef = useRef(null);
  const optionRefs = useRef([]);
  const containerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Handles the selection of an option
  function selectOption(option) {
    if (selectedOptions.find(({ label }) => label === option.label)) {
      onChange(selectedOptions.filter(({ label }) => label !== option.label));
    } else {
      onChange([...selectedOptions, option]);
    }
    setIsOpen(false);
  }

  // Handles opening and closing of the dropdown
  function toggleDropdown() {
    setIsOpen((prev) => !prev);

    if (!isOpen) {
      setHighlightedIndex(0);
    }
  }

  // Keyboard navigation for the container
  function handleContainerKeyDown(event) {
    if (event.code === "Enter" || event.code === "Space") {
      handleEnterOrSpaceKey();
    } else if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      event.preventDefault(); // Prevent page scroll
      handleArrowKeys(event.code === "ArrowDown" ? 1 : -1);
    } else if (event.code === "Escape") {
      setIsOpen(false);
    }
  }

  // Handles "Enter" or "Space" key actions
  function handleEnterOrSpaceKey() {
    if (!isOpen && inputText === "") {
      setIsOpen(true);
    } else if (inputText === "" && isOpen) {
      selectOption(options[highlightedIndex]);
    }
  }

  // Handles arrow key navigation
  function handleArrowKeys(direction) {
    setInputText("");
    inputRef.current.innerText = "";

    if (!isOpen) {
      setIsOpen(true);
      return;
    }

    const newIndex = highlightedIndex + direction;
    if (newIndex >= 0 && newIndex < options.length) {
      setHighlightedIndex(newIndex);
      optionRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  // Handles input field keyboard actions
  function handleInputKeyDown(event) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault(); // Prevent space and new line
      handleInputSelection();
    } else if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      event.preventDefault(); // Prevent page scroll

      handleArrowKeys(event.code === "ArrowDown" ? 1 : -1);
    } else if (event.code === "Escape") {
      setIsOpen(false);
    }
  }

  // Handles selecting or adding options via input
  function handleInputSelection() {
    if (inputText !== "") {
      selectOption({ label: inputText, value: inputText });
      setInputText("");
    } else if (isOpen) {
      selectOption(options[highlightedIndex]);
    }

    inputRef.current.innerText = "";
  }

  // Closing dropdown on blur, except if focus remains inside container
  function handleBlurContainer(event) {
    if (containerRef.current && containerRef.current.contains(event.relatedTarget)) {
      event.preventDefault();
    } else {
      setIsOpen(false);
    }
  }

  // Option rendering with highlighting and selection logic
  function renderOptions(options) {
    return options.map((option, index) => {
      const isHighlighted = index === highlightedIndex;
      const isSelected = isOptionSelected(option);

      let optionClass = styles.option;
      if (isSelected) {
        optionClass += ` ${styles.selected}`;
      }
      if (isHighlighted) {
        optionClass += ` ${styles.highlighted}`;
      }

      return (
        <li
          key={option.value}
          ref={(el) => (optionRefs.current[index] = el)}
          className={optionClass}
          onClick={(e) => {
            e.stopPropagation();
            selectOption(option);
          }}
          onMouseEnter={() => setHighlightedIndex(index)}
        >
          {option.label}
        </li>
      );
    });
  }

  // Checking if the option is selected
  function isOptionSelected(option) {
    return !!selectedOptions.find(({ label }) => label === option.label);
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={styles.container}
      onKeyDown={handleContainerKeyDown}
      onBlur={handleBlurContainer}
      onClick={toggleDropdown}
    >
      <div className={styles.value}>
        {selectedOptions.map((selectedOption) => (
          <button
            key={selectedOption.value}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              selectOption(selectedOption);
            }}
            className={styles["option-badge"]}
          >
            {selectedOption.label}
            <span className={styles["remove-btn"]}>&times;</span>
          </button>
        ))}

        <span
          contentEditable
          ref={inputRef}
          className={styles.input}
          onInput={(event) => setInputText(event.target.innerText)}
          onKeyDown={handleInputKeyDown}
        />
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onChange([]);
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>

      <div className={styles.divider}></div>
      <div className={styles.caret}></div>

      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>{renderOptions(options)}</ul>
    </div>
  );
}
