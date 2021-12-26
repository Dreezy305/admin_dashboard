/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Container,
  Content,
  Panel,
  Uploader,
  InputPicker,
  Input,
  Button,
} from "rsuite";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import Editor from "../components/Editor";

export default function AddPopup() {
  const [active, onSelect] = useState("paystack");

  const handleEditor = (val) => {
    onSelect(val);
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Add popup" user="Howard Stern" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <Input placeholder="Page title" />
                  <br />
                  <Input placeholder="Page description" />
                  <br />
                  <Editor placeholder="" onChange={handleEditor} />
                  <br />

                  <Button appearance="primary">Save</Button>
                </div>
              </Panel>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
