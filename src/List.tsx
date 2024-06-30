import { ItemProps, ListProps, Stories } from "./definitions";

import React, { useState } from "react";
import styles from "./App.module.css";
import { ReactComponent as Check } from "./check.svg";
import { sortBy } from "lodash";
import { ReactComponent as UpArrow } from "./up-arrow.svg";
import { ReactComponent as DownArrow } from "./down-arrow.svg";

const List = ({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = useState({
    sortKey: "NONE",
    isReverse: false,
  });
  //console.log(sort);
  const SORTS = {
    NONE: (list: Stories) => list,
    TITLE: (list: Stories) => sortBy(list, "title"),
    AUTHOR: (list: Stories) => sortBy(list, "author"),
    COMMENTS: (list: Stories) => sortBy(list, "num_comments").reverse(),
    POINTS: (list: Stories) => sortBy(list, "points").reverse(),
  };

  const handleSort = (sortKey: string) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey: sortKey, isReverse: isReverse });
  };
  console.log(sort);

  const sortFunction = SORTS[sort.sortKey as keyof typeof SORTS];

  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);

  return (
    <>
      <div style={{ display: "flex" }}>
        <span style={{ width: "40%" }}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSmall} ${
              sort.sortKey === "TITLE" ? styles.buttonActive : ""
            }`}
            onClick={() => handleSort("TITLE")}
          >
            <b>Title </b>
            {sort.sortKey === "TITLE" && sort.isReverse ? (
              <DownArrow height="12px" width="12px" />
            ) : (
              <UpArrow height="12px" width="12px" />
            )}
          </button>
        </span>
        <span style={{ width: "30%" }}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSmall} ${
              sort.sortKey === "AUTHOR" ? styles.buttonActive : ""
            }`}
            onClick={() => handleSort("AUTHOR")}
          >
            <b>Author </b>
            {sort.sortKey === "AUTHOR" && sort.isReverse ? (
              <DownArrow height="12px" width="12px" />
            ) : (
              <UpArrow height="12px" width="12px" />
            )}
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSmall} ${
              sort.sortKey === "COMMENTS" ? styles.buttonActive : ""
            }`}
            onClick={() => handleSort("COMMENTS")}
          >
            <b>Comments </b>
            {sort.sortKey === "COMMENTS" && sort.isReverse ? (
              <DownArrow height="12px" width="12px" />
            ) : (
              <UpArrow height="12px" width="12px" />
            )}
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSmall} ${
              sort.sortKey === "POINTS" ? styles.buttonActive : ""
            }`}
            onClick={() => handleSort("POINTS")}
          >
            <b>Points </b>
            {sort.sortKey === "POINTS" && sort.isReverse ? (
              <DownArrow height="12px" width="12px" />
            ) : (
              <UpArrow height="12px" width="12px" />
            )}
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <b>Actions</b>
        </span>
      </div>

      {sortedList.map((item) => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem}
        ></Item>
      ))}
    </>
  );
};

const Item = ({ item, onRemoveItem }: ItemProps) => {
  return (
    <div className={styles.item}>
      <span style={{ width: "40%" }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}> {item.num_comments}</span>
      <span style={{ width: "10%" }}> {item.points} </span>
      <span style={{ width: "10%" }}>
        <button
          className={`${styles.button} ${styles.buttonSmall}`}
          type="button"
          onClick={() => onRemoveItem(item)}
        >
          <Check height="12px" width="12px" />
        </button>
      </span>
    </div>
  );
};

export { List };
