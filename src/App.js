import "./App.css";
import Person from "./Person";
import React, { useEffect, useState } from "react";

const react = "React JS";

const welcome = {
  greeting: "Hello",
  title: react,
};

const getWord = (word) => word;

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    ObjectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    ObjectID: 1,
  },
];

const getAsyncStories = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000);
  });

function App() {
  //  testFunction();

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "");

  const [stories, setStories] = useState([]);

  useEffect(() => {
    getAsyncStories().then((result) => {
      setStories(result.data.stories);
    });
  }, []);

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => story.ObjectID !== item.ObjectID
    );

    setStories(newStories);
  };

  const handleSearch = (event) => {
    console.log("From the handleSearch ", event.target.value);
    setSearchTerm(event.target.value);
    //localStorage.setItem("search", event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
      <hr />
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
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
      <p>
        Searching for : <strong>{value}</strong>
      </p>
    </>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.ObjectID} item={item} onRemoveItem={onRemoveItem}></Item>
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
