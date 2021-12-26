import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Panel,
  Row,
  Col,
  Nav,
  Input,
  InputNumber,
  InputPicker,
  Button,
  Alert,
} from "rsuite";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import { validateEmail } from "../components/Utils";

export default function Exposure() {
  const [loading, setLoading] = useState(false);
  const [max_odd, setMaxOdd] = useState(0);
  const [max_withdrawal, setMaxWithdrawal] = useState(0);
  const [email, setEmail] = useState("");
  const [exposure, setExposure] = useState({});
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
    getExposure();
  }, []);

  const getExposure = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}configuration/exposure`;
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          let data = res.data;
          setExposure(data);
          setMaxOdd(data.content.max_odd);
          setMaxWithdrawal(data.content.max_withdrawal);
          setEmail(data.content.email);
          setLoading(false);
        }
      });
  };

  const updateExposure = async (body) => {
    body = JSON.stringify(body);

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
          Alert.success("Exposure config updated", 3000);
        } else {
          Alert.error("Unable to update exposure config", 3000);
        }
        setLoading(false);
      });
  };

  const save = () => {
    if (!max_odd) {
      Alert.error("Maximum odd cannot be lesser than zero!");
    } else if (!max_withdrawal) {
      Alert.error("Maximum withdrawal cannot be lesser than zero!");
    } else if (validateEmail(email) === false) {
      Alert.error("Invalid email address");
    } else {
      const form = {
        id: exposure.id,
        title: exposure.title,
        content: {
          max_odd,
          max_withdrawal,
          email,
        },
      };

      updateExposure(form);
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Exposure management" user="Howard Stern" />
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
                      Max Odds{" "}
                      <InputNumber value={max_odd} onChange={setMaxOdd} />
                      <br />
                    </Col>
                    <Col sm={24} lg={12}>
                      Max Withdrawal
                      <InputNumber
                        value={max_withdrawal}
                        onChange={setMaxWithdrawal}
                      />
                      <br />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={24} lg={24}>
                      Email to notify
                      <Input type="email" value={email} onChange={setEmail} />
                      <br />
                    </Col>
                  </Row>
                  <Button appearance="primary" loading={loading} onClick={save}>
                    Save
                  </Button>
                </div>
              </Panel>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
