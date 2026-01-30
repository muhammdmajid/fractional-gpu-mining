import { render } from "@react-email/render";
import type { ComponentProps } from "react";
import { OTPEmailVerificationTemplate } from "./templates/otp-email-verification";
import { PasswordResetEmail } from "./templates/password-reset";
import { OTPPasswordForgotTemplate } from "./templates/otp-forgot-password";
import { EmailVerifiedTemplate } from "./templates/email-verification";
import SignInSuccessTemplate from "./templates/sign-in-success";
import { DepositNotificationEmail } from "./templates/send-deposit-notification";
import { DepositApprovedNotification } from "./templates/deposit-approved-notification";
import { WithdrawalNotificationEmail } from "./templates/send-widthdrawal-notification";
import { WithdrawalApprovedNotification } from "./templates/withdrawal-approved-notification";
import NewTicketTemplate from "./templates/new-ticket-template";
// ✅ import new template

export enum EmailTemplate {
  OTPEmailVerification = "OTPEmailVerification",
  OTPPasswordForgot = "OTPPasswordForgot",
  PasswordReset = "PasswordReset",
  EmailVerified = "EmailVerified",
  SignInSuccess = "SignInSuccess",
  DepositNotification = "DepositNotification", // ✅ add new template
  WithdrawalNotificationEmail = "WithdrawalNotificationEmail",
  DepositApprovedNotification = "DepositApprovedNotification",
  WithdrawalApprovedNotification = "WithdrawalApprovedNotification",
    NewTicket = "NewTicket",
}

export type PropsMap = {
  [EmailTemplate.OTPEmailVerification]: ComponentProps<
    typeof OTPEmailVerificationTemplate
  >;
  [EmailTemplate.OTPPasswordForgot]: ComponentProps<
    typeof OTPPasswordForgotTemplate
  >;
  [EmailTemplate.PasswordReset]: ComponentProps<typeof PasswordResetEmail>;
  [EmailTemplate.EmailVerified]: ComponentProps<typeof EmailVerifiedTemplate>;
  [EmailTemplate.SignInSuccess]: ComponentProps<typeof SignInSuccessTemplate>;
  [EmailTemplate.DepositNotification]: ComponentProps<
    typeof DepositNotificationEmail
  >; // ✅ add props type
  [EmailTemplate.DepositApprovedNotification]: ComponentProps<
    typeof DepositApprovedNotification
  >;
  [EmailTemplate.WithdrawalNotificationEmail]: ComponentProps<
    typeof WithdrawalNotificationEmail
  >;

  [EmailTemplate.WithdrawalApprovedNotification]: ComponentProps<
    typeof WithdrawalApprovedNotification
  >;
  [EmailTemplate.NewTicket]: ComponentProps<typeof NewTicketTemplate>; 
};

export const getEmailTemplate = async <T extends EmailTemplate>(
  template: T,
  props: PropsMap[NoInfer<T>]
) => {
  switch (template) {
    case EmailTemplate.OTPEmailVerification:
      return {
        subject: "Your One-Time Password (OTP) for Email Verification",
        body: await render(
          <OTPEmailVerificationTemplate
            {...(props as PropsMap[EmailTemplate.OTPEmailVerification])}
          />
        ),
      };

    case EmailTemplate.OTPPasswordForgot:
      return {
        subject: "Password Reset Request – OTP Code Enclosed",
        body: await render(
          <OTPPasswordForgotTemplate
            {...(props as PropsMap[EmailTemplate.OTPPasswordForgot])}
          />
        ),
      };

    case EmailTemplate.PasswordReset:
      return {
        subject: "Reset your password",
        body: await render(
          <PasswordResetEmail
            {...(props as PropsMap[EmailTemplate.PasswordReset])}
          />
        ),
      };

    case EmailTemplate.EmailVerified:
      return {
        subject: "Your Email Has Been Successfully Verified",
        body: await render(
          <EmailVerifiedTemplate
            {...(props as PropsMap[EmailTemplate.EmailVerified])}
          />
        ),
      };

    case EmailTemplate.SignInSuccess:
      return {
        subject: "Sign-In Successful — Welcome Back!",
        body: await render(
          <SignInSuccessTemplate
            {...(props as PropsMap[EmailTemplate.SignInSuccess])}
          />
        ),
      };

    case EmailTemplate.DepositNotification: // ✅ render deposit template
      return {
        subject: `${(props as PropsMap[EmailTemplate.DepositNotification]).subject}`,
        body: await render(
          <DepositNotificationEmail
            {...(props as PropsMap[EmailTemplate.DepositNotification])}
          />
        ),
      };

    case EmailTemplate.DepositApprovedNotification:
      return {
        subject: `${(props as PropsMap[EmailTemplate.DepositApprovedNotification]).subject}`,
        body: await render(
          <DepositApprovedNotification
            {...(props as PropsMap[EmailTemplate.DepositApprovedNotification])}
          />
        ),
      };

    case EmailTemplate.WithdrawalNotificationEmail: // ✅ render deposit template
      return {
        subject: `${(props as PropsMap[EmailTemplate.WithdrawalNotificationEmail]).subject}`,
        body: await render(
          <WithdrawalNotificationEmail
            {...(props as PropsMap[EmailTemplate.WithdrawalNotificationEmail])}
          />
        ),
      };

    case EmailTemplate.WithdrawalApprovedNotification:
      return {
        subject: `${(props as PropsMap[EmailTemplate.WithdrawalApprovedNotification]).subject}`,
        body: await render(
          <WithdrawalApprovedNotification
            {...(props as PropsMap[EmailTemplate.WithdrawalApprovedNotification])}
          />
        ),
      };
    case EmailTemplate.NewTicket: // ✅ render new ticket template
      return {
        subject: `New Support Ticket: ${(props as PropsMap[EmailTemplate.NewTicket]).subject}`,
        body: await render(<NewTicketTemplate {...(props as PropsMap[EmailTemplate.NewTicket])} />),
      };

    default:
      throw new Error("Invalid email template");
  }
};
