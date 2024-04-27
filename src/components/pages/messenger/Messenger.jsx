import photoPlaceholder from "../../../assets/images/user-placeholder.jpg";
import ChatItem from "./ChatItem";
import { useForm } from "react-hook-form";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";
import sendRequest from "../../../utility/apiManager";
import { errorToast } from "../../../utility/toast";
import { BASE_URL } from "../../../utility/config";

function Messenger() {
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [chatwindowIsActive, setChatWindowIsActive] = useState(false);
  const [usersList, setUsersList] = useState(null);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [chatsList, setChatsList] = useState(null);

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
    setReceiver(data);
    setChatWindowIsActive(true);
  };

  const onSubmit = (data) => {
    console.log("data", data);
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hour = hours > 12 ? hours - 12 : hours == 0 ? 12 : hours;
    const time = hour + ":" + minutes + (hours > 12 ? "pm" : "am");
    data["time"] = time;
    setMessages([...messages, data]);
    reset();
  };

  const handleNewMessageClick = () => {
    sendRequest("get", "users")
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
    setReceiver(obj);
    setChatWindowIsActive(true);
    setDropdownIsOpen(false);
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
    ];
    if (!classNames.some((className) => node.contains(className))) {
      setDropdownIsOpen(false);
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
                <div className="users-dropdown cursor-pointer">
                  <ul className="users-dropdown-ul">
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
                  </ul>
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
                  handleChatClick={handleChatClick}
                />
              ))}
              <ChatItem
                image={photoPlaceholder}
                name={"Lorem Ipsum 2"}
                handleChatClick={handleChatClick}
              />
              <ChatItem
                image={photoPlaceholder}
                name={"Lorem Ipsum 3"}
                handleChatClick={handleChatClick}
              />
              <ChatItem
                image={photoPlaceholder}
                name={"Lorem Ipsum 4"}
                handleChatClick={handleChatClick}
              />
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
    </div>
  );
}

export default Messenger;
