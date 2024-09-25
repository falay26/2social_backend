const titleFormatter = (array, user, types) => {
  let new_array = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    let new_item = {
      id: item?._id,
      name: item?.name[user?.preferred_language],
      datas: item?.categories_info.map((j) => {
        return {
          id: j?._id,
          title: j?.name[user?.preferred_language],
          desc: j?.description[user?.preferred_language],
          limit: j?.step_number,
          backPhoto: j?.image,
          photos: [], //TODO: get some users..
          totalCount: j?.owners?.length,
          favourite: user?.favourite_categories?.includes(j?._id),
          type: types.filter((k) => k.id === j.type_id)[0]?.name[
            user?.preferred_language
          ],
        };
      }),
    };
    new_array.push(new_item);
  }

  return new_array;
};

module.exports = titleFormatter;
