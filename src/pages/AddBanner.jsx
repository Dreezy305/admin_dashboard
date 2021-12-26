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
} from "rsuite";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import Heading from "../components/Heading";
import Menu from "../components/Menu";

export default function AddBanner() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [role, setRole] = useState("");
  const router = useHistory();
  const [cookie] = useCookies(["a_auth"]);

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
          <Heading page="Add banner" user="Howard Stern" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  <Uploader
                    headers={{
                      Authorization: "Basic " + process.env.API_KEY,
                    }}
                    listType="picture-text"
                    action={`${process.env.API_URL}upload/banner`}
                    onSuccess={handleBanner}
                  />
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
                    placeholder="Banner type"
                    block
                    onChange={setType}
                  />
                  <br />

                  <Input type="url" placeholder="URL link" onChange={setUrl} />
                  <br />

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
