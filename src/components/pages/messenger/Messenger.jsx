import photoPlaceholder from "../../../assets/images/user-placeholder.jpg";
import ChatItem from "./ChatItem";
import { useForm } from "react-hook-form";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";
import sendRequest from "../../../utility/apiManager";
import { errorToast } from "../../../utility/toast";
import { BASE_URL } from "../../../utility/config";
import { Modal } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import socketClient from "socket.io-client";
const tok = localStorage.getItem("currentUser");
const token = JSON.parse(tok).token;
const decode = jwtDecode(token);

const socket = socketClient("http://localhost:3000", {
  query: {
    token: token,
  },
});

socket.on("connection", () => {
  console.log("connected socket");
});

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
    socket.emit("add_user", decode.id);
  }, []);

  socket.on("receiveMsg", (data) => {
    setMessages(() => [...messages, data]);
  });

  const onMessageSeen = (data) => {
    socket.emit("msgRead", {
      senderId: data.senderId,
      messageId: [data.messageId],
    });
  };

  useEffect(() => {
    socket.on("getMessages", (data) => {
      setMessages(data.messages);
    });
  }, [socket]);

  useEffect(() => {
    sendRequest("get", "chats").then((res) => {
      if (res.status) {
        setChatsList(res.chats);
      }
    });
  }, []);

  const handleChatClick = (data) => {
    socket.emit("getMessages", data.id);
    socket.on("getMsgs", (messages) => {
      if (messages.status) {
        setMessages(messages.messages);
        setChatWindowIsActive(true);
      } else {
        console.log("messagesErr", messages.error);
      }
    });
    setReceiver(data);
  };

  const onSubmit = (data) => {
    const randomId = `msg-${Math.floor(Math.random() * 99999999)}`;
    socket.emit("send_msg", {
      receiver: receiver?.userId,
      chatId: receiver?.id,
      sender: decode?.id,
      message: data.newMessage,
      messageId: randomId,
    });

    socket.on("checkMsgDelivered", (dta) => {
      console.log("dta", dta);
      setMessages([
        ...messages,
        {
          message: data.newMessage,
          time: new Date().toISOString(),
          status:
            dta.response.message && dta.response.status
              ? "unread"
              : "undelivered",
          chatId: receiver?.id,
          messageId: randomId,
          sender: decode.email,
          success: dta.response.status ? true : false,
        },
      ]);
    });

    socket.on("msgFailure", (data) => {
      const msg = messages.find((item) => item.messageId == data.messageId);
      console.log("msgFailure", msg);
      // setMessages([...messages]);
    });

    reset();
  };

  const handleRetryClick = (data) => {
    const filtered = messages.filter(
      (item) => item.messageId !== data.messageId
    );
    console.log("filtered", filtered);
    console.log("data", data);
    setMessages([...filtered], () => {
      console.log("filList1", messages);
      // const randomId = `msg-${Math.floor(Math.random() * 99999999)}`;
      // socket.emit("send_msg", {
      //   receiver: receiver?.userId,
      //   chatId: receiver?.id,
      //   sender: decode?.id,
      //   message: data.message,
      //   messageId: randomId,
      // });

      // socket.on("checkMsgDelivered", (dta) => {
      //   setMessages([
      //     ...messages,
      //     {
      //       message: data.message,
      //       time: new Date().toISOString(),
      //       status: dta.message && dta.status ? "unread" : "undelivered",
      //       chatId: receiver?.id,
      //       messageId: randomId,
      //       sender: decode.email,
      //       success: dta.status ? true : false,
      //     },
      //   ]);
      // });
      // console.log("filList2", messages);
    });
  };

  const handleNewMessageClick = () => {
    socket.emit("getUsersRequest", { page: 1 });
    socket.on("getUsers", (data) => {
      if (data.status) {
        setUsersList(data.users);
        setDropdownIsOpen(true);
      } else {
        console.log("err", data.error);
      }
    });
  };

  const handleUserClick = (e) => {
    const obj = {
      image: e.currentTarget.getAttribute("data-image"),
      name: e.currentTarget.getAttribute("data-name"),
      email: e.currentTarget.getAttribute("data-email"),
      userId: e.currentTarget.getAttribute("data-userid"),
    };
    sendRequest("post", "chat", {
      receiver: obj.email,
      name: obj.name,
      image: obj.image,
      userId: obj.userId,
    }).then((res) => {
      if (res.status) {
        sendRequest("get", "chats").then((res) => {
          if (res.status) {
            setChatsList(res.chats);
          }
        });

        sendRequest("get", `chat/${obj.email}`).then((res) => {
          if (res.status) {
            obj["id"] = res?.user?._id;

            socket.emit("getMessages", res?.user?._id);
            socket.on("getMsgs", (messages) => {
              if (messages.status) {
                setMessages(messages.messages);
                setReceiver(obj);
                setChatWindowIsActive(true);
                setNewChatModalIsOpen(false);
              } else {
                console.log("messagesErr", messages.error);
              }
            });
          }
        });
      }
    });
  };

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
    socket.emit("getUsersRequest", { page: usersList.page + 1 });
    socket.on("getUsers", (data) => {
      if (data.status) {
        setUsersList({
          ...data.users,
          docs: usersList.docs.concat(data.users.docs),
        });
      } else {
        errorToast(data.error);
        console.log("err", data.error);
      }
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value != "") {
      socket.emit("getSearchedUserRequest", { email: value });
      socket.on("getSearchedUsers", (data) => {
        if (data.status) {
          setUsersList({ ...usersList, docs: data.user });
        } else {
          console.log("err", data.error);
        }
      });
    } else {
      socket.emit("getUsersRequest", { page: 1 });
      socket.on("getUsers", (data) => {
        if (data.status) {
          setUsersList(data.users);
        } else {
          console.log("err", data.error);
        }
      });
    }
  };

  return (
    <div className="container-fluid h-100 p-0" onClick={handleContainerClick}>
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
                  userIds={item.userIds}
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
                onMessageSeen={onMessageSeen}
                handleRetryClick={handleRetryClick}
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
                    data-userid={item._id}
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
