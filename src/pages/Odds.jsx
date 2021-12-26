import React, { useState } from "react";
import {
  Container,
  Content,
  Panel,
  Row,
  Col,
  Nav,
  Input,
  InputNumber,
  CheckPicker,
  Button,
} from "rsuite";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function Odds() {
  const [active, onSelect] = useState("paystack");

  const handleSelect = (val) => {
    onSelect(val);
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Odds management" user="Howard Stern" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <Row>
                    <Col sm={24} lg={12}>
                      Odds list
                      <CheckPicker
                        data={[
                          { value: "1", label: "1/2" },
                          { value: "2", label: "Double chance" },
                          { value: "3", label: "Over/under" },
                        ]}
                        placeholder=""
                        block
                      />
                      <br />
                    </Col>
                    <Col sm={24} lg={12}>
                      Maximum odds for a ticket{" "}
                      <InputNumber placeholder="Maximum odds = 40" />
                      <br />
                    </Col>
                    <Col sm={24} lg={12}>
                      Minimum amount for a game{" "}
                      <InputNumber placeholder="Minimum amount = 100,000" />
                      <br />
                    </Col>
                    <Col sm={24} lg={12}>
                      Maximum amount for a game{" "}
                      <InputNumber placeholder="Maximum amount = 100,000" />
                      <br />
                    </Col>
                  </Row>
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
