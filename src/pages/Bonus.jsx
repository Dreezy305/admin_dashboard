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
import { useParams, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import { observer } from "mobx-react-lite";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import Store from "../components/Store";

const AddBonus = observer(() => {
  const [store] = useState(() => Store);
  const param = useParams();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [id, setId] = useState("");
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
  const router = useHistory();
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

  useEffect(() => {
    getBonus(param.id);
  }, []);

  const getBonus = async (id) => {
    setLoading(true);
    const url = `${process.env.API_URL}configuration/${id}`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          let data = res.data;
          setId(data.id);
          setTitle(data.title);
          store.setBonus(data.content.bonus);
          setType(data.content.type);
          setMinOdd(data.content.min_odd);
          setMaxOdd(data.content.max_odd);
          setMinStake(data.content.min_stake);
          setMaxWin(data.content.max_win);
          setExpiration(data.content.expiration);
          setFrequency(data.content.occurence);
          setUsage(data.content.usage);
          setLoading(false);
        } else {
          Alert.error("Unable to get bonus", 3000);
        }
      });
  };

  const updateBonus = async (body) => {
    body = JSON.stringify(body);
    setLoading(true);
    const url = `${process.env.API_URL}configuration/update`;
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
          Alert.success("Bonus updated successfully", 3000);
        } else {
          Alert.error("Unable to update bonus", 3000);
        }
      });
  };

  const saveBonus = () => {
    if (!title || title < 5) {
      Alert.error("Bonus title is too short");
    } else {
      const form = {
        id,
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
          bonus: store.bonus,
        },
      };
      updateBonus(form);
    }
  };

  const handleBonus = (a) => {
    let b = store.bonus;
    let diff = Array.from(
      { length: a - store.bonus.length },
      (_, i) => i + 1
    ).map(() => ({
      selection: "0",
      percent: "0",
    }));
    b = [...b, ...diff];

    store.setBonus(b);
  };

  const handleSelect = (val, i) => {
    let b = store.bonus;
    let current = b[i];
    b[i] = { selection: val, percent: current.percent };
    store.setBonus(b);
  };

  const handlePercent = (val, i) => {
    let b = store.bonus;
    let current = b[i];
    b[i] = { percent: val, selection: current.selection };
    store.setBonus(b);
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
    store.setBonus(data);
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page={title} />
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
                        onChange={handleBonus}
                        placeholder="Selection length"
                        data={Array.from({ length: selections }).map(
                          (item, key) => ({
                            value: key + 1,
                            label: "Selection count: " + (key + 1),
                          })
                        )}
                      />
                    </div>
                    <br />
                    <form onSubmit={saveSelection}>
                      <div style={{ height: 320, overflow: "auto" }}>
                        {store.bonus.map((item, key) => (
                          <Row key={key}>
                            <Col lg={8}>
                              <label>Selection</label>
                              <InputNumber
                                className="selection"
                                value={item.selection}
                                onChange={(value) => handleSelect(value, key)}
                              />
                            </Col>
                            <Col lg={9}>
                              <label>Percentage</label>
                              <InputNumber
                                className="percent"
                                value={item.percent}
                                onChange={(value) => handlePercent(value, key)}
                                postfix="%"
                              />
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
                        <Input type="text" value={title} onChange={setTitle} />
                        <br />
                        <label>Type</label>
                        <SelectPicker
                          block
                          value={type}
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
                          <InputNumber value={min_odd} onChange={setMinOdd} />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          Max odd
                          <br />
                          <InputNumber value={max_odd} onChange={setMaxOdd} />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          Min stake (amount)
                          <br />
                          <InputNumber
                            value={min_stake}
                            onChange={setMinStake}
                          />
                        </Col>
                        <Col sm={24} lg={12}>
                          <br />
                          Max potential winning (amount)
                          <br />
                          <InputNumber value={max_win} onChange={setMaxWin} />
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
                            value={frequency}
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
                          <DatePicker
                            block
                            value={expiration}
                            onChange={setExpiration}
                          />
                        </Col>

                        <Col sm={24} lg={24}>
                          <br />
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
});

export default AddBonus;
