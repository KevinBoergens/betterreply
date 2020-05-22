# How this works
"ClipIt! for Slack" - Message Action and Dialog Example

> *This doc (incl. diagram) is outdated. I will update as soon as I can!* 🙇‍♀️

---

This demo app allow users to export a message in Slack from the message action menu to a 3rd party system (let's call the fictional app *ClipIt*) using
a [message actions](https://api.slack.com/actions) and a [Dialog](https://api.slack.com/dialogs).

Assumeing you have your 3rd party note-keeping app with database setup already &mdash; 
To just give you a quick idea, in this code sample each selected message is added in a JSON to be exported to your external app.


#### 1. Receive action events from Slack

When a user executes the message action associated with the app, Slack will send a POST request to the request URL provided in the app settings. This request will include the message text in the payload. The `command` scope is used for the message action.

Payload example:
```JSON
{  
  "token": "Nj2rfC2hU8mAfgaJLemZgO7H",
  "callback_id": "clipit",
  "type": "message_action",
  "trigger_id": "13345224609.8534564800.6f8ab1f53e13d0cd15f96106292d5536",
  "response_url": "https://hooks.dev.slack.com/app-actions/T0MJR11A4/21974584944/yk1S9ndf35Q1flupVG5JbpM6",
  "team": {...},
  "channel": {...},
  "user": {  
    "id": "U0D15K92L",
    "name": "dr_meow"
  },
  "message": {
    "type": "message",
    "user": "U0MJRG1AL",
    "ts": "1516229207.000133",
    "text": "Can you order a tuna with cheese and lactose-free milk for me, please?"
  }
}
```


#### 2. Open a Dialog

In order to let the user to edit the message to be saved in the 3rd party app, the app will open a Dialog in Slack. When the user submits the Dialog, Slack will send a POST request to the same request URL used for the message action. To differentiate which action triggers the event, parse the payload and check the `type`.

#### 3. Confirm the user

Once the user submit the dialog, this example app export the message in a JSON (where you probably want to do something else to work with your own app and service, such as save in a DB). In the meantime, the app notifies the user by sending a DM using `chat.postMessage` method. To do so, you need to enable the `users:read` scope.

## Diagram

![Dialog](https://cdn.glitch.com/a5e777ad-7906-481d-9586-a85e4d602ac6%2Fdiagram_app_flow.png?1538782622235)
