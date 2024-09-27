const userFormatter = (array, id) => {
  if (id === 0) {
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
  }
  if (id === 1) {
    const item = array;
    let new_item = {
      id: item?._id,
      name: item?.name,
      photo: item?.profile_picture,
      mail: item?.email,
    };

    return new_item;
  }
};

module.exports = userFormatter;
