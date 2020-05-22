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
    confirmation.sendConfirmation(user.id, view);
   
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
        text: 'Save it to ClipIt!'
      },
      callback_id: 'clipit',
      submit: {
        type: 'plain_text',
        text: 'ClipIt'
      },
      blocks: [
        {
          block_id: 'message',
          type: 'input',
          element: {
            action_id: 'message_id',
            type: 'plain_text_input',
            multiline: true,
            initial_value: payload.message.text
          },
          label: {
            type: 'plain_text',
            text: 'Message Text'
          }
        },
        {
          block_id: 'importance',
          type: 'input',
          element: {
            action_id: 'importance_id',
            type: 'static_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select importance',
              emoji: true
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'High 💎💎✨',
                  emoji: true
                },
                value: 'high'
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Medium 💎',
                  emoji: true
                },
                value: 'medium'
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Low ⚪️',
                  emoji: true
                },
                value: 'low'
              }
            ]
          },
          label: {
            type: 'plain_text',
            text: 'Importance'
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
