import photoPlaceholder from "../../../assets/images/user-placeholder.jpg";
import ChatItem from "./ChatItem";
import { useForm } from "react-hook-form";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";
import sendRequest from "../../../utility/apiManager";
import { errorToast } from "../../../utility/toast";
import { BASE_URL } from "../../../utility/config";
import { Modal } from "react-bootstrap";

function Messenger() {
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [chatwindowIsActive, setChatWindowIsActive] = useState(false);
  const [usersList, setUsersList] = useState(null);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [chatsList, setChatsList] = useState(null);
  const [newChatModalIsOpen, setNewChatModalIsOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    sendRequest("get", "chats").then((res) => {
      if (res.status) {
        setChatsList(res.chats);
      }
    });
  }, []);

  const handleChatClick = (data) => {
    sendRequest("get", `messages/${data.id}`)
      .then((res) => {
        if (res.status) {
          setMessages(res.messages);
          setReceiver(data);
          setChatWindowIsActive(true);
        }
      })
      .catch((err) => {
        console.log("messagesErr", err);
      });
  };

  const onSubmit = (data) => {
    // console.log("data", data);
    // const date = new Date();
    // const hours = date.getHours();
    // const minutes = date.getMinutes();
    // const hour = hours > 12 ? hours - 12 : hours == 0 ? 12 : hours;
    // const time = hour + ":" + minutes + (hours > 12 ? "pm" : "am");
    // data["time"] = time;
    // setMessages([...messages, data]);
    sendRequest("post", "chat", {
      receiver: receiver?.email,
      name: receiver?.name,
      image: receiver?.image,
    })
      .then((res) => {
        console.log("chats", res);
        if (res.status) {
          sendRequest("get", "chats").then((res) => {
            if (res.status) {
              setChatsList(res.chats);

              sendRequest("post", "message", {
                chatId: receiver?.id,
                message: data.newMessage,
              })
                .then((res) => {
                  console.log("message", res);
                  if (res.status) {
                    sendRequest("get", `messages/${receiver.id}`)
                      .then((res) => {
                        if (res.status) {
                          setMessages(res.messages);
                        }
                      })
                      .catch((err) => {
                        console.log("messagesErr", err);
                      });
                  }
                })
                .catch((err) => {
                  console.log("err", err);
                });
            }
          });
        }
      })
      .catch((err) => {
        console.log("chatErr", err);
      });

    reset();
  };

  const handleNewMessageClick = () => {
    sendRequest("get", "users/1")
      .then((res) => {
        if (res.status) {
          setUsersList(res.users);
          setDropdownIsOpen(true);
        }
      })
      .catch((err) => {
        errorToast(err);
        console.log(err);
      });
  };

  const handleUserClick = (e) => {
    const obj = {
      image: e.currentTarget.getAttribute("data-image"),
      name: e.currentTarget.getAttribute("data-name"),
      email: e.currentTarget.getAttribute("data-email"),
    };
    sendRequest("post", "chat", {
      receiver: obj.email,
      name: obj.name,
      image: obj.image,
    }).then((res) => {
      if (res.status) {
        console.log("chatCreat", res);
        sendRequest("get", "chats").then((res) => {
          if (res.status) {
            setChatsList(res.chats);
          }
        });

        sendRequest("get", `chat/${obj.email}`).then((res) => {
          if (res.status) {
            obj["id"] = res?.user?._id;
            sendRequest("get", `messages/${res?.user?._id}`)
              .then((res) => {
                if (res.status) {
                  setMessages(res.messages);
                  setReceiver(obj);
                  setChatWindowIsActive(true);
                  setNewChatModalIsOpen(false);
                }
              })
              .catch((err) => {
                console.log("messagesErr", err);
              });
          }
        });
      }
    });
  };

  console.log("receiver", receiver);

  const handleContainerClick = (e) => {
    const node = e.target.classList;
    const classNames = [
      "users-dropdown",
      "users-dropdown-ul",
      "users-dropdown-li",
      "users-dropdown-img",
      "users-dropdown-text",
      "users-dropdown-div",
      "users-dropdown-email",
      "dropdown-btn",
      "dropdown-btn-div",
    ];
    if (!classNames.some((className) => node.contains(className))) {
      setDropdownIsOpen(false);
    }
  };

  const handleLoadMoreUsersClick = () => {
    sendRequest("get", `users/${usersList.page + 1}`)
      .then((res) => {
        if (res.status) {
          setUsersList({
            ...res.users,
            docs: usersList.docs.concat(res.users.docs),
          });
        }
      })
      .catch((err) => {
        errorToast(err);
        console.log(err);
      });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value != "") {
      sendRequest("get", `user/${value}`).then((res) => {
        setUsersList({ ...usersList, docs: res.user });
      });
    } else {
      sendRequest("get", "users/1")
        .then((res) => {
          if (res.status) {
            setUsersList(res.users);
          }
        })
        .catch((err) => {
          errorToast(err);
          console.log(err);
        });
    }
  };

  return (
    <div className="container h-100 p-0" onClick={handleContainerClick}>
      <div className="chat h-100">
        <div className="d-flex h-100">
          <div className="chat-list">
            <div className="header d-flex align-items-center justify-content-between position-relative">
              <div className="image">
                <img src={photoPlaceholder} />
              </div>
              <i
                className="fa-regular fa-square-plus cursor-pointer"
                onClick={handleNewMessageClick}
              ></i>
              {dropdownIsOpen && (
                <div className="users-dropdown py-5">
                  <div className="w-max-content mx-auto mb-4 dropdown-btn-div">
                    <button
                      className="btn btn-sm dropdown-btn"
                      onClick={() => {
                        setDropdownIsOpen(false);
                        setNewChatModalIsOpen(true);
                      }}
                    >
                      New Chat
                    </button>
                  </div>
                  <div className="w-max-content mx-auto dropdown-btn-div">
                    <button className="btn btn-sm disabled dropdown-btn">
                      Create Group
                    </button>
                  </div>
                  {/* <ul className="users-dropdown-ul">
                    {usersList?.map((item, i) => (
                      <li
                        className="users-dropdown-li"
                        key={i}
                        onClick={handleUserClick}
                        data-email={item.email}
                        data-name={item.firstName + " " + item.lastName}
                        data-image={item.image ?? photoPlaceholder}
                      >
                        <img
                          className="users-dropdown-img"
                          src={
                            item.image
                              ? BASE_URL + "/" + item.image
                              : photoPlaceholder
                          }
                        />
                        <div className="users-dropdown-div">
                          <h5 className="users-dropdown-text">
                            {item.firstName + " " + item.lastName}
                          </h5>
                          <span className="users-dropdown-email">
                            {item.email}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul> */}
                </div>
              )}
            </div>
            {/* <div className="search"></div> */}
            <div className="list">
              <h5 className="text-center" style={{ padding: "20px 0" }}>
                CHATS
              </h5>
              {chatsList?.map((item, i) => (
                <ChatItem
                  key={i}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  users={item.users}
                  handleChatClick={handleChatClick}
                  receiver={receiver}
                />
              ))}
            </div>
          </div>
          <div className="chat-detail">
            {chatwindowIsActive && (
              <ChatWindow
                register={register}
                image={photoPlaceholder}
                name="newMessage"
                placeholder="Type your message"
                required={true}
                error={errors}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                messages={messages}
                reset={reset}
                receiver={receiver}
              />
            )}
          </div>
        </div>
      </div>
      <>
        <Modal
          size="md"
          className="new-chat"
          centered
          show={newChatModalIsOpen}
          onHide={() => {
            // resetChat();
            setNewChatModalIsOpen(false);
          }}
          style={{ zIndex: "9999", padding: 0 }}
        >
          <Modal.Header
            style={{ borderBottom: "1px solid #d1d7db" }}
            closeButton
          >
            <h5 className="text-center w-100">USERS</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <input
                placeholder="Search user"
                style={{
                  height: "40px",
                  marginBottom: "20px",
                  borderColor: "#aad6ce",
                }}
                onChange={handleSearchChange}
              />
              <div className="users">
                {usersList?.docs?.map((item, i) => (
                  <div
                    className="user-div cursor-pointer"
                    key={i}
                    onClick={handleUserClick}
                    data-email={item.email}
                    data-name={item.firstName + " " + item.lastName}
                    data-image={item.image ?? photoPlaceholder}
                  >
                    <img
                      className="users-dropdown-img"
                      src={
                        item.image
                          ? BASE_URL + "/" + item.image
                          : photoPlaceholder
                      }
                    />
                    <div className="users-dropdown-div ms-5">
                      <h5 className="users-dropdown-text">
                        {item.firstName + " " + item.lastName}
                      </h5>
                      <span className="users-dropdown-email">{item.email}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-max-content mx-auto mt-4 mb-5">
                <button
                  className={`btn btn-sm btn-heading btn-block hover-up mx-auto 
                    ${!usersList?.hasNextPage && "disabled"}
                    `}
                  onClick={handleLoadMoreUsersClick}
                >
                  <i className="fa-solid fa-arrows-rotate"></i> Load More
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}

export default Messenger;
