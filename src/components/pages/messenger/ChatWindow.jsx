import InputMessages from "../../common/InputMessages";
import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";

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
}) {
  const messageDiv = useRef();
  useEffect(() => {
    messageDiv.current.scrollTo(0, messageDiv.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chat-window h-100 position-relative">
      <div className="header d-flex align-items-center justify-content-start">
        <div className="image">
          <img src={receiver?.image} />
        </div>
        <div className="content  cursor-pointer">
          <span>{receiver?.name}</span>
        </div>
      </div>
      <div className="messages-body" ref={messageDiv}>
        {messages?.map((item, i) => (
          <MessageBubble
            key={i}
            message={item.newMessage}
            time={item.time}
            type="self"
          />
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="message-input d-flex align-items-center justify-content-between px-4 py-3">
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
