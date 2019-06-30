// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from "./socket"

let channel = socket.channel("chat_room:lobby", {});
let list    = $("#message-list");
let message = $("#msg");
let name    = $("#name");

message.on("keypress", event => {
    if (event.keyCode == 13 && message.val() != "") {
      channel.push("shout", {
        name: name.val(),
        message: message.val()
      });
      message.val("");
    }
});

channel.on("shout", payload => {
  list.append(`<b>${payload.name || "new_user"}:</b> ${payload.message}<br>`);
  list.prop({
    scrollTop: list.prop("scrollHeight")
  });
});

channel.join()
  .receive("ok",    resp => {console.log("Join successfully!", resp);})
  .receive("error", resp => {console.log("Unable to join!", resp);});
