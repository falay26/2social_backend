const postFormatter = (array, user) => {
  let new_array = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    let new_item = {
      id: item?._id,
      name: item?.user?.name,
      profilePhoto: item?.user?.profile_picture,
      category: item?.category[0]?.name[user?.preferred_language],
      categoryIcon: item?.category[0]?.icon,
      follow: user?.following?.includes(item?.user[0]?._id),
      official: item?.user?.premium,
      createdData: item?.created_at, //TODO: maybe format this further.
      likeCount: item?.likes?.length,
      commentCount: item?.comments?.length,
      postDesc: item?.content,
      postPhoto: item?.image,
    };
    new_array.push(new_item);
  }

  return new_array;
};

module.exports = postFormatter;
