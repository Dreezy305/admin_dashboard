/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  Container,
  Content,
  Button,
  Table,
  InputPicker,
  DateRangePicker,
  Row,
  Col,
} from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import moment from "moment";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function SiteAnalyticss() {
  const [loading, setLoading] = React.useState(false);
  const [siteanalytics, setSiteAnalytics] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState();
  const [type, setType] = React.useState();

  React.useEffect(() => {
    getSiteAnalytics();
  }, [page]);

  const handleType = (val) => {
    setType(val);
    setPage(1);
    searchSiteAnalytics(val);
  };

  const handleRange = (val) => {
    let from = moment(val[0]).format("YYYY-MM-DD");
    let to = moment(val[1]).format("YYYY-MM-DD");
    setPage(1);
    rangeSiteAnalytics(from, to);
  };

  const getSiteAnalytics = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}site-analyticss?page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setSiteAnalytics(res.data);
          setLoading(false);
        }
      });
  };

  const searchSiteAnalytics = async (query) => {
    setLoading(true);
    const url = `${process.env.API_URL}site-analyticss/search?query=${query}&page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setSiteAnalytics(res.data);
          setLoading(false);
        }
      });
  };

  const rangeSiteAnalytics = async (from, to) => {
    setLoading(true);
    const url = `${process.env.API_URL}site-analyticss/range?from=${from}&to=${to}&query=${type}&page=${page}&limit=50`;
    await fetch(url, {
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setSiteAnalytics(res.data);
          setLoading(false);
        }
      });
  };

  const prev = () => {
    let pageNumber = page <= 1 ? 1 : page - 1;
    setPage(pageNumber);
    if (search) {
      searchSiteAnalytics(search);
    } else {
      setPage(page);
      getSiteAnalytics();
    }
  };

  const next = () => {
    let pageNumber = page + 1;
    setPage(pageNumber);
    if (search) {
      searchSiteAnalytics(search);
    } else {
      setPage(pageNumber);
      getSiteAnalytics();
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Site Analytics" />
          <Content className="container">
            <div>
              <Row>
                <Col sm={24} lg={8}>
                  <DateRangePicker size="lg" block onChange={handleRange} />
                </Col>
                <Col sm={24} lg={4}>
                  <InputPicker
                    data={[
                      { label: "View", value: "view" },
                      { label: "Click", value: "click" },
                    ]}
                    placeholder="Type"
                    required
                    onChange={handleType}
                    className="siteanalytics2"
                    block
                    size="lg"
                  />
                </Col>
              </Row>

              <br />
            </div>

            <Table
              className="table"
              loading={loading}
              height={600}
              data={siteanalytics}
            >
              <Column width={50} fixed>
                <HeaderCell>No</HeaderCell>
                <Cell>
                  {(rowData, key) => {
                    return <span>{key + 1}</span>;
                  }}
                </Cell>
              </Column>
              <Column width={200} fixed>
                <HeaderCell>IP Address</HeaderCell>
                <Cell dataKey="ip" />
              </Column>
              <Column width={200} fixed>
                <HeaderCell>URL</HeaderCell>
                <Cell dataKey="url" />
              </Column>
              <Column width={200} fixed>
                <HeaderCell>Agent</HeaderCell>
                <Cell dataKey="agent" />
              </Column>
              <Column width={100} fixed>
                <HeaderCell>type</HeaderCell>
                <Cell dataKey="type" />
              </Column>
              <Column width={200} fixed>
                <HeaderCell>Date</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>
                        {moment(rowData.createdAt).format(
                          "MMM D, YYYY @ h:mm A"
                        )}
                      </span>
                    );
                  }}
                </Cell>
              </Column>
            </Table>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Button
                appearance="default"
                onClick={prev}
                disabled={page === 1 ? true : false}
              >
                &larr; Prev
              </Button>
              <Button
                appearance="default"
                onClick={next}
                disabled={siteanalytics.length < 50 ? true : false}
              >
                Next&rarr;
              </Button>
            </div>
          </Content>
        </Container>
      </Container>
    </div>
  );
}
