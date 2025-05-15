const nameReturner = (item) => {
  if (
    item.type === "1" ||
    item.type === "2" ||
    item.type === "3" ||
    item.type === "4" ||
    item.type === "5" ||
    item.type === "7"
  ) {
    return { tr: item?.related_user[0]?.name, en: item?.related_user[0]?.name };
  } else if (item.type === "6" || item.type === "8") {
    return { tr: "Tebrikler!", en: "Congratulations!" };
  } else if (item.type === "9") {
    return { tr: "Üyelik paketi bitti.", en: "Membership package has ended." };
  }
};

const descReturner = (item) => {
  if (item.type === "1") {
    return { tr: " seni takip etti.", en: " followed you." };
  } else if (item.type === "2") {
    return { tr: " gönderini beğendi.", en: " liked your post." };
  } else if (item.type === "3") {
    return { tr: " gönderine yorum yaptı.", en: " commented on your post." };
  } else if (item.type === "4") {
    return {
      tr: " seni " + item.category[0].name.tr + " etkinliğine etiketledi.",
      en: " tagged you in " + item.category[0].name.en + " event.",
    };
  } else if (item.type === "5") {
    return {
      tr:
        " " +
        item.category[0].name.tr +
        " kategorisini tamamladı. Hadi sen de tamamla.",
      en:
        " completed the category named" +
        item.category[0].name.en +
        ". Come on, complete it too.",
    };
  } else if (item.type === "6") {
    return {
      tr: " " + item.category[0].name.tr + " kategorisi tamamlandı.",
      en: " category " + item.category[0].name.en + " is complete.",
    };
  } else if (item.type === "7") {
    return { tr: " bir gönderi paylaştı.", en: " shared a post." };
  } else if (item.type === "8") {
    return {
      tr: " Artık premium üyesin.",
      en: " You are now a premium member.",
    };
  } else if (item.type === "9") {
    return { tr: "", en: "" };
  }
};

const notificationFormatter = (array, user) => {
  let new_array = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    let new_item = {
      id: item?._id,
      type: item?.type,
      photo: item?.related_user[0]?.profile_picture,
      icon: null, //Always null
      name: nameReturner(item)[user?.preferred_language],
      desc: descReturner(item)[user?.preferred_language],
      official: item?.related_user[0]?.premium,
      dateTime: item?.created_at,
      read: item?.readed,
      other_user_id: item?.related_user[0]?._id,
      category_id: item?.category[0]?._id,
      post_id: item?.post[0]?._id,
    };
    console.log(nameReturner(item));
    console.log(descReturner(item)[user?.preferred_language]);
    console.log(user?.preferred_language);
    new_array.push(new_item);
  }

  return new_array;
};

module.exports = notificationFormatter;
