import React, { useEffect, useState } from "react";
import { getAllUsers } from "../apiCalls/getData";
import { urls } from "../config/urls";

const AddCollaborateUsers = ({ taskDetail, text, setText, setCollabUser }) => {
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [suggestionData, setSuggestionData] = useState();

  useEffect(() => {
    getAllUsers(`${urls.getAllUsers}`).then((res) => {
      if (res?.success) {
        setSuggestionData([]);
        res.data.map((data, index) => {
          if (taskDetail.ownerId !== data._id) {
            if (taskDetail.collaborateUsers.length === 0) {
              setSuggestionData((suggestionData) => [...suggestionData, data]);
            }

            if (
              taskDetail.collaborateUsers.length > 0 &&
              !taskDetail.collaborateUsers.includes(data._id)
            ) {
              setSuggestionData((suggestionData) => [...suggestionData, data]);
            }
          }
        });
      }
    });
  }, []);

  const handleKeyDown = (data, type) => {
    setShowSuggestion(false);
    setTimeout(() => {
      setShowSuggestion(true);
    }, 1000);
    if (type === "text") {
      if (text === "") {
        setCollabUser("");
      } else {
        const res = suggestionData.find((user) => user.userName === data);
        if (res) {
          setCollabUser(res._id);
          setText("");
        }
      }
    } else {
      setCollabUser(data);
    }
  };

  return (
    <div className="dropdown">
      <input
        type="text"
        value={text}
        onKeyDown={(e) =>
          e.key === "Enter" ? handleKeyDown(text, "text") : ""
        }
        onChange={(e) => {
          setText(e.target.value);
        }}
        className="tagInput"
        placeholder="Add new user..."
      />
      {showSuggestion ? (
        <div className="suggestion" id="suggestion-box">
          {suggestionData &&
            suggestionData.map((data, index) => (
              <div
                className="suggestion-contents text-start text-xl"
                key={index}
                onClick={() => {
                  handleKeyDown(data._id, "id")
                  setText(data.userName)
                }}
              >
                {data.userName}
              </div>
            ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddCollaborateUsers;
