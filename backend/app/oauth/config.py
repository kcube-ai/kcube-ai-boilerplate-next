from authlib.integrations.starlette_client import OAuth
from app.core.config import settings

oauth = OAuth()

oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v2/',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile',
        'prompt': 'select_account',
    }
)

oauth.register(
    name='microsoft',
    client_id=settings.MICROSOFT_CLIENT_ID,
    client_secret=settings.MICROSOFT_CLIENT_SECRET,
    authorize_url=f"https://login.microsoftonline.com/{
        settings.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize",
    access_token_url=f"https://login.microsoftonline.com/{
        settings.MICROSOFT_TENANT_ID}/oauth2/v2.0/token",
    api_base_url="https://graph.microsoft.com/v1.0/",
    server_metadata_url=f"https://login.microsoftonline.com/{
        settings.MICROSOFT_TENANT_ID}/v2.0/.well-known/openid-configuration",
    client_kwargs={
        'scope': 'openid email profile offline_access User.Read',
        'prompt': 'select_account',
    },
)
