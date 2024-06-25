import "./App.css";
import Person from "./Person";
import React from "react";

const react = "React JS";

const welcome = {
  greeting: "Hello",
  title: react,
};

const getWord = (word) => word;

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

  const [searchTerm, setSearchTerm] = React.useState("React");

  const handleSearch = (event) => {
    console.log("From the handleSearch ", event.target.value);
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <Greeting {...welcome} />
      <Search
        label="Search"
        onSearch={handleSearch}
        searchTerm={searchTerm}
        value={searchTerm}
      />
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

const Search = (props) => {
  return (
    <div>
      <label htmlFor="search">{props.label} </label>
      <input
        id="search"
        type="text"
        onChange={props.onSearch}
        value={props.searchTerm}
      />
      <p>
        Searching for : <strong>{props.searchTerm}</strong>{" "}
      </p>
    </div>
  );
};

const List = (props) =>
  props.list.map((item) => (
    <div key={item.ObjectID}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span> {item.author}</span>
      <span> {item.num_comments}</span>
      <span> {item.points}</span>
    </div>
  ));

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
