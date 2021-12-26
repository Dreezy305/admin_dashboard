import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Panel,
  Row,
  Col,
  Button,
  Modal,
  Alert,
} from "rsuite";
import { useParams, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function Payout() {
  const [loading, setLoading] = React.useState(false);
  const [approveLoading, setApproveLoading] = React.useState(false);
  const [declineLoading, setDeclineLoading] = React.useState(false);
  const [payout, setPayout] = useState({});
  const param = useParams();
  const [id, setUser] = useState("");
  const [role, setRole] = useState("");
  const [approve, setApprove] = useState(false);
  const [decline, setDecline] = useState(false);
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setUser(user.id);
    setRole(user.role);
    user.role === "media-marketing" ? router.push("/no-access") : null;
  }, []);

  useEffect(() => {
    getPayout();
  }, []);

  const toggleDecline = () => {
    setDecline(!decline);
  };

  const toggleApprove = () => {
    setApprove(!approve);
  };

  const getPayout = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}payout/${param.id}`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setPayout(res.data);
          setLoading(false);
        }
      });
  };

  const approvePayment = async () => {
    const form = {
      accountName: payout.player.accountName,
      accountBank: payout.player.accountBank,
      accountNumber: payout.player.accountNumber,
      amount: payout.amount,
      walletBalance: payout.player.walletBalance,
      playerId: payout.player.id,
      firstName: payout.player.firstName,
      email: payout.player.email,
      adminId: id,
      id: payout.id,
    };

    if (Number(payout.player.walletBalance) >= Number(form.amount)) {
      Alert.error("Player balance is too low to complete this transaction!");
    } else {
      setApproveLoading(true);

      const url = `${process.env.API_URL}transfer-request/admin`;
      await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Basic " + process.env.API_KEY,
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            Alert.success("Payment approved successfully.", 5000);
            setApproveLoading(false);
            toggleApprove();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else {
            Alert.error(res.message, 5000);
            setApproveLoading(false);
            toggleApprove();
          }
        });
    }
  };

  const declinePayment = async () => {
    setDeclineLoading(true);

    let form = {
      id: payout.id,
      status: "declined",
      playerId: payout.player.id,
      adminId: id,
    };

    const url = `${process.env.API_URL}payout/update`;
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          Alert.info("Payment declined", 5000);
          setDeclineLoading(false);
          toggleDecline();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          Alert.error("Unable to decline payment", 5000);
          setDeclineLoading(false);
          toggleDecline();
        }
      });
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Modal
          backdrop="static"
          role="alertdialog"
          show={approve}
          onClose={toggleApprove}
          size="xs"
        >
          <Modal.Body>
            <h5>
              You are about to approve player payment request. Are you sure you
              want to proceed ?
            </h5>
          </Modal.Body>
          <Modal.Footer>
            <Button
              loading={approveLoading}
              onClick={approvePayment}
              appearance="primary"
              color="green"
            >
              Yes, Approve
            </Button>
            <Button
              onClick={toggleApprove}
              appearance="subtle"
              disabled={approveLoading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          backdrop="static"
          role="alertdialog"
          show={decline}
          onClose={toggleDecline}
          size="xs"
        >
          <Modal.Body>
            <h5>
              You are about to decline player payment request. Are you sure you
              want to proceed ?
            </h5>
          </Modal.Body>
          <Modal.Footer>
            <Button
              loading={declineLoading}
              onClick={declinePayment}
              appearance="primary"
              color="red"
            >
              Yes, Decline
            </Button>
            <Button
              onClick={toggleDecline}
              appearance="subtle"
              disabled={declineLoading}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Container>
          <Heading
            page={`Payout ${payout.referenceId ? ":" : ""} ${
              payout.referenceId ? payout.referenceId : ""
            }`}
          />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <div
                    style={{
                      float: "right",
                      display:
                        (role === "admin" || role === "risk-manager") &&
                        payout.status === "pending"
                          ? "block"
                          : "none",
                    }}
                  >
                    {" "}
                    {}
                    <Button color="green" onClick={toggleApprove}>
                      <b>Approve</b>
                    </Button>
                    &nbsp;
                    <Button color="red" onClick={toggleDecline}>
                      <b>Decline</b>
                    </Button>
                  </div>
                  <h3>
                    Player: {payout.player ? payout.player.firstName : ""}{" "}
                    {payout.player ? payout.player.lastName : ""}
                  </h3>
                  <h4>
                    <span>
                      {" "}
                      Amount:{" "}
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(payout.amount ? payout.amount : 0)}
                    </span>
                  </h4>

                  <Row>
                    <hr />
                    <Col sm={24} lg={12}>
                      {" "}
                      <h6> Narration: </h6>
                    </Col>
                    <Col sm={24} lg={12}>
                      <h6> {payout.narration}</h6>
                    </Col>
                  </Row>

                  <Row>
                    <hr />
                    <Col sm={24} lg={12}>
                      {" "}
                      <h6> Admin : </h6>
                    </Col>
                    <Col sm={24} lg={12}>
                      <h6>
                        {" "}
                        {payout.approval
                          ? payout.approval.name
                          : payout.status === "success"
                          ? "Automatic"
                          : "---"}
                      </h6>
                    </Col>
                  </Row>
                  <Row>
                    <hr />
                    <Col sm={24} lg={12}>
                      {" "}
                      <h6> Status: </h6>
                    </Col>
                    <Col sm={24} lg={12}>
                      <h6> {payout.status}</h6>
                    </Col>
                  </Row>
                  <Row>
                    <hr />
                    <Col sm={24} lg={12}>
                      {" "}
                      <h6>Date created: </h6>
                    </Col>
                    <Col sm={24} lg={12}>
                      <h6>
                        {" "}
                        {moment(payout.createdAt).format(
                          "MMM D, YYYY @ h:mm A"
                        )}
                      </h6>
                    </Col>
                  </Row>
                </div>
              </Panel>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
