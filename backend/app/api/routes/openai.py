from fastapi import APIRouter, Request, Response, HTTPException, Depends, status, UploadFile, File, Form
from app.dependencies.auth import auth_dependency
from app.core.openai import client
from app.schemas.auth import TokenPayload
from app.schemas.openai import ChatResponse

router = APIRouter()


@router.post("/openai/chat", response_model=ChatResponse)
async def openai_chat(
    prompt: str = Form(...),
    instructions: str = Form(None),
    file: UploadFile = File(None),
    payload: TokenPayload = Depends(auth_dependency)
):

    try:
        # If a file is included, upload it to OpenAI
        if file:
            content = await file.read()
            client.files.create(
                file=content,
                purpose="fine-tune"
            )

        # Call OpenAI
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "developer", "content": instructions},
                {"role": "user", "content": prompt},
            ],
        )

        return ChatResponse(
            message=completion.choices[0].message.content,
            tokens_used=completion.usage.total_tokens
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error communicating with OpenAI API: {str(e)}"
        )
