/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Panel,
  Uploader,
  InputPicker,
  Input,
  Button,
  Alert,
  CheckTreePicker,
  Toggle,
} from "rsuite";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function CreateGame() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [role, setRole] = useState("");
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);
  const [cherry, setCherry] = useState("");

  useEffect(() => {
    let user = cookie && cookie.a_auth ? cookie.a_auth : null;
    setRole(user.role);
    user.role === "finance" ||
    user.role === "accountant" ||
    user.role === "customer-service"
      ? router.push("/no-access")
      : null;
  }, []);

  const handleBanner = (val) => {
    if (val.success) {
      setImage(val.file);
    }
  };

  const createBanner = async (body) => {
    body = JSON.stringify(body);
    setLoading(true);
    const url = `${process.env.API_URL}banner/create`;
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
          Alert.success("Banner created successfully", 3000);
          router.push(`/banner/${res.data.id}`);
        } else {
          Alert.error("Unable to create banner", 3000);
        }
      });
  };

  const save = async () => {
    if (!image) {
      Alert.error("Please upload image!");
    } else if (!type) {
      Alert.error("Please select banner type!");
    } else if (!url || url.length < 5) {
      Alert.error("URL is too short!");
    } else {
      const body = {
        title: image,
        image: image,
        url: url,
        type: type,
        active: true,
      };
      createBanner(body);
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Create Game" user="Howard Stern" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <Input
                    type="title"
                    placeholder="Game Title"
                    // onChange={setUrl}
                  />
                  <br />

                  <Input
                    type="Number"
                    placeholder="Number Count"
                    // onChange={setUrl}
                  />
                  <br />

                  <CheckTreePicker
                    data={[
                      { value: "NAP-1", label: "NAP-1" },
                      { value: "NAP-2", label: "NAP-2" },
                      { value: "NAP-3", label: "NAP-3" },
                      { value: "NAP-4", label: "NAP-4" },
                      { value: "NAP-5", label: "NAP-5" },
                      { value: "PAM-1", label: "PAM-1" },
                      { value: "PAM-2", label: "PAM-2" },
                      { value: "PAM-3", label: "PAM-3" },
                      { value: "PAM-4", label: "PAM-4" },
                      { value: "PAM-5", label: "PAM-5" },
                    ]}
                    placeholder="Bet type"
                    block
                    value={cherry}
                    onChange={setCherry}
                  />
                  <br />

                  <Input type="text" placeholder="Result Type" />
                  <br />

                  <InputPicker
                    data={[
                      { value: "side-right", label: "Side right desktop" },
                      { value: "side-left", label: "Side left desktop" },
                      { value: "top", label: "Top desktop" },
                      { value: "top-mobile", label: "Top mobile" },
                      { value: "box-right", label: "Box right desktop" },
                      { value: "box-left", label: "Box left desktop" },
                      { value: "box-mobile", label: "Box mobile" },
                      { value: "slider", label: "Slider" },
                    ]}
                    placeholder="Interval"
                    block
                    // onChange={setType}
                  />
                  <br />

                  <Button appearance="primary" loading={loading}>
                    Create
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
