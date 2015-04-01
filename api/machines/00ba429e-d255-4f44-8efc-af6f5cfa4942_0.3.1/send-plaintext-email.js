module.exports = {
  "inputs": {
    "apiKey": {
      "description": "The API key of the Mailgun account to use.",
      "example": "key-3432afa32e9401482aba183c13f3",
      "required": true,
      "whereToGet": {
        "url": "https://mailgun.com/cp",
        "description": "Copy the \"API Key\" in your Mailgun dashboard.",
        "extendedDescription": "To retrieve your API key, you will first need to log in to your Mailgun account, or sign up for one if you have not already done so."
      },
      "type": "string",
      "name": "apiKey",
      "friendlyName": "apiKey"
    },
    "domain": {
      "description": "The Mailgun domain to use.",
      "example": "sandbox5f89931913a9ab31130131350101.mailgun.og",
      "required": true,
      "whereToGet": {
        "url": "https://mailgun.com/cp",
        "description": "Copy a domain from either \"Mailgun Subdomains\" or \"Custom Domains\" in your Mailgun dashboard.",
        "extendedDescription": "You will first need to log in to your Mailgun account, or sign up for one if you have not already done so."
      },
      "type": "string",
      "name": "domain",
      "friendlyName": "domain"
    },
    "toEmail": {
      "friendlyName": "To (email)",
      "example": "jane@example.com",
      "description": "Email address of the primary recipient.",
      "required": true,
      "type": "string",
      "name": "toEmail"
    },
    "toName": {
      "friendlyName": "To (name)",
      "example": "Jane Doe",
      "description": "Full name of the primary recipient.",
      "extendedDescription": "If left blank, defaults to the recipient's email address.",
      "type": "string",
      "name": "toName"
    },
    "subject": {
      "friendlyName": "Subject",
      "description": "Subject line for the email.",
      "example": "Welcome, Jane!",
      "type": "string",
      "name": "subject"
    },
    "message": {
      "friendlyName": "Message",
      "description": "The plaintext body of the email.",
      "example": "Jane,\nThanks for joining our community.  If you have any questions, please don't hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management",
      "type": "string",
      "name": "message"
    },
    "fromEmail": {
      "friendlyName": "From (email)",
      "description": "Email address of the sender.",
      "example": "harold@example.enterprise",
      "type": "string",
      "name": "fromEmail"
    },
    "fromName": {
      "friendlyName": "From (name)",
      "description": "Full name of the sender.",
      "example": "Harold Greaseworthy",
      "type": "string",
      "name": "fromName"
    }
  },
  "exits": {
    "error": {
      "example": undefined
    },
    "success": {
      "description": "OK.",
      "isDefault": true,
      "name": "success",
      "friendlyName": "success"
    }
  },
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var util = require('util');
    var Mailgun = require('mailgun-js');

    var mailgun = Mailgun({
      apiKey: inputs.apiKey,
      domain: inputs.domain
    });

    // e.g. ['John Doe <john@example.com>']
    var recipients = [
      (function() {
        if (!inputs.toName) {
          return inputs.toEmail;
        }
        return util.format('%s <%s>', inputs.toName, inputs.toEmail);
      })()
    ];

    // e.g. 'John Doe <john@example.com>'
    var from = (function() {
      if (!inputs.fromEmail) {
        return 'noreply@example.com';
      }
      if (!inputs.fromName) {
        return inputs.fromEmail;
      }
      return util.format('%s <%s>', inputs.fromName, inputs.fromEmail);
    })();

    mailgun.messages().send({
      from: from,
      to: recipients,
      subject: inputs.subject || 'Hello world!',
      text: inputs.message || ' ',
      // attachment: attch
    }, function(err, body) {
      if (err) return exits.error(err);
      return exits.success();
    });

  },
  "identity": "send-plaintext-email"
};