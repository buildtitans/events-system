import { ResendVariables } from "@/src/server/core/lib/init/resendSecrets";
import { ResendPasswordResetMailer } from "@/src/server/core/service/integrations/resendPasswordResetMailer";
import { PasswordResetEmailService } from "@/src/server/core/service/services/passwordResetEmailService";
import { dbMock } from "@/src/server/core/service/tests/mockers/mocks";

const sendEmailMock = jest.fn();

jest.mock(
  "@/src/server/core/service/integrations/resendPasswordResetMailer",
  () => ({
    ResendPasswordResetMailer: jest.fn().mockImplementation(() => ({
      sendEmail: sendEmailMock,
    })),
  }),
);

describe("PasswordResetEmailService.request", () => {
  const requestPasswordResetInDb = dbMock.auth.requestPasswordReset as jest.Mock;
  const ResendPasswordResetMailerMock =
    ResendPasswordResetMailer as unknown as jest.Mock;

  const resendSecrets: ResendVariables = {
    resendKey: "resend-key",
    resendUrl: "https://events-system.dev/reset-password",
  };

  let service: PasswordResetEmailService;

  beforeEach(() => {
    jest.resetAllMocks();
    ResendPasswordResetMailerMock.mockImplementation(() => ({
      sendEmail: sendEmailMock,
    }));
    service = new PasswordResetEmailService(dbMock, resendSecrets);
  });

  it("creates the resend mailer with the provided secrets", () => {
    expect(ResendPasswordResetMailerMock).toHaveBeenCalledWith(resendSecrets);
  });

  it("returns ok true without sending an email when no reset token is created", async () => {
    requestPasswordResetInDb.mockResolvedValue({ token: undefined });

    await expect(service.request("alice@example.com")).resolves.toEqual({
      ok: true,
    });

    expect(requestPasswordResetInDb).toHaveBeenCalledWith("alice@example.com");
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("sends the reset email when a token is created", async () => {
    requestPasswordResetInDb.mockResolvedValue({ token: "reset-token" });
    sendEmailMock.mockResolvedValue({ id: "email-1" });

    await expect(service.request("alice@example.com")).resolves.toEqual({
      ok: true,
    });

    expect(requestPasswordResetInDb).toHaveBeenCalledWith("alice@example.com");
    expect(sendEmailMock).toHaveBeenCalledWith(
      "reset-token",
      "alice@example.com",
    );
  });
});
