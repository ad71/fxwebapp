"use client";

import { useState, useCallback } from "react";
import styles from "./search-filter.module.css";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  activeGroup: string;
  onGroupChange: (group: string) => void;
  groups: string[];
}

export function SearchFilter({
  value,
  onChange,
  activeGroup,
  onGroupChange,
  groups,
}: SearchFilterProps) {
  const [focused, setFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className={styles.filterBar}>
      <div className={`${styles.searchWrap} ${focused ? styles.searchFocused : ""}`}>
        <svg
          className={styles.searchIcon}
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search currency pairs..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {value && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>
      <div className={styles.pills}>
        <button
          type="button"
          className={`${styles.pill} ${activeGroup === "All" ? styles.pillActive : ""}`}
          onClick={() => onGroupChange("All")}
        >
          All
        </button>
        {groups.map((g) => (
          <button
            key={g}
            type="button"
            className={`${styles.pill} ${activeGroup === g ? styles.pillActive : ""}`}
            onClick={() => onGroupChange(g)}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}
