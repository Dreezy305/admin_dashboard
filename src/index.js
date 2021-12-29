/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React from "react";
import ReactDOM from "react-dom";
import Routes from "./components/Routes";
import "./styles/styles.scss";

const App = () => <Routes />;

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
