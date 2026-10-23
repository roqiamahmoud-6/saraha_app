
export const otpTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial,sans-serif;">

      <div style="max-width:500px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden;">

        <div style="background:#6c63ff; padding:25px; text-align:center; color:white;">
          <h1 style="margin:0;">Saraha</h1>
          <p style="margin:8px 0 0;">Email Verification</p>
        </div>

        <div style="padding:30px; text-align:center; color:#333333;">
          <h2>Hello!</h2>

          <p style="font-size:15px; line-height:1.6;">
            Use the verification code below to verify your email address.
          </p>

          <div style="background:#f1f0ff; padding:18px; margin:25px 0; border-radius:8px;">
            <span style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#6c63ff;">
              ${otp}
            </span>
          </div>

          <p style="font-size:14px; color:#777777;">
            This code expires in 5 minutes.
          </p>

          <p style="font-size:13px; color:#888888;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>

        <div style="background:#f9f9fb; padding:15px; text-align:center; font-size:12px; color:#999999;">
          &copy; 2026 Saraha. All rights reserved.
        </div>

      </div>

    </body>
    </html>
  `;
};

export const resetPasswordTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Password</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial,sans-serif;">

      <div style="max-width:500px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden;">

        <div style="background:#6c63ff; padding:25px; text-align:center; color:white;">
          <h1 style="margin:0;">Saraha App</h1>
        </div>

        <div style="padding:30px; text-align:center; color:#333333;">
          <h2>Reset Your Password</h2>

          <p style="font-size:15px; line-height:1.6; color:#666666;">
            We received a request to reset your password.
            Use the verification code below to continue.
          </p>

          <div style="margin:25px 0; padding:15px; background:#f0efff; border-radius:8px;">
            <h1 style="margin:0; color:#6c63ff; letter-spacing:8px;">
              ${otp}
            </h1>
          </div>

          <p style="font-size:14px; color:#666666;">
            This code expires in 10 minutes.
          </p>

          <p style="font-size:13px; color:#888888; line-height:1.6;">
            If you didn't request a password reset, please ignore this email
            and keep your account secure.
          </p>
        </div>

        <div style="padding:15px; text-align:center; background:#f9f9fb; color:#999999; font-size:12px;">
          &copy; 2026 Saraha App. All rights reserved.
        </div>

      </div>
    </body>
    </html>
  `;
};

export const twoStepTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Enable Two-Step Verification</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
    ">
      <div style="
        max-width: 500px;
        margin: 40px auto;
        padding: 30px;
        background-color: #ffffff;
        border-radius: 10px;
        text-align: center;
      ">
        <h2 style="color: #333333;">
          Enable Two-Step Verification
        </h2>

        <p style="color: #555555; font-size: 16px;">
          You requested to enable two-step verification
          on your account.
        </p>

        <p style="color: #555555; font-size: 16px;">
          Use the verification code below to confirm your request:
        </p>

        <div style="
          margin: 25px 0;
          padding: 15px;
          background-color: #f0f4ff;
          border-radius: 8px;
          color: #2457c5;
          font-size: 30px;
          font-weight: bold;
          letter-spacing: 8px;
        ">
          ${otp}
        </div>

        <p style="color: #777777; font-size: 14px;">
          This code expires in 10 minutes.
        </p>

        <p style="color: #777777; font-size: 14px;">
          If you did not request this change, please ignore
          this email and keep your account secure.
        </p>
      </div>
    </body>
    </html>
  `;
};
