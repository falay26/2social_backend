const admin = require("firebase-admin");
const serviceAccount = require("./social-a163c-firebase-adminsdk-2t4nx-c1f7b01ca6.json");

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.JSON_1,
    project_id: process.env.JSON_2,
    private_key_id: process.env.JSON_3,
    private_key:
      "-----BEGIN PRIVATE KEY-----\n" +
      process.env.JSON_4.replace(/\\n/g, "\n") +
      "\n-----END PRIVATE KEY-----\n",
    client_email: process.env.JSON_5,
    client_id: process.env.JSON_6,
    auth_uri: process.env.JSON_7,
    token_uri: process.env.JSON_8,
    auth_provider_x509_cert_url: process.env.JSON_9,
    client_x509_cert_url: process.env.JSON_10,
    universe_domain: process.env.JSON_11,
  }),
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
    },
  };

  admin.messaging().send(notif_message);

  onDone();
};

module.exports = NotificationService;
