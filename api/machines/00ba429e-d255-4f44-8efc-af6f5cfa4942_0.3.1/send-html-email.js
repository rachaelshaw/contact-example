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
      "example": "jane@example.com",
      "description": "Email address of the primary recipient.",
      "required": true,
      "type": "string",
      "name": "toEmail",
      "friendlyName": "toEmail"
    },
    "toName": {
      "example": "Jane Doe",
      "description": "Full name of the primary recipient.",
      "extendedDescription": "If left blank, defaults to the recipient's email address.",
      "type": "string",
      "name": "toName",
      "friendlyName": "toName"
    },
    "subject": {
      "description": "Subject line for the email.",
      "example": "Welcome, Jane!",
      "type": "string",
      "name": "subject",
      "friendlyName": "subject"
    },
    "textMessage": {
      "description": "The plaintext body of the email.",
      "example": "Jane,\nThanks for joining our community.  If you have any questions, please don't hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management",
      "type": "string",
      "name": "textMessage",
      "friendlyName": "textMessage"
    },
    "htmlMessage": {
      "description": "The html body of the email.",
      "example": "Jane,\nThanks for joining our community.  If you have any questions, please don't hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management",
      "type": "string",
      "name": "htmlMessage",
      "friendlyName": "htmlMessage"
    },
    "fromEmail": {
      "description": "Email address of the sender.",
      "example": "harold@example.enterprise",
      "type": "string",
      "name": "fromEmail",
      "friendlyName": "fromEmail"
    },
    "fromName": {
      "description": "Full name of the sender.",
      "example": "Harold Greaseworthy",
      "type": "string",
      "name": "fromName",
      "friendlyName": "fromName"
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
    var MailComposer = require('mailcomposer').MailComposer;
    var mailcomposer = new MailComposer();

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

    var to = '';
    recipients.forEach(function(recipient) {
      to += recipient + ',';
    });

    // Strip off last comma
    to = to.slice(0, -1);

    mailcomposer.setMessageOption({
      from: from,
      to: to,
      subject: inputs.subject || 'Hello',
      body: inputs.textMessage || '',
      html: inputs.htmlMessage || ''
    });

    mailcomposer.buildMessage(function(mailBuildError, messageSource) {

      var dataToSend = {
        to: to,
        message: messageSource
      };

      mailgun.messages().sendMime(dataToSend, function(err, body) {
        if (err) return exits.error(err);
        return exits.success();
      });
    });
  },
  "identity": "send-html-email"
};