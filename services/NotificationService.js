const admin = require("firebase-admin");
const serviceAccount = require("./social-a163c-firebase-adminsdk-2t4nx-c1f7b01ca6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//Models
const Notification = require("../model/Notification");

const titleReturner = (type, user, category) => {
  if (type === "1") {
    return { tr: " seni takip etti.", en: "" };
  }
  if (type === "2") {
    return { tr: " gönderini beğendi.", en: "" };
  }
  if (type === "3") {
    return { tr: " gönderine yorum yaptı.", en: "" };
  }
  if (type === "4") {
    return {
      tr: " seni " + category.name.tr + " etkinliğine etiketledi.",
      en: "",
    };
  }
  if (type === "5") {
    return {
      tr:
        "Tebrikler!" +
        category.name.tr +
        " kategorisini tamamladı. Hadi sen de tamamla.",
      en: "",
    };
  }
  if (type === "6") {
    return {
      tr: "Tebrikler!" + category.name.tr + " kategorisi tamamlandı.",
      en: "",
    };
  }
  if (type === "7") {
    return {
      tr: user.name + " bir gönderi paylaştı.",
      en: "",
    };
  }
  if (type === "8") {
    return {
      tr: "Tebrikler! Artık premium üyesin.",
      en: "",
    };
  }
  if (type === "8") {
    return {
      tr: "Üyelik paketi bitti.",
      en: "",
    };
  }
};

const messageReturner = (type, user, category) => {
  if (type === "1") {
    return { tr: " seni takip etti.", en: "" };
  }
  if (type === "2") {
    return { tr: " gönderini beğendi.", en: "" };
  }
  if (type === "3") {
    return { tr: " gönderine yorum yaptı.", en: "" };
  }
  if (type === "4") {
    return {
      tr: " seni " + category.name.tr + " etkinliğine etiketledi.",
      en: "",
    };
  }
  if (type === "5") {
    return {
      tr:
        "Tebrikler!" +
        category.name.tr +
        " kategorisini tamamladı. Hadi sen de tamamla.",
      en: "",
    };
  }
  if (type === "6") {
    return {
      tr: "Tebrikler!" + category.name.tr + " kategorisi tamamlandı.",
      en: "",
    };
  }
  if (type === "7") {
    return {
      tr: user.name + " bir gönderi paylaştı.",
      en: "",
    };
  }
  if (type === "8") {
    return {
      tr: "Tebrikler! Artık premium üyesin.",
      en: "",
    };
  }
  if (type === "8") {
    return {
      tr: "Üyelik paketi bitti.",
      en: "",
    };
  }
};

const NotificationService = async (
  type,
  user,
  related_user,
  post,
  category,
  onDone
) => {
  await Notification.create({
    user_id: user?._id,
    related_user_id: related_user?._id,
    category_id: category?._id,
    post_id: post?._id,
    type: type,
    title: titleReturner(type, related_user, category, post),
    message: messageReturner(type, related_user, category, post),
  });

  var notif_message = {
    token: user?.notification_token,
    notification: {
      title: "2Social",
      body: messageReturner(type, related_user, category)[
        user.preferred_language
      ],
      data: {
        related_user: related_user?._id,
        post: post?._id,
        category: category?._id,
      },
    },
  };

  admin.messaging().send(notif_message);

  onDone();
};

module.exports = NotificationService;
