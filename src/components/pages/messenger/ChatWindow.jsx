import InputMessages from "../../common/InputMessages";
import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

function ChatWindow({
  register,
  name,
  placeholder,
  required,
  error,
  handleSubmit,
  onSubmit,
  messages,
  receiver,
  onMessageSeen,
  handleRetryClick,
  sendUpdateRequest,
  scrollBottomTrig,
  messageDiv,
}) {
  const scrollRequestRef = useRef();
  useEffect(() => {
    messageDiv.current.scrollTo(0, messageDiv.current.scrollHeight);
  }, [scrollBottomTrig]);

  const tok = localStorage.getItem("currentUser");
  const token = JSON.parse(tok).token;
  const decode = jwtDecode(token);

  const handleScroll = () => {
    const scrollTop = messageDiv.current.scrollTop;
    if (scrollTop === 0) {
      sendUpdateRequest();
    }
  };

  return (
    <div className="chat-window h-100 position-relative">
      <div className="header d-flex align-items-center justify-content-start">
        <div className="image">
          <img src={receiver?.image} />
        </div>
        <div className="content  cursor-pointer">
          <span>{receiver?.email}</span>
        </div>
      </div>
      <div className="messages-body" ref={messageDiv} onScroll={handleScroll}>
        <div className="request-update" ref={scrollRequestRef}>
          {messages?.docs?.map(
            (item, i) =>
              item.chatId === receiver?.id && (
                <MessageBubble
                  key={i}
                  id={item._id}
                  message={item.message}
                  messageId={item.messageId}
                  time={item.time}
                  type={item.sender == decode?.email ? "self" : "notself"}
                  status={item.status}
                  chatId={item.chatId}
                  receiverChatId={receiver?.id}
                  senderId={item.senderId}
                  success={item.success}
                  onMessageSeen={onMessageSeen}
                  handleRetryClick={handleRetryClick}
                />
              )
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="message-input d-flex align-items-center justify-content-between px-4 py-1">
          <InputMessages
            register={register}
            name={name}
            placeholder={placeholder}
            required={required}
            error={error}
          />
          <button className="fa-solid fa-location-arrow ms-3"></button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
