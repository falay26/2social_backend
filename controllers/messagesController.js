const User = require("../model/User");
const Message = require("../model/Message");
const mongoose = require("mongoose");
const Jimp = require("jimp");
//Notification
var FCM = require("fcm-node");
var serverKey = process.env.FIREBASE_SERVER_KEY;
var fcm = new FCM(serverKey);
//Formatters
const messagesFormatter = require("../helpers/messagesFormatter");
//Storage
const fs = require("fs");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
} = require("firebase/storage");

const getAllMessages = async (req, res) => {
  const { user_id } = req.body;

  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            {
              sender_id: mongoose.Types.ObjectId(user_id),
            },
            {
              reciever_id: mongoose.Types.ObjectId(user_id),
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
          foreignField: "_id",
          as: "sender_info",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reciever_id",
          foreignField: "_id",
          as: "reciever_info",
        },
      },
    ]);

    res.status(200).json({
      status: 200,
      data: messagesFormatter(messages, user_id),
      message: "Mesajlar başarıyla döndürüldü!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getMessage = async (req, res) => {
  const { user_id, message_id } = req.body;

  try {
    const message = await Message.findOne({ _id: message_id }).exec();
    const last_deletes = message.cleared_by.filter(
      (i) => i.user_id === user_id
    );
    const last_delete_date = last_deletes[last_deletes.length - 1].date;
    const messages = message.messages
      .filter((i) => i.date < last_delete_date)
      .reverse();

    res.status(200).json({
      status: 200,
      data: messagesFormatter(messages, user_id),
      massage_id: message_id,
      message: "Mesajlar başarıyla döndürüldü!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getMessageById = async (req, res) => {
  const { user_id, other_user_id } = req.body;

  try {
    const message = await Message.find({
      $or: [
        {
          fromUser: mongoose.Types.ObjectId(user_id),
          toUser: mongoose.Types.ObjectId(other_user_id),
        },
        {
          fromUser: mongoose.Types.ObjectId(other_user_id),
          toUser: mongoose.Types.ObjectId(user_id),
        },
      ],
    }).exec();
    const last_deletes = message?.cleared_by?.filter(
      (i) => i.user_id === user_id
    );
    const last_delete_date = last_deletes[last_deletes.length - 1].date;
    const messages = message.messages
      .filter((i) => i.date < last_delete_date)
      .reverse();

    res.status(200).json({
      status: 200,
      data: messages,
      massage_id: message._id,
      message: "Mesajlar başarıyla döndürüldü!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const sendMessage = async (req, res) => {
  const { message_id, message_sended } = req.body;

  try {
    const message = await Message.findOne({ _id: message_id }).exec();

    const sender_id =
      message.sender_id.toString() === message_sended.sender
        ? message.reciever_id
        : message.sender_id;
    const sender_user = await User.findOne({
      _id: message_sended.sender,
    }).exec();
    const reciever_user = await User.findOne({ _id: sender_id }).exec();

    if (message.messages.length === 0) {
    }
    var message1 = {
      to: reciever_user.notification_token,
      notification: {
        title: "2Social",
        body: sender_user.name + " sana mesaj gönderdi⚡️",
      },
    };

    fcm.send(message1, function (err, response) {
      if (err) {
      } else {
      }
    });

    message_sended.date = new Date();
    message.messages = message.messages.concat([message_sended]);

    await message.markModified("messages");
    await message.save();

    res.status(200).json({
      status: 200,
      message: "Mesaj başarıyla gönderildi.",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const readAllMessages = async (req, res) => {
  const { message_id, user_id } = req.body;

  try {
    const message = await Message.findOne({ _id: message_id }).exec();

    message.messages = message.messages.map((i) => {
      if (!i.readed_by.includes(user_id)) {
        i.readed_by = i.readed_by.concat([user_id]);
      }

      return i;
    });

    await message.markModified("messages");
    await message.save();

    res.status(200).json({
      status: 200,
      message: "Mesajlar başarıyla okundu!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const baseToImg = async (req, res) => {
  const { base } = req.body;

  try {
    const buffer = Buffer.from(base, "base64");
    const image_name = Date.now().toString();

    Jimp.read(buffer, async (err, lenna) => {
      if (err) throw err;
      lenna.quality(5).write("./uploads/" + image_name + ".jpg", () => {
        const img = fs.readFileSync("./uploads/" + image_name + ".jpg");
        const storage = getStorage();
        const imageRef = ref(storage, image_name + ".jpg");
        uploadBytes(imageRef, img).then(() => {
          getDownloadURL(imageRef).then((url) => {
            res.status(200).json({
              status: 200,
              image: url,
              message: "Resim başarıyla kaydedildi!",
            });
          });
        });
      });
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  const { message_id, user_id } = req.body;

  try {
    const message = await Message.findOne({ _id: message_id }).exec();

    message.cleared_by = message.cleared_by.concat([
      { user_id: user_id, date: new Date() },
    ]);

    await message.markModified("cleared_by");
    await message.save();

    res.status(200).json({
      status: 200,
      message: "Mesajlar başarıyla silindi!",
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllMessages,
  getMessage,
  getMessageById,
  sendMessage,
  readAllMessages,
  deleteMessage,
  baseToImg,
};
