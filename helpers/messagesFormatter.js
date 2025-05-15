const messagesFormatter = (array, user_id) => {
  let new_array = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    let other_user =
      item.sender_info[0]._id.toString() !== user_id.toString()
        ? item.sender_info[0]
        : item.reciever_info[0];
    let new_item = {
      photo: other_user?.profile_picture,
      name: other_user?.name,
      other_user_id: other_user?._id,
      message_id: item?._id,
      message: item?.messages[item.messages.length - 1]?.content,
      dated: item?.messages[item.messages.length - 1]?.date,
      unreadMessage: item.messages.filter((j) => !j.readed_by.includes(user_id))
        .length,
    };
    new_array.push(new_item);
  }

  return { messageToplamCount: array.length, messageData: new_array };
};

module.exports = messagesFormatter;
