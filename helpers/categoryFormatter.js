const categoryFormatter = (array, user, id, types) => {
  if (id === 0) {
    let new_array = [];

    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      let new_item = {
        id: item?._id,
        image: item?.image,
        categoryName: item?.type_info[0]?.name[user?.preferred_language],
        text: item?.name[user?.preferred_language],
        desc: item?.description[user?.preferred_language],
        step: user?.in_sub_categories.filter(
          (i) => i.category_id === item?._id.toString()
        )?.sub_categories?.length,
        total: item?.step_number,
        photoCount: item?.posts?.length,
        reminder: item?.reminder,
      };
      new_array.push(new_item);
    }

    return new_array;
  }
  if (id === 1) {
    let new_array = [];

    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      let new_item = {
        id: item?._id,
        icon: item?.image,
        name: item?.name[user?.preferred_language],
        type: types.filter((j) => j._id === item.type_id)[0]?.name[
          user?.preferred_language
        ],
      };
      new_array.push(new_item);
    }

    return new_array;
  }
  if (id === 2) {
    let new_array = [];

    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      let new_item = {
        id: item?._id,
        name: item?.name[user?.preferred_language],
        leftIcon: null,
        rightIcon: null,
        progress:
          user?.in_sub_categories?.filter((i) => i.category_id === item?._id)
            .length / item?.total_step,
      };
      new_array.push(new_item);
    }

    return new_array;
  }
};

module.exports = categoryFormatter;
