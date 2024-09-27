const userFormatter = (array, user) => {
  let new_array = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    let new_item = {
      id: item?._id,
      name: item?.name,
      photo: item?.profile_picture,
      mail: item?.email,
    };
    new_array.push(new_item);
  }

  return new_array;
};

module.exports = userFormatter;
