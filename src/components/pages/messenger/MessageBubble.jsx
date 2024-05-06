import { useEffect, useState, useRef } from "react";

function MessageBubble({
  message,
  id,
  time,
  status,
  type,
  chatId,
  messageId,
  receiverChatId,
  senderId,
  success,
  onMessageSeen,
  handleRetryClick,
}) {
  const [seen, setSeen] = useState(!status == "read" && false);
  const messageRef = useRef();
  const timeString = new Date(time).toLocaleTimeString("en", {
    timeStyle: "short",
    hour12: true,
    timeZone: "Asia/Karachi",
  });

  // const handleScroll = () => {
  //   const messageElement = document.getElementById(messageId);
  //   if (messageElement) {
  //     const rect = messageElement.getBoundingClientRect();
  //     if (rect.top >= 0 && rect.bottom <= window.innerHeight && !seen) {
  //       setSeen(true);
  //       onMessageSeen({ messageId, senderId });
  //     }
  //   }
  // };

  const handleMsgRetryClick = () => {
    handleRetryClick({ message, messageId, chatId, senderId });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !seen) {
          setSeen(true);
          onMessageSeen({ messageId, senderId });
          observer.unobserve(messageRef.current);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(messageRef.current);
  }, [messageId, seen, onMessageSeen]);

  return (
    <>
      <div
        className={`message ${type} ${!success && "failed"} position-relative`}
        data-id={id}
        data-chatid={chatId}
        data-receiver-chatid={receiverChatId}
        data-messageid={messageId}
        id={messageId}
        ref={messageRef}
      >
        <p className="message-text" style={{ color: "#000" }}>
          {message}
        </p>
        <div className="detail">
          <span className="message-time me-2">{timeString}</span>
          {type == "self" &&
            (status == "read" ? (
              <i
                className="fa-solid fa-check-double"
                style={{ color: "blue" }}
              ></i>
            ) : status == "unread" ? (
              <i className="fa-solid fa-check-double"></i>
            ) : (
              status == "undelivered" && <i className="fa-regular fa-clock"></i>
            ))}
        </div>
        {!success && (
          <span className="retry" onClick={handleMsgRetryClick}>
            Retry
          </span>
        )}
      </div>
    </>
  );
}

export default MessageBubble;
