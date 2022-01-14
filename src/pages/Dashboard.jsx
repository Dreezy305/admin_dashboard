/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Container, Content, Panel, Row, Col, DateRangePicker } from "rsuite";
import ReactApexChart from "react-apexcharts";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import { parseCurrency, parseNumber } from "../components/Utils";
import { PlayerData } from "../dummyData/player";
import { TicketsData } from "../dummyData/tickets";

export default function Dashboard() {
  const [loading, setLoading] = React.useState(false);
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}dashboard/today`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setDashboard(res.data);
          setLoading(false);
        }
      });
  };

  const handleSelect = (val) => {
    onSelect(val);
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu active={1} />
        <Container>
          <Heading page="Dashboard" />
          <Content className="container">
            <Row>
              <Col sm={24} lg={12}>
                <Panel shaded bordered bodyFill className="counter">
                  <h2 className="">
                    {/* {dashboard.player ? parseNumber(dashboard.player) : 0} */}
                    {PlayerData.length}
                  </h2>
                  <p>Players</p>
                </Panel>
              </Col>
              <Col sm={24} lg={12}>
                <Panel shaded bordered bodyFill className="counter">
                  <h2 className="">
                    {/* {dashboard.ticket ? parseNumber(dashboard.ticket) : 0} */}
                    {TicketsData.length}
                  </h2>
                  <p>Tickets</p>
                </Panel>
              </Col>
              <Col sm={24} lg={12}>
                <Panel shaded bordered bodyFill className="counter">
                  <h2 className="">
                    {dashboard.income ? parseCurrency(dashboard.income) : "₦ 0"}
                  </h2>
                  <p>Income</p>
                </Panel>
              </Col>
              <Col sm={24} lg={12}>
                <Panel shaded bordered bodyFill className="counter">
                  <h2 className="">
                    {dashboard.payout ? parseCurrency(dashboard.payout) : "₦ 0"}
                  </h2>
                  <p>Payout</p>
                </Panel>
              </Col>
            </Row>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
