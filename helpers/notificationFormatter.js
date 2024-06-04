const notificationFormatter = (array, user) => {
  let new_array = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    let new_item = {
      id: item?._id,
      type: item?.type,
      photo: item?.related_user[0]?.profile_picture,
      icon: null,
      name: item?.related_user[0]?.name,
      desc: null,
      official: item?.related_user[0]?.premium,
      dateTime: item?.created_at,
      read: item?.readed,
    };
    new_array.push(new_item);
  }

  return new_array;
};

module.exports = notificationFormatter;
