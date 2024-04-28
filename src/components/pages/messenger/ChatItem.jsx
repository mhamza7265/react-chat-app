import { jwtDecode } from "jwt-decode";

function ChatItem({ image, name, id, users, handleChatClick, receiver }) {
  const tok = localStorage.getItem("currentUser");
  const token = JSON.parse(tok).token;
  const decode = jwtDecode(token);
  const email = users?.filter((item) => item != decode.email)[0];
  const handleClick = () => {
    handleChatClick({ image, name, email, id });
  };

  return (
    <div
      className={`chat-individual ${
        receiver?.email == email ? "selected" : "inactive"
      }`}
      data-id={id}
      onClick={handleClick}
    >
      <div className="image cursor-pointer">
        <img src={image} />
      </div>
      <div className="content cursor-pointer">
        <span>{name}</span>
      </div>
    </div>
  );
}

export default ChatItem;
