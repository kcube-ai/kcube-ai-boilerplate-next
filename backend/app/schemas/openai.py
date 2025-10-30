from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    instructions: str = Field(
        ..., description="Developer/system instructions for the assistant")
    prompt: str = Field(..., description="The user's message or question")


class ChatResponse(BaseModel):
    message: str = Field(..., description="The assistant's generated response")
    tokens_used: int = Field(...,
                             description="The total number of tokens used in the request")
