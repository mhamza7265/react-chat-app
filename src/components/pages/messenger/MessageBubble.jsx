function MessageBubble({ message, id, time, status, type }) {
  return (
    <div className={`message ${type}`} data-id={id}>
      <p className="message-text" style={{ color: "#000" }}>
        {message}
      </p>
      <div className="detail">
        <span className="message-time">{time}</span>
        {type == "self" &&
          (status == "read" ? (
            <i className="fa-solid fa-check-double"></i>
          ) : (
            <i className="fa-solid fa-check ms-1"></i>
          ))}
      </div>
    </div>
  );
}

export default MessageBubble;
