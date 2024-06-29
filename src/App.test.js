import React from "react";
import renderer from "react-test-renderer";
import axios from "axios";
import App, { Item, List, SearchForm, InputWithLabel } from "./App";

jest.mock("axios");
// test suite
describe("truthy and falsy", () => {
  // test case
  it("true to be true", () => {
    // test assertion
    expect(true).toBe(true);
  });

  // test case
  it("false to be false", () => {
    // test assertion
    expect(false).toBe(false);
  });
});

describe("Item", () => {
  const item = {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  };

  const handleRemoveItem = jest.fn();

  let component;

  beforeEach(() => {
    component = renderer.create(
      <Item item={item} onRemoveItem={handleRemoveItem}></Item>
    );
  });

  it("renders all properties", () => {
    //const component = renderer.create(<Item item={item}></Item>);

    expect(component.root.findByType("a").props.href).toEqual(
      "https://reactjs.org/"
    );
    expect(component.root.findAllByType("span")[1].props.children).toEqual(
      "Jordan Walke"
    );
  });

  it("calls onRemoveItem on button click", () => {
    //const handleRemoveItem = jest.fn();

    /*const component = renderer.create(
      <Item item={item} onRemoveItem={handleRemoveItem}></Item>
    );*/

    component.root.findByType("button").props.onClick();

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(item);

    expect(component.root.findAllByType(Item).length).toBe(1);
  });

  test("renders snapShot", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("List", () => {
  const list = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  it("renders two items", () => {
    const component = renderer.create(<List list={list}></List>);

    expect(component.root.findAllByType(Item).length).toEqual(2);
  });
});

describe("SearchForm", () => {
  const searchFormInput = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
    buttonStyle: "button_large",
  };

  let component;
  beforeEach(() => {
    component = renderer.create(<SearchForm {...searchFormInput}></SearchForm>);
  });

  it("renders the input field with its value", () => {
    expect(component.root.findByType("input").props.value).toEqual("React");
  });

  it("changes the input field", () => {
    const pseudoEvent = { target: "Redux" };

    component.root.findByType("input").props.onChange(pseudoEvent);

    expect(searchFormInput.onSearchInput).toHaveBeenCalledTimes(1);
    expect(searchFormInput.onSearchInput).toHaveBeenCalledWith(pseudoEvent);
  });

  it("submit the form", () => {
    const pseudoEvent = {};
    component.root.findByType("form").props.onSubmit(pseudoEvent);
    expect(searchFormInput.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(searchFormInput.onSearchSubmit).toHaveBeenCalledWith(pseudoEvent);
  });

  it("disables the button and prevents submit", () => {
    component.update(
      <SearchForm {...searchFormInput} searchTerm=""></SearchForm>
    );

    expect(component.root.findByType("button").props.disabled).toBeTruthy();
  });
});

describe("App", () => {
  it("succeeds fetching data with list", async () => {
    const list = [
      {
        title: "React",
        url: "https://reactjs.org/",
        author: "Jordan Walke",
        num_comments: 3,
        points: 4,
        objectID: 0,
      },
      {
        title: "Redux",
        url: "https://redux.js.org/",
        author: "Dan Abramov, Andrew Clark",
        num_comments: 2,
        points: 5,
        objectID: 1,
      },
    ];

    const promise = Promise.resolve({
      data: {
        hits: list,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    let component;
    await renderer.act(async () => {
      component = renderer.create(<App></App>);
    });

    expect(component.root.findByType(List).props.list).toEqual(list);
  });

  it("fails fetching data with a list", async () => {
    const promise = Promise.reject();

    axios.get.mockImplementationOnce(() => promise);

    let component;

    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    expect(component.root.findByType("p").props.children).toEqual(
      "Something went wrong ...."
    );
  });
});
