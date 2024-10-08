const postFormatter = (array, user, id) => {
  if (id === 0) {
    let new_array = [];

    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      let new_item = {
        id: item?._id,
        name: item?.user[0]?.name,
        profilePhoto: item?.user[0]?.profile_picture,
        poster_id: item?.user[0]?._id,
        category: item?.category[0]?.name[user?.preferred_language],
        category_id: item?.category[0]?._id,
        categoryIcon: item?.category[0]?.icon,
        follow: user?.following?.includes(item?.user[0]?._id),
        official: item?.user[0]?.premium,
        createdData: item?.created_at,
        likeCount: item?.likes?.length,
        commentCount: item?.comments?.length,
        postDesc: item?.content,
        postPhoto: item?.image,
        liked: item?.likes?.includes(user?._id.toString()),
        added_to_profile: user?.added_posts?.includes(item?._id),
        user_id: item?.owner_id,
      };
      new_array.push(new_item);
    }

    return new_array;
  }
  if (id === 1) {
    const item = array[0];
    let new_item = {
      id: item?._id,
      name: item?.user[0]?.name,
      profilePhoto: item?.user[0]?.profile_picture,
      category: item?.category[0]?.name[user?.preferred_language],
      category_id: item?.category[0]?._id,
      categoryIcon: item?.category[0]?.icon,
      follow: user?.following?.includes(item?.user[0]?._id),
      official: item?.user[0]?.premium,
      createdData: item?.created_at,
      likeCount: item?.likes?.length,
      commentCount: item?.comments?.length,
      postDesc: item?.content,
      postPhoto: item?.image,
      liked: item?.likes?.includes(user?._id.toString()),
      added_to_profile: user?.added_posts?.includes(item?._id),
      user_id: item?.owner_id,
    };

    return new_item;
  }
};

module.exports = postFormatter;
