/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from "react";
import { Button } from "rsuite";
export default function Notfound() {
  return (
    <div className="container">
      <br />
      <br />
      <br />
      <br />
      <br />
      <center>
        <h3>Oops! Page not found or has been deleted</h3>
        <br />
        <br />
        <Button href="/" color="red" size="lg">
          &larr; Back to home
        </Button>
      </center>
    </div>
  );
}
