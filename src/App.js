import "./App.css";
import Person from "./Person";
import React from "react";

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

function App() {
  const stories = [
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

  testFunction();

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

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
      <Search label="Search" onSearch={handleSearch} search={searchTerm} />
      <hr />
      <List list={searchedStories} />
      <DeveloperList />
    </div>
  );
}

/* ****************    Components     **************** */

const Greeting = ({ greeting, title }) => {
  return (
    <h1>
      {greeting}, to the {getWord("World")} of {title} !!{" "}
    </h1>
  );
};

const Search = ({ onSearch, label, search }) => {
  return (
    <div>
      <label htmlFor="search">{label} </label>
      <input id="search" type="text" onChange={onSearch} value={search} />
      <p>
        Searching for : <strong>{search}</strong>{" "}
      </p>
    </div>
  );
};

const List = ({ list }) =>
  list.map(({ ObjectID, ...item }) => <Item key={ObjectID} {...item}></Item>);

const Item = ({ url, title, author, num_comments, points }) => (
  <div>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span> {author}</span>
    <span> {num_comments}</span>
    <span> {points}</span>
  </div>
);

const DeveloperList = () => {
  const John = new Person("John", "Snow");
  const Tyrion = new Person("Tyrion", "Lannister");
  console.log(John);
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

const testFunction = () => {
  console.log("------------------ TEST FUNCTION ------------------");
  const numbers = [1, 4, 9, 16];
  const newNumbers = numbers.map((number) => number * 20);
  console.log(newNumbers);
};

export default App;
