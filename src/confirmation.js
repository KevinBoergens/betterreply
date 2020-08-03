const axios = require("axios");
const qs = require("qs");

const apiUrl = "https://slack.com/api";

/*
 *  Send confirmation via chat.postMessage to the user who clipped it
 */

// Currently, Actions + DM combo has known issue when you're using the workspace tokens
// DM works for the user installed the app, and only after other user manually add the app
// We are still investing the issue

async function getUserInfo(userId) {
  let message = {
    token: process.env.SLACK_ACCESS_TOKEN,
    user: userId
  };
  let username = "anon";
  let myiconurl = undefined;
  let result = await axios.post(`${apiUrl}/users.info`, qs.stringify(message));

  username = result.data.user.profile.display_name;
  if (username === undefined) {
    username = result.data.user.profile.real_name;
  }
  if (username === undefined) {
    username = result.data.user.name;
  }
  return {
    image_original: result.data.user.profile.image_original,
    image_24: result.data.user.profile.image_24,
    username: username
  };
}

const sendConfirmation = (userId, view, channelid, origuserid) => {
  console.log(userId)
  console.log(origuserid)
  let values = view.state.values;
  Promise.all([getUserInfo(userId), getUserInfo(origuserid)]).then(users => {
    let blocks = [
      {
        type: "context",
        elements: [
          {
            type: "image",
            image_url: users[1].image_24,
            alt_text: "usericon"
          },
          {
            type: "mrkdwn",
            text: "*" + users[1].username + "*"
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: values.message.message_id.value
        }
      }
    ];
    let message = {
      token: process.env.SLACK_ACCESS_TOKEN,
      channel: channelid,
      blocks: JSON.stringify(blocks),
      username: users[0].username,
      icon_url: users[0].image_original,
      as_user: true
    };
    axios
      .post(`${apiUrl}/chat.postMessage`, qs.stringify(message))
      .then(result => {
        console.log(result.data);
      })
      .catch(err => {
        console.log(err);
      });
  });
};

module.exports = { sendConfirmation };
