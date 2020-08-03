/* **************************************************************
 * ClipIt! Lite: Message clipping app using an action and a dialog
 * Simplified version for tutorial
 * The original code at https://glitch.com/~slack-action-and-dialog-blueprint
 *
 * Tomomi Imura (@girlie_mac)
 * **************************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');
const signature = require('./verifySignature');
const confirmation = require('./confirmation');
const app = express();

const apiUrl = 'https://slack.com/api';

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

/*
/* Endpoint to receive an action and a dialog submission from Slack.
/* To use actions and dialogs, enable the Interactive Components in your dev portal.
/* Scope: `command` to enable actions
 */
let channelid = 0
let origuserid = 0
app.post('/actions', (req, res) => { 

  const payload = JSON.parse(req.body.payload);
  const { type, user, view } = payload;  
  
  console.log(JSON.parse(req.body.payload));
  
  if (!signature.isVerified(req)) { 
    res.sendStatus(404);
    return;
  }

  // Message action triggered
  if(type === 'message_action') {
    channelid = payload.channel.id
    origuserid = payload.message.user
    // Open a modal with the selected message pre-populated
    openModal(payload).then((result) => {
      if(result.data.error) {
        console.log(result.data);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    }).catch((err) => {
      res.sendStatus(500);
    });
  
  // Modal forms submitted --
  } else if(type === 'view_submission') {
    res.send(''); // Make sure to respond immediately to the Slack server to avoid an error
    
    // DM the user a confirmation message
    confirmation.sendConfirmation(user.id, view,channelid, origuserid);
   
  }  
  
});


/* Open a modal */

const openModal = async(payload) => {
  
  const viewData = {
    token: process.env.SLACK_ACCESS_TOKEN,
    trigger_id: payload.trigger_id,
    view: JSON.stringify({
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Better reply'
      },
      callback_id: 'clipit',
      submit: {
        type: 'plain_text',
        text: 'Reply'
      },
      blocks: [
        {
          block_id: 'message',
          type: 'input',
          element: {
            action_id: 'message_id',
            type: 'plain_text_input',
            multiline: true,
            initial_value:'> ' + payload.message.text + '\n'
          },
          label: {
            type: 'plain_text',
            text: 'Message Text'
          }
        }
        
      ]
    })
  };
  
  await axios.post(`${apiUrl}/views.open`, qs.stringify(viewData));
  
  //console.log(result.data);
};

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
