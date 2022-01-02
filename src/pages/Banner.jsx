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
  Toggle,
} from "rsuite";
import { useParams, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import { BannerData } from "../dummyData/banner";

/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
export default function AddBanner() {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(BannerData);
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [active, setActive] = useState();
  const param = useParams();
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

  useEffect(() => {
    // getBanner();
    console.log(param.id);
  }, []);

  const getBanner = async () => {
    setLoading(true);
    const url = `${process.env.API_URL}banner/${param.id}`;
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
          setBanner(data);
          setImage(data.image);
          setType(data.type);
          setUrl(data.url);
          setActive(data.active);
          setLoading(false);
        }
      });
  };

  const handleBanner = (val) => {
    if (val.success) {
      setImage(val.file);
    }
  };

  const handleActive = (val) => {
    console.log(val);
  };

  const updateBanner = async (body) => {
    body = JSON.stringify(body);
    setLoading(true);
    const url = `${process.env.API_URL}banner/update`;
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
          Alert.success("Banner updated successfully", 3000);
        } else {
          Alert.error("Unable to update banner", 3000);
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
        active: active,
        id: banner.id,
      };
      updateBanner(body);
    }
  };

  // console.log(banner[param.id].banner);

  const imageUrl = banner[param.id].banner;
  const filelist = [
    {
      name: image,
      fileKey: 1,
      url: imageUrl,
    },
  ];

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Banner" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  {active !== undefined ? (
                    <Toggle
                      size="lg"
                      checkedChildren="Status: Active"
                      unCheckedChildren="Status: Disabled"
                      defaultChecked={active}
                      onChange={setActive}
                    />
                  ) : (
                    ""
                  )}

                  <br />
                  <br />

                  {image !== "" ? (
                    <Uploader
                      headers={{
                        Authorization: "Basic " + process.env.API_KEY,
                      }}
                      defaultFileList={filelist}
                      listType="picture-text"
                      action={`${process.env.API_URL}upload/banner`}
                      onSuccess={handleBanner}
                    />
                  ) : (
                    ""
                  )}
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
                    value={type}
                  />
                  <br />

                  <Input
                    type="url"
                    placeholder="URL link"
                    value={url}
                    onChange={setUrl}
                  />
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
