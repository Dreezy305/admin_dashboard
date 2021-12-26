/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from "react";
import { Button } from "rsuite";
export default function Noaccess() {
  return (
    <div className="container">
      <br />
      <br />
      <br />
      <br />
      <br />
      <center>
        <h3>Oops! You are not authorized to access this page.</h3>
        <br />
        <Button href="/" color="red" size="lg">
          &larr; Back to home
        </Button>
      </center>
    </div>
  );
}
