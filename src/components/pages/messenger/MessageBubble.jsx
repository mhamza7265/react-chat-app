function MessageBubble({
  message,
  id,
  time,
  status,
  type,
  chatId,
  receiverChatId,
}) {
  const timeString = new Date(time).toLocaleTimeString("en", {
    timeStyle: "short",
    hour12: true,
    timeZone: "Asia/Karachi",
  });

  return (
    <div
      className={`message ${type}`}
      data-id={id}
      data-chatid={chatId}
      data-receiver-chatid={receiverChatId}
    >
      <p className="message-text" style={{ color: "#000" }}>
        {message}
      </p>
      <div className="detail">
        <span className="message-time">{timeString}</span>
        {type == "self" &&
          (status == "read" ? (
            <i className="fa-solid fa-check-double"></i>
          ) : status == "unread" ? (
            <i className="fa-solid fa-check ms-1"></i>
          ) : (
            status == "undelivered" && <i className="fa-regular fa-clock"></i>
          ))}
      </div>
    </div>
  );
}

export default MessageBubble;
