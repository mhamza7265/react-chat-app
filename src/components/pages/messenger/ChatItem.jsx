function ChatItem({ image, name, id, handleChatClick }) {
  const handleClick = () => {
    handleChatClick({ image, name, id });
  };

  return (
    <div className="chat-individual" data-id={id} onClick={handleClick}>
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
