import React from "react";
import ReactDOM from "react-dom";
import Routes from "./components/Routes";
import "./styles/styles.scss";

const App = () => <Routes />;

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
