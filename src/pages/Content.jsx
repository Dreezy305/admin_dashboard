import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Panel,
  Toggle,
  Input,
  Button,
  Alert,
} from "rsuite";
import { useParams, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import DOMPurify from "dompurify";
import Heading from "../components/Heading";
import Menu from "../components/Menu";
import Editor from "../components/Editor";

export default function Contents() {
  const [loading, setLoading] = useState(false);
  const [contents, setContent] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [content, setEditor] = useState("");
  const [active, setActive] = useState(false);
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
    getContent();
  }, []);

  const getContent = async () => {
    setLoading(true);

    const url = `${process.env.API_URL}content/${param.id}`;
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

          setContent(data);
          setActive(data.active);
          setTitle(data.title);
          setDescription(data.description);
          setUrl(data.url);
          setEditor(data.content);

          setLoading(false);
        }
      });
  };

  const handleEditor = (value) => {
    value = DOMPurify.sanitize(value);
    setEditor(value);
  };

  const updateContent = async (body) => {
    body = JSON.stringify(body);
    setLoading(true);
    const url = `${process.env.API_URL}content/update`;
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
          Alert.success("Content updated successfully", 3000);
        } else {
          Alert.error("Unable to update content", 3000);
        }
      });
  };

  const save = async () => {
    if (!title || title.length < 5) {
      Alert.error("Title is too short!");
    } else if (!description || description.length < 5) {
      Alert.error("Description is too short!");
    } else if (!url || url.length < 5) {
      Alert.error("URL is too short!");
    } else if (!content || content.length < 5) {
      Alert.error("Content is too short!");
    } else {
      const body = {
        id: param.id,
        title: title,
        description: description,
        content: content,
        url: url,
        active: active,
      };
      updateContent(body);
    }
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Menu />
        <Container>
          <Heading page="Edit content" />
          <Content className="container">
            <div className="inner">
              <Panel
                shaded
                bordered
                bodyFill
                style={{ backgroundColor: "#fff" }}
              >
                <div className="form">
                  {content && active !== undefined ? (
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
                  <Input
                    placeholder="Page title"
                    value={title}
                    onChange={setTitle}
                  />
                  <br />
                  <Input
                    placeholder="Page description"
                    value={description}
                    onChange={setDescription}
                  />
                  <br />
                  <Input placeholder="Page URL" value={url} onChange={setUrl} />
                  <br />
                  {content ? (
                    <Editor
                      placeholder=""
                      value={content}
                      onChange={handleEditor}
                    />
                  ) : (
                    ""
                  )}

                  <br />

                  <Button appearance="primary" onClick={save}>
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
