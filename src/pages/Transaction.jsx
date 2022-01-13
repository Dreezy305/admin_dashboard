/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Container, Content, Panel, Row, Col, Button } from "rsuite";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import { TransactionData } from "../dummyData/transactions";

export default function Transaction() {
  const [loading, setLoading] = React.useState(false);
  const [transaction, setTransaction] = useState(TransactionData);
  const param = useParams();
  const [role, setRole] = useState("");
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "customer-service" || user.role === "media-marketing"
      ? router.push("/no-access")
      : null;
  }, []);

  useEffect(() => {
    // getTransaction();
  }, []);

  const getTransaction = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}transaction/${param.id}`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTransaction(res.data);
          setLoading(false);
        }
      });
  };
  console.log(transaction, "tt");
  console.log(param.id, "pp");
  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page={"Transaction: " + transaction.referenceId} />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <h3>{transaction.name}</h3>
                  <h4>
                    <span>
                      {" "}
                      Amount:{" "}
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(
                        transaction[param.id].amount
                          ? transaction[param.id].amount
                          : 0
                      )}
                    </span>
                  </h4>

                  <Row>
                    <hr />
                    <Col sm={24} lg={12}>
                      {" "}
                      <h6> Type: </h6>
                    </Col>
                    <Col sm={24} lg={12}>
                      <h6> {transaction.type}</h6>
                    </Col>
                  </Row>
                  <Row>
                    <hr />
                    <Col sm={24} lg={12}>
                      {" "}
                      <h6> Reference ID: </h6>
                    </Col>
                    <Col sm={24} lg={12}>
                      <h6> {transaction.referenceId}</h6>
                    </Col>
                  </Row>
                  <Row>
                    <hr />
                    <Col sm={24} lg={12}>
                      {" "}
                      <h6> Narration: </h6>
                    </Col>
                    <Col sm={24} lg={12}>
                      <h6> {transaction.narration}</h6>
                    </Col>
                  </Row>

                  <Row>
                    <hr />
                    <Col sm={24} lg={12}>
                      {" "}
                      <h6> Provider: </h6>
                    </Col>
                    <Col sm={24} lg={12}>
                      <h6> {transaction.provider}</h6>
                    </Col>
                  </Row>
                  <Row>
                    <hr />
                    <Col sm={24} lg={12}>
                      {" "}
                      <h6> Status: </h6>
                    </Col>
                    <Col sm={24} lg={12}>
                      <h6> {transaction.status}</h6>
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
                        {moment(transaction.createdAt).format(
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
