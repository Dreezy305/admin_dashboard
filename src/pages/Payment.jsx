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

export default function Payment() {
  const [active, onSelect] = useState("paystack");
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [payment, setPayment] = React.useState({});
  const [minimum_deposit, setMinDeposit] = React.useState(0);
  const [maximum_deposit, setMaxDeposit] = React.useState(0);
  const [minimum_withdrawal, setMinWithdrawal] = React.useState(0);
  const [maximum_withdrawal, setMaxWithdrawal] = React.useState(0);
  const [paystack, setPaystack] = React.useState({});
  const [paystackPublic, setPaystackPub] = React.useState();
  const [paystackSecret, setPaystackSec] = React.useState();
  const [flutterwave, setFlutterwave] = React.useState({});
  const [flutterwavePublic, setFlutterwavePub] = React.useState();
  const [flutterwaveSecret, setFlutterwaveSec] = React.useState();
  const [flutterwaveEncryption, setFlutterwaveEnc] = React.useState();
  const [interswitch, setInterswitch] = React.useState({});
  const [interswitchMerchant, setInterswitchMerc] = React.useState();
  const [interswitchEnv, setInterswitchEnv] = React.useState();
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
    getProcessor("payment");
    getProcessor("Paystack");
    getProcessor("Flutterwave");
    getProcessor("Interswitch");
  }, []);

  const getProcessor = async (title) => {
    setLoading(true);
    const url = `${process.env.API_URL}configuration/${title}`;
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
          if (title === "Paystack") {
            setPaystack(res.data);
            setPaystackPub(res.data.content.public_key);
            setPaystackSec(res.data.content.secret_key);
          } else if (title === "Flutterwave") {
            setFlutterwave(res.data);
            setFlutterwavePub(res.data.content.public_key);
            setFlutterwaveSec(res.data.content.secret_key);
            setFlutterwaveEnc(res.data.content.encryption_key);
          } else if (title === "Interswitch") {
            setInterswitch(res.data);
            setInterswitchMerc(res.data.content.merchant_code);
            setInterswitchEnv(res.data.content.environment);
          } else if (title === "payment") {
            setPayment(res.data);
            setMinDeposit(res.data.content.minimum_deposit);
            setMaxDeposit(res.data.content.maximum_deposit);
            setMinWithdrawal(res.data.content.minimum_withdrawal);
            setMaxWithdrawal(res.data.content.maximum_withdrawal);
          }

          setLoading(false);
        }
      });
  };

  const updateProcessor = async (body) => {
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
          Alert.success("Payment processor detail updated", 3000);
        } else {
          Alert.error("Unable to update payment processor", 3000);
        }
        setLoading(false);
        setLoading2(false);
      });
  };

  const handleSelect = (val) => {
    onSelect(val);
  };

  const savePayment = () => {
    setLoading(true);
    let pay = payment;
    pay.content = {
      minimum_deposit,
      maximum_deposit,
      minimum_withdrawal,
      maximum_withdrawal,
    };
    updateProcessor(pay);
  };

  const savePaystack = () => {
    setLoading2(true);
    let pay = paystack;
    pay.content = { public_key: paystackPublic, secret_key: paystackSecret };
    updateProcessor(pay);
  };

  const saveFlutterwave = () => {
    setLoading2(true);
    let pay = flutterwave;
    pay.content = {
      public_key: flutterwavePublic,
      secret_key: flutterwaveSecret,
      encryption_key: flutterwaveEncryption,
    };
    updateProcessor(pay);
  };

  const saveInterswitch = () => {
    setLoading2(true);
    let pay = interswitch;
    pay.content = {
      merchant_code: paystackPublic,
      environment: interswitchEnv,
    };
    updateProcessor(pay);
  };

  const CustomNav = ({ active, onSelect, ...props }) => {
    return (
      <Nav
        {...props}
        activeKey={active}
        onSelect={onSelect}
        style={{ marginBottom: 30 }}
      >
        <Nav.Item eventKey="paystack">Paystack</Nav.Item>
        <Nav.Item eventKey="flutterwave">Flutterwave</Nav.Item>
        <Nav.Item eventKey="interswitch">Interswitch</Nav.Item>
      </Nav>
    );
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu active={"10-3"} />
        <Container>
          <Heading page="Payment management" user="Howard Stern" />
          <Content className="container">
            <div className="inner">
              <h4>Payment Limits</h4>
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <Row>
                    <Col sm={24} lg={12}>
                      <label>Minimum Deposit</label>
                      <InputNumber
                        value={minimum_deposit}
                        onChange={setMinDeposit}
                      />
                      <br />
                    </Col>
                    <Col sm={24} lg={12}>
                      <label>Maximum Deposit</label>
                      <InputNumber
                        value={maximum_deposit}
                        onChange={setMaxDeposit}
                      />
                      <br />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={24} lg={12}>
                      <label>Minimum Withdrawal</label>
                      <InputNumber
                        value={minimum_withdrawal}
                        onChange={setMinWithdrawal}
                      />
                      <br />
                    </Col>
                    <Col sm={24} lg={12}>
                      <label>Maximum Withdrawal</label>
                      <InputNumber
                        value={maximum_withdrawal}
                        onChange={setMaxWithdrawal}
                        required={true}
                      />
                      <br />
                    </Col>
                  </Row>
                  <Button
                    appearance="primary"
                    loading={loading}
                    onClick={savePayment}
                  >
                    Save
                  </Button>
                </div>
              </Panel>
              <br />
              <br />
              <h4>Payment Integration</h4>
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <CustomNav
                  appearance="subtle"
                  active={active}
                  onSelect={handleSelect}
                />
                <div
                  className="form"
                  style={{ display: active === "paystack" ? "block" : "none" }}
                >
                  <label>Public key</label>
                  <Input
                    type="text"
                    value={paystackPublic}
                    onChange={setPaystackPub}
                  />
                  <br />
                  <label>Secret key</label>
                  <Input
                    type="text"
                    value={paystackSecret}
                    onChange={setPaystackSec}
                    isRequired
                  />
                  <br />
                  <Button
                    appearance="primary"
                    loading={loading2}
                    onClick={savePaystack}
                  >
                    Save
                  </Button>
                </div>
                <div
                  className="form"
                  style={{
                    display: active === "flutterwave" ? "block" : "none",
                  }}
                >
                  <label>Public key</label>
                  <Input
                    type="text"
                    value={flutterwavePublic}
                    onChange={setFlutterwavePub}
                  />
                  <br />
                  <label>Secret key</label>
                  <Input
                    type="text"
                    value={flutterwaveSecret}
                    onChange={setFlutterwaveSec}
                  />
                  <br />
                  <label>Encryption key</label>
                  <Input
                    type="text"
                    value={flutterwaveEncryption}
                    onChange={setFlutterwaveEnc}
                  />
                  <br />
                  <Button
                    appearance="primary"
                    loading={loading2}
                    onClick={saveFlutterwave}
                  >
                    Save
                  </Button>
                </div>
                <div
                  className="form"
                  style={{
                    display: active === "interswitch" ? "block" : "none",
                  }}
                >
                  <label>Merchant code</label>
                  <Input
                    type="text"
                    value={interswitchMerchant}
                    onChange={setInterswitchMerc}
                  />
                  <br />
                  <label>Environment</label>
                  <InputPicker
                    value={interswitchEnv}
                    onChange={setInterswitchEnv}
                    data={[
                      { value: "TEST", label: "TEST" },
                      { value: "LIVE", label: "LIVE" },
                    ]}
                    placeholder="TEST or LIVE?"
                    block
                  />
                  <br />
                  <Button
                    appearance="primary"
                    loading={loading2}
                    onClick={saveInterswitch}
                  >
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
