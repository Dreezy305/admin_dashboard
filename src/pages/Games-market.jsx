/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Container, Content, Panel, CheckTreePicker, Button } from "rsuite";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function GameMarket() {
  const [active, onSelect] = useState("paystack");

  const handleSelect = (val) => {
    onSelect(val);
  };

  const data = [
    {
      value: "1",
      label: "Soccer",
      children: [
        { value: "4", label: "English Premier League" },
        { value: "5", label: "Spanish La Liga" },
        { value: "5", label: "Italia Serie A" },
      ],
    },
    {
      value: "2",
      label: "Basketball",
      children: [],
    },
  ];

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Games and markets management" user="Howard Stern" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <CheckTreePicker
                    defaultExpandAll
                    data={data}
                    style={{ width: 280 }}
                  />
                  <br />
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
