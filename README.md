# "ClipIt! for Slack" - Message Action and Dialog Example (Simpllified)


> :sparkles: Updated: January 2020<br>
:sparkles: Published: October 2018

This is a source code used for the tutorial on [link on medium TBD].

---


By registering your app's capabilities as message actions, users can pick and choose messages to send to your app so you can do something useful with them. Store these messages in a virtual trapper keeper, feed them to your internal markov chain bot, or file away information about an important lead.

## Creating "ClipIt" app using a message action and a modal

![App icon](https://cdn.glitch.com/0642ddd6-d0fc-41e6-9e76-15b85e3d5ecb%2Ficon_small.png?1535673252976) This fictional Slack app, "ClipIt" allows users to "clip" a message posted on Slack by using the actions to export the message in the external app/service, let's say, "ClipIt web app".

### Developer Use-Cases

If you are developing apps like memo / note-taking app, collaborative doc app, this sample use-case would be a nice addition to your Slack app.

Also, the message action would be great for:

- Bug / issue tracking app (*e.g.* "Create a ticket from the message")
- To-Do app (*e.g.* "Create a to-do")
- Project management app (*e.g.* "Attach to task")
- Social media (*e.g.* "Post it to [my social media] App")

### User Work Flow

When a user hover a message then choose "Clip the message" from the action menu, a dialog pops open.
The message text is pre-populated into the dialog box, but the user can edit before submitting it too.
Once a user finalize the form and submit, the app DMs the user with the confirmation.


![ClipIt](https://cdn.glitch.com/441299e3-79ff-44b2-9688-4ade057797c8%2Fscreen_actions_dialogs_demo.gif?1526686807617)

## Setup

### Create a Slack app
1. Create an app at https://api.slack.com/apps?new_granular_bot_app=1
2. Go to **Bot Users** and click "Add a Bot User" to create a, app bot. Save the change.
3. Navigate to the OAuth & Permissions page and add the following scopes:
    * `commands` (required for Actions)
    * `chat:write` (required for posting messages)
4. Click 'Save Changes' and install the app


#### Remix this code

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/slack-clipit-simplified)

1. Get the code
    * Remix this repo at https://glitch.com/edit/#!/remix/slack-clipit-simplified
2. Set the following environment variables to `.env` with your API credentials (see `.env.sample`):
    * `SLACK_ACCESS_TOKEN`: Your app's bot token, `xoxb-` token (available on the Install App page, after you install the app to a workspace once.)
    * `SLACK_SIGNING_SECRET`: Your app's Signing Secret (available on the **Basic Information** page)to a workspace)  
3. If you're running the app locally:
    1. Start the app (`npm start`)
    1. In another window, start ngrok on the same port as your webserver
​
#### Add a Action
1. Go back to the app settings and click on **Interactive Components**.
2. Click "Enable Interactive Components" button:
    * Request URL: Your ngrok or Glitch URL + `/actions` in the end (e.g. `https://example.ngrok.io/actions`)
    * Under **Actions**, click "Create New Action" button
      * Action Name: `Clip the message`
      * Description: `Save this message to ClipIt! app`
      * Callback ID: `clipit`
3. Save
