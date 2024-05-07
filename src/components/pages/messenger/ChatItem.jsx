import { jwtDecode } from "jwt-decode";

function ChatItem({
  image,
  name,
  id,
  users,
  userIds,
  handleChatClick,
  receiver,
}) {
  const tok = localStorage.getItem("currentUser");
  const token = JSON.parse(tok).token;
  const decode = jwtDecode(token);
  const email = users?.filter((item) => item != decode.email)[0];
  const userId = userIds?.filter((item) => item != decode.id)[0];
  const handleClick = () => {
    handleChatClick({ image, name, email, id, userId });
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
        <span>{email}</span>
      </div>
    </div>
  );
}

export default ChatItem;
