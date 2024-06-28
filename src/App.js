import "./App.css";
import Person from "./Person";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import axios from "axios";

const react = "React JS";

const welcome = {
  greeting: "Hello",
  title: react,
};

const getWord = (word) => word;

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

// const initialStories = [
//   {
//     title: "React",
//     url: "https://reactjs.org/",
//     author: "Jordan Walke",
//     num_comments: 3,
//     points: 4,
//     ObjectID: 0,
//   },
//   {
//     title: "Redux",
//     url: "https://redux.js.org/",
//     author: "Dan Abramov, Andrew Clark",
//     num_comments: 2,
//     points: 5,
//     ObjectID: 1,
//   },
// ];

// const getAsyncStories = () =>
//   new Promise((resolve, reject) => {
//     //setTimeout(reject, 2000);
//     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000);
//   });

const storiesReducer = (state, action) => {
  // if (action.type === "SET_STORIES") {
  //   return action.payload;
  // } else if (action.type === "REMOVE_STORIES") {
  //   return state.filter((story) => story.ObjectID !== action.payload.ObjectID);
  // } else {
  //   throw new Error();
  // }
  console.log("From the storiesReducer", state);
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => story.objectID !== action.payload.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
function App() {
  //  testFunction();

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  //const [stories, setStories] = useState([]);

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  // const [isLoading, setIsLoading] = useState(false);

  // const [isError, setIsError] = useState(false);

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };
  const handleFetchStories = useCallback(() => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    axios
      .get(url)
      .then((result) => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.data.hits,
        });
      })
      .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({ type: "REMOVE_STORY", payload: item });
    // const newStories = stories.data.filter(
    //   (story) => story.ObjectID !== item.ObjectID
    // );

    //dispatchStories({ type: "SET_STORIES", payload: newStories });
    //setStories(newStories);
  };

  const handleSearch = (event) => {
    console.log("From the handleSearch ", event.target.value);
    setSearchTerm(event.target.value);
    //localStorage.setItem("search", event.target.value);
  };

  // const searchedStories = stories.data.filter((story) =>
  //   story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  console.log("------------------ APP FUNCTION ------------------");
  return (
    <div>
      <Greeting {...welcome} />
      <InputWithLabel
        id="search"
        onInputChange={handleSearch}
        value={searchTerm}
        isFocused
      >
        <Text>Search : </Text>
      </InputWithLabel>
      <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
        Submit
      </button>
      <hr />
      {stories.isError && <p>Something went wrong ....</p>}
      {stories.isLoading ? (
        <p>Loading ... </p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

      <DeveloperList />
    </div>
  );
}

/* ****************    Components     **************** */

const Greeting = ({ greeting, title }) => {
  return (
    <h1>
      {greeting}, to the {getWord("World")} of {title} !!
    </h1>
  );
};

const Text = ({ children }) => <strong>{children}</strong>;

const InputWithLabel = ({
  id,
  type = "text",
  onInputChange,
  value,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}> {children}</label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        onChange={onInputChange}
        value={value}
      />
      {/* <p>
        Searching for : <strong>{value}</strong>
      </p> */}
    </>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}></Item>
  ));

const Item = ({ item, onRemoveItem }) => {
  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };

  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span> {item.author}</span>
      <span> {item.num_comments}</span>
      <span> {item.points} </span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </div>
  );
};

const DeveloperList = () => {
  const John = new Person("John", "Snow");
  const Tyrion = new Person("Tyrion", "Lannister");
  // console.log(John);
  return (
    <div>
      <Developer person={John} />
      <Developer2 {...Tyrion} />
    </div>
  );
};

const Developer = (props) => {
  return (
    <div>
      <h4>{props.person.getName()}</h4>
    </div>
  );
};

const Developer2 = ({ firstname, lastname }) => {
  return (
    <div>
      <h4>
        {firstname} {lastname}
      </h4>
    </div>
  );
};

// const testFunction = () => {
//   console.log("------------------ TEST FUNCTION ------------------");
//   const numbers = [1, 4, 9, 16];
//   const newNumbers = numbers.map((number) => number * 20);
//   console.log(newNumbers);
// };

export default App;
