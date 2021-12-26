/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Panel,
  Row,
  Col,
  Nav,
  Icon,
  Input,
  InputNumber,
  InputPicker,
  Button,
  SelectPicker,
  Divider,
  DatePicker,
  Alert,
} from "rsuite";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function AddBonus() {
  const router = useHistory();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [bonus, setBonus] = useState([]);
  const [selections, setSelections] = useState(50);
  const [min_odd, setMinOdd] = useState(0);
  const [max_odd, setMaxOdd] = useState(0);
  const [min_stake, setMinStake] = useState(0);
  const [max_win, setMaxWin] = useState(0);
  const [ticket_played, setTicketPlayed] = useState(0);
  const [ticket_loss, setTicketLoss] = useState(0);
  const [deposit_made, setDepositMade] = useState(0);
  const [amount_spent, setAmountSpent] = useState(0);
  const [frequency, setFrequency] = useState("");
  const [expiration, setExpiration] = useState();
  const [usage, setUsage] = useState("");
  const [role, setRole] = useState("");
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "accountant" ||
    user.role === "finance" ||
    user.role === "media-marketing" ||
    user.role === "accountant" ||
    user.role === "customer-service"
      ? router.push("/no-access")
      : null;
  }, []);

  const createBonus = async (body) => {
    body = JSON.stringify(body);
    setLoading(true);
    const url = `${process.env.API_URL}configuration/create`;
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          Alert.success("Bonus created successfully", 3000);
          router.push(`/bonus/${res.data.id}`);
        } else {
          Alert.error("Unable to create bonus", 3000);
        }
      });
  };

  const saveBonus = () => {
    if (!title || title < 5) {
      Alert.error("Bonus title is too short");
    } else {
      const form = {
        title,
        description: "bonus",
        content: {
          type,
          min_odd,
          max_odd,
          min_stake,
          max_win,
          ticket_played,
          ticket_loss,
          deposit_made,
          amount_spent,
          frequency,
          expiration,
          usage,
          bonus,
        },
      };

      console.log(form);
      createBonus(form);
    }
  };

  const saveSelection = (e) => {
    e.preventDefault();

    setLoading2(true);

    let data = [];
    let select = document.querySelectorAll(".selection input");
    let percent = document.querySelectorAll(".percent input");

    select.forEach((item, key) => {
      const { value } = item;
      const p1 = percent[key].value;
      const s1 = { selection: value, percent: p1 };
      data.push(s1);
    });
    setLoading2(false);
    setBonus(data);
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Add Bonus" />
          <Content className="container">
            <div className="inners">
              <Row>
                <Col sm={24} lg={7}>
                  <Panel
                    shaded
                    bordered
                    bodyFill
                    style={{ backgroundColor: "#fff", padding: 10 }}
                  >
                    <div>
                      <h4>Bonus percentage</h4>
                      <InputPicker
                        value={selections}
                        onChange={setSelections}
                        data={Array.from({ length: 50 }).map((item, key) => ({
                          value: key + 1,
                          label: "Selection count: " + (key + 1),
                        }))}
                      />
                    </div>
                    <br />
                    <form onSubmit={saveSelection}>
                      <div style={{ height: 320, overflow: "auto" }}>
                        {Array.from({ length: selections }).map((item, key) => (
                          <Row key={key}>
                            <Col lg={6}>
                              <label>Selection</label>
                              <InputNumber className="selection" />
                            </Col>
                            <Col lg={8}>
                              <label>Percentage</label>
                              <InputNumber className="percent" postfix="%" />
                            </Col>

                            <Col lg={24}>
                              <Divider />
                            </Col>
                          </Row>
                        ))}
                      </div>
                      <div>
                        <br />

                        <Button
                          type="submit"
                          color="violet"
                          block
                          loading={loading2}
                        >
                          Set Selection / Percentage
                        </Button>
                      </div>
                    </form>
                  </Panel>
                </Col>
                <Col sm={24} lg={12}>
                  <Panel
                    shaded
                    bordered
                    bodyFill
                    style={{ backgroundColor: "#fff", padding: 10 }}
                  >
                    <div className="form">
                      <Row>
                        <h4>Conditions</h4>
                        <label>Bonus title</label>
                        <Input type="text" onChange={setTitle} />
                        <br />
                        <label>Type</label>
                        <SelectPicker
                          block
                          onChange={setType}
                          data={[
                            { label: "Default", value: "default" },
                            { label: "Promotion", value: "promotion" },
                          ]}
                        />
                        <Col sm={24} lg={12}>
                          <br />
                          Min odd
                          <br />
                          <InputNumber onChange={setMinOdd} />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          Max odd
                          <br />
                          <InputNumber onChange={setMaxOdd} />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          Min stake (amount)
                          <br />
                          <InputNumber onChange={setMinStake} />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          Max potential winning (amount)
                          <br />
                          <InputNumber onChange={setMaxWin} />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          No of Ticket played
                          <br />
                          <InputNumber onChange={setTicketPlayed} />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          No of Ticket loss
                          <br />
                          <InputNumber onChange={setTicketLoss} />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          No of deposit made
                          <br />
                          <InputNumber onChange={setDepositMade} />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          Min amount spent
                          <br />
                          <InputNumber onChange={setAmountSpent} />
                        </Col>
                      </Row>
                      <Row>
                        <Divider />
                        <h4>Redeem Criteria</h4>
                      </Row>
                      <Row>
                        <Col sm={24} lg={12}>
                          <br />
                          Frequency
                          <br />
                          <SelectPicker
                            block
                            onChange={setFrequency}
                            data={[
                              { label: "None", value: "None" },
                              { label: "One time", value: "One time" },
                              { label: "Once a week", value: "1 week" },
                              { label: "Once a month", value: "1 month" },
                              {
                                label: "Once in 2 months",
                                value: "2 months",
                              },
                              {
                                label: "Once in 3 months",
                                value: "3 months",
                              },
                              {
                                label: "Once in 6 months",
                                value: "6 months",
                              },
                              { label: "Once a year", value: "12 months" },
                            ]}
                          />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          Expiration (in days)
                          <br />
                          <DatePicker block onChange={setExpiration} />
                        </Col>

                        <Col sm={24} lg={24}>
                          <br />
                          <Button
                            appearance="primary"
                            block
                            onClick={saveBonus}
                            loading={loading}
                            size={"lg"}
                          >
                            Save
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Panel>
                </Col>
              </Row>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
