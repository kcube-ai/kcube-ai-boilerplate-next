from fastapi_mail import FastMail, MessageSchema, MessageType
from app.email.config import conf


async def send_verification_email(recipient: str, verify_url: str):
    html = f"""
    <html>
        <body>
            <h2>Verify your email</h2>
            <p>Open the link below to verify your account:</p>
            <p>This link will expire in 1 hour</p>
            <a>{verify_url}</a>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Verify your email address",
        recipients=[recipient],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)


async def send_pw_reset_email(recipient: str, reset_url: str):
    html = f"""
    <html>
        <body>
            <h2>Reset Password</h2>
            <p>Open the link below to reset your Password</p>
            <p>This link will expire in 1 hour</p>
            <a>{reset_url}</a>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Reset your password",
        recipients=[recipient],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)


async def send_email_change_link(recipient: str, reset_url: str):
    html = f"""
    <html>
        <body>
            <h2>Change Email</h2>
            <p>Open the link below to change your email</p>
            <p>This link will expire in 1 hour</p>
            <a>{reset_url}</a>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Change your email",
        recipients=[recipient],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
