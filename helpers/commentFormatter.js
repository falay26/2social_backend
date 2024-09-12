const commentFormatter = (array) => {
  let new_array = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    let new_item = {
      id: item?._id,
      name: item?.user[0]?.name,
      profilePhoto: item?.user[0]?.profile_picture,
      premium: item?.user[0]?.premium,
      comment: item?.content,
      liked: item?.likes?.includes(item?.user[0]?._id),
    };
    new_array.push(new_item);
  }

  return new_array;
};

module.exports = commentFormatter;
