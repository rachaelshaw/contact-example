var Machine = require("machine");
module.exports = {
    create: function(req, res) {
        Machine.build({
            inputs: {
                "message": {
                    "example": "Jane,\nThanks for joining our community.  If you have any questions, please don't hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management"
                },
                "email": {
                    "example": "harold@example.enterprise"
                },
                "name": {
                    "example": "Harold Greaseworthy"
                }
            },
            exits: {
                respond: {}
            },
            fn: function(inputs, exits) {
                // Send plaintext email
                sails.machines['00ba429e-d255-4f44-8efc-af6f5cfa4942_0.3.1'].sendPlaintextEmail({
                    "apiKey": "key-ca5abd128cdbd5dfd8fbda7382c38044",
                    "domain": "sandbox725b61a23916412aa9b42110eb627743.mailgun.org",
                    "toEmail": "rachael@treeline.io",
                    "toName": "Rachael",
                    "subject": "New Contact Form Message",
                    "message": inputs.message,
                    "fromEmail": inputs.email,
                    "fromName": inputs.name
                }).exec({
                    "error": function(sendPlaintextEmail) {
                        return exits.error({
                            data: sendPlaintextEmail,
                            status: 500
                        });

                    },
                    "success": function(sendPlaintextEmail) {
                        return exits.respond({
                            action: "respond_with_status",
                            status: 200
                        });

                    }
                });
            }
        }).configure(req.params.all(), {
            respond: res.response,
            error: res.negotiate
        }).exec();
    }
};