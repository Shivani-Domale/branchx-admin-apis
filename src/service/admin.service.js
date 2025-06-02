const sendResetCodeEmail = require('../utils/sendResetCodeEmail');

await sendResetCodeEmail(admin.email, resetToken);
