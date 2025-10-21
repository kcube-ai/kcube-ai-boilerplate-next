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
