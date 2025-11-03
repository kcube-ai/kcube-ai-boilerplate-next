import { useState, useEffect, useRef } from "react";
import { useApiQuery, useApiMutation } from "../../hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

const base_url = import.meta.env.BACKEND_URL || "http://localhost:8000";

interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  tokens_used: number;
  created_at: string;
}

interface ChatMessageCreate {
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  tokens_used: number;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

const ChatPage = () => {
  const queryClient = useQueryClient();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data: user } = useApiQuery<User>(
    { route: "/api/users/me", isAuth: true }
  );

  const { data: conversations } = useApiQuery<Conversation[]>(
    { route: "/api/conversations", isAuth: true }
  );

  const sortedConversations = conversations?.sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  ) || [];

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (sortedConversations.length > 0 && !currentId) {
      setCurrentId(sortedConversations[0].id);
    }
  }, [sortedConversations, currentId]);

  // scroll when messages change or when generation state changes or when conversation changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentId, isGenerating]);

  const { data: messages } = useApiQuery<ChatMessage[]>(
    { route: `/api/chat-messages/${currentId}`, isAuth: true },
    {},
    { enabled: !!currentId }
  );

  // ensure we also scroll when messages array updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createConvMutation = useApiMutation<Conversation, { title: string | null }>(
    { route: "/api/conversations", method: "POST", isAuth: true },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
        setCurrentId(data.id);
      },
    }
  );

  const createMessageMutation = useApiMutation<ChatMessage, ChatMessageCreate>(
    { route: "/api/chat-messages", method: "POST", isAuth: true }
  );

  async function updateTitle(convId: string, newTitle: string | null) {
    try {
      await fetch(`${base_url}/api/conversations/${convId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  }

  async function deleteConversation(convId: string) {
    try {
      const res = await fetch(`${base_url}/api/conversations/${convId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP error: ${res.status}`);
      }

      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      queryClient.invalidateQueries({ queryKey: [`/api/chat-messages/${convId}`] });

      // Clear current conversation if it's the one being deleted
      if (currentId === convId) {
        setCurrentId(null);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  }

  async function getOpenAIResponse(prompt: string, instructions: string) {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("instructions", instructions);

    const res = await fetch(`${base_url}/api/openai/chat`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error: ${res.status}`);
    }

    return res.json() as Promise<{ message: string; tokens_used: number }>;
  }

  const handleSend = () => {
    if (!input.trim() || createMessageMutation.isPending || isGenerating) return;

    const sendFn = (convId: string) => {
      const convKey = [`/api/chat-messages/${convId}`];
      createMessageMutation.mutate(
        {
          conversation_id: convId,
          role: "user",
          content: input,
          tokens_used: 0,
        },
        {
          onSuccess: async (newUserMsg) => {
            // update local cache immediately with the new user message
            const prevMessages = queryClient.getQueryData<ChatMessage[]>(convKey) || [];
            const fullHistory = [...prevMessages, newUserMsg];
            queryClient.setQueryData(convKey, fullHistory);

            setInput("");

            const currentConv = sortedConversations.find((c) => c.id === convId);
            if (currentConv?.title === null) {
              updateTitle(convId, input.slice(0, 200));
            }

            setIsGenerating(true);

            const historyStr = fullHistory
              .slice(0, -1)
              .map((msg) => `${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}: ${msg.content}`)
              .join("\n\n");
            const instr = `You are a helpful assistant. Conversation history:\n${historyStr ? historyStr + "\n\n" : ""}Respond to the user.`;
            const prmt = fullHistory[fullHistory.length - 1].content;

            try {
              const resp = await getOpenAIResponse(prmt, instr);

              // create assistant message in DB and update cache on success
              createMessageMutation.mutate(
                {
                  conversation_id: convId,
                  role: "assistant",
                  content: resp.message,
                  tokens_used: resp.tokens_used,
                },
                {
                  onSuccess: (newAsstMsg) => {
                    const currentData = queryClient.getQueryData<ChatMessage[]>(convKey) || [];
                    const updatedHistory = [...currentData, newAsstMsg];
                    queryClient.setQueryData(convKey, updatedHistory);

                    // important: invalidate/refetch the specific chat messages query so UI updates cleanly
                    queryClient.invalidateQueries({ queryKey: convKey });

                    // also update conversations listing (last-updated ordering, etc.)
                    queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });

                    setIsGenerating(false);
                  },
                  onError: () => {
                    setIsGenerating(false);
                  },
                }
              );
            } catch (error) {
              setIsGenerating(false);
              console.error("Failed to get AI response:", error);
            }
          },
          onError: (err) => {
            console.error("Failed to create user message:", err);
          },
        }
      );
    };

    // Always create a new conversation if there's no current one
    if (!currentId) {
      createConvMutation.mutate({ title: null }, {
        onSuccess: (newConv) => sendFn(newConv.id),
      });
    } else {
      sendFn(currentId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startEditing = (convId: string, currentTitle: string | null) => {
    setEditingConvId(convId);
    setEditTitle(currentTitle || "");
  };

  const saveTitle = (convId: string) => {
    updateTitle(convId, editTitle);
    setEditingConvId(null);
  };

  const handleSettingsClick = () => {
    window.location.href = "/settings";
  };

  return (
    <div
      className="h-screen flex transition-colors duration-300 overflow-hidden"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
      }}
    >
      {/* Sidebar */}
      <div
        className="w-64 flex flex-col border-r p-4 overflow-y-auto overflow-x-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* User welcome section */}
        {user && (
          <div
            className="flex items-center justify-between mb-4 pb-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="font-medium truncate">Hello, {user.first_name}!</span>
            <button
              onClick={handleSettingsClick}
              className="cursor-pointer p-1 rounded-md hover:bg-[var(--color-accent)]/10 transition-colors"
              aria-label="Settings"
              title="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        )}

        <button
          onClick={() => createConvMutation.mutate({ title: null })}
          disabled={createConvMutation.isPending}
          className="flex items-center gap-2 mb-4 py-2 px-4 rounded-md font-medium transition-colors cursor-pointer"
          style={{
            backgroundColor: "var(--color-button)",
            color: "var(--color-button-text)",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>

        {sortedConversations.map((conv) => (
          <div
            key={conv.id}
            className={`flex items-center justify-between py-2 px-4 rounded-md cursor-pointer transition-colors hover:bg-[var(--color-accent)]/10 ${currentId === conv.id ? "bg-[var(--color-accent)]/10" : ""
              }`}
            onClick={() => setCurrentId(conv.id)}
          >
            {editingConvId === conv.id ? (
              <div className="flex flex-1 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-2 py-1 rounded-md"
                  style={{
                    backgroundColor: "var(--color-background)",
                    border: `1px solid var(--color-border)`,
                    color: "var(--color-text)",
                  }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); saveTitle(conv.id); }}
                  className="cursor-pointer"
                  aria-label="Save title"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 truncate">{conv.title || "New Chat"}</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEditing(conv.id, conv.title); }}
                    className="cursor-pointer"
                    aria-label="Edit conversation title"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    className="cursor-pointer"
                    aria-label="Delete conversation"
                    title="Delete conversation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentId ? (
            <>
              {(messages || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-4 rounded-lg max-w-[70%] break-words ${msg.role === "user"
                        ? "bg-[var(--color-button)] text-[var(--color-button-text)]"
                        : "bg-[var(--color-surface)] text-[var(--color-text)]"
                      }`}
                    style={{
                      border: `1px solid var(--color-border)`,
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="w-full flex justify-start">
                  <div
                    className="p-4 rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] max-w-[70%]"
                    style={{
                      border: `1px solid var(--color-border)`,
                    }}
                  >
                    Typing...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto opacity-50"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
                    No conversation selected
                  </h2>
                  <p className="text-sm opacity-70" style={{ color: "var(--color-text)" }}>
                    Select a conversation from the sidebar or start a new chat
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="p-4 border-t shrink-0"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--color-background)",
                border: `1px solid var(--color-border)`,
                color: "var(--color-text)",
                caretColor: "var(--color-accent)",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="p-2 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-button)",
                color: "var(--color-button-text)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
