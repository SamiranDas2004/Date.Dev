import * as React from "react";

interface MessageButtonProps {
  onClick: () => void;
}

const MessageButton: React.FC<MessageButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="bg-red-600">
      Message
    </button>
  );
};

export default MessageButton;
