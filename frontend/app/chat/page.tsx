"use client";

import { useEffect, useState, useRef } from "react";

import {
  ChatService,
  MessageService,
  type ChatPublic,
  type MessagePublic,
} from "@/app/client";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { APP_NAME } from "@/config/app";
import { useUser } from "@/contexts/user-context";
import { handleError } from "@/lib/error";
import { formatDate, formatDateFull, getInitials } from "@/lib/format";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  MessageCircle,
  Plus,
  Send,
  Loader2,
  Sparkles,
  FileText,
  Bot,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

export default function ChatPage() {
  usePageTitle(`Chat - ${APP_NAME}`);
  const { user } = useUser();

  const [chats, setChats] = useState<ChatPublic[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessagePublic[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    }
  }, [selectedChatId]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const data = await ChatService.getListApiV1ChatListGet();
      console.log("Loaded chats:", data);
      setChats(data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const data = await ChatService.getApiV1ChatChatIdGet({ chatId });
      setMessages(data.messages || []);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    // Immediately show user message in UI
    const tempUserMessage: MessagePublic = {
      id: "temp-user",
      chat_id: selectedChatId || "",
      role: "USER",
      content: messageContent,
      meta_data: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await MessageService.postMessageApiV1MessagePost({
        requestBody: {
          chat_id: selectedChatId || undefined,
          content: messageContent,
        },
      });

      // If new chat was created, reload chats and set selected
      if (!selectedChatId) {
        await loadChats();
        setSelectedChatId(response.chat_id);
      } else {
        // Reload messages for existing chat
        await loadMessages(selectedChatId);
        // Update chat list: move current chat to top and update timestamp
        setChats((prevChats) => {
          const currentChat = prevChats.find((c) => c.id === selectedChatId);
          if (!currentChat) return prevChats;

          const updatedChat = {
            ...currentChat,
            updated_at: new Date().toISOString(),
          };
          const otherChats = prevChats.filter((c) => c.id !== selectedChatId);
          return [updatedChat, ...otherChats];
        });
      }
    } catch (error) {
      handleError(error);
      setInputMessage(messageContent);
      // Remove the temporary message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== "temp-user"));
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setMessages([]);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartEdit = (chat: ChatPublic) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
    setMenuOpenChatId(null);
    setTimeout(() => editInputRef.current?.select(), 0);
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleSaveEdit = async () => {
    if (!editingChatId || !editingTitle.trim()) return;

    try {
      await ChatService.updateApiV1ChatChatIdPut({
        chatId: editingChatId,
        requestBody: { title: editingTitle.trim() },
      });

      // Update chat in list and move to top
      setChats((prevChats) => {
        const updatedChat = prevChats.find((c) => c.id === editingChatId);
        if (!updatedChat) return prevChats;

        const updated = {
          ...updatedChat,
          title: editingTitle.trim(),
          updated_at: new Date().toISOString(),
        };
        const otherChats = prevChats.filter((c) => c.id !== editingChatId);
        return [updated, ...otherChats];
      });

      setEditingChatId(null);
      setEditingTitle("");
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    setDeletingChatId(chatId);
    try {
      await ChatService.deleteApiV1ChatChatIdDelete({ chatId });

      // Remove from list
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

      // If deleted chat was selected, clear selection
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
        setMessages([]);
      }

      setMenuOpenChatId(null);
    } catch (error) {
      handleError(error);
    } finally {
      setDeletingChatId(null);
    }
  };

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingChatId]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenChatId(null);
    if (menuOpenChatId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [menuOpenChatId]);

  return (
    <DashboardLayout>
      <div className="w-full max-w-[1600px] h-[calc(100vh-8rem)]">
        <div className="flex h-full gap-4">
          {/* Chat List Sidebar */}
          <div className="w-80 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">Chats</h2>
                <Button
                  size="sm"
                  onClick={handleNewChat}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  New
                </Button>
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : chats.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No chats yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start a new conversation
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {chats.map((chat) => {
                    const isEditing = editingChatId === chat.id;
                    const isMenuOpen = menuOpenChatId === chat.id;
                    const isDeleting = deletingChatId === chat.id;

                    return (
                      <div
                        key={chat.id}
                        className={`group relative rounded-lg transition-colors ${
                          selectedChatId === chat.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-accent border border-transparent"
                        }`}
                      >
                        {isEditing ? (
                          <div className="p-3 flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit();
                                if (e.key === "Escape") handleCancelEdit();
                              }}
                              className="flex-1 bg-background border border-primary rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                              maxLength={500}
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 hover:bg-primary/10 rounded"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 hover:bg-primary/10 rounded"
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setSelectedChatId(chat.id)}
                              className="w-full text-left p-3 pr-10"
                            >
                              <div className="flex items-start gap-3">
                                <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {chat.title}
                                  </p>
                                  <p
                                    className="text-xs text-muted-foreground mt-1"
                                    title={formatDateFull(chat.updated_at)}
                                  >
                                    {formatDate(chat.updated_at)}
                                  </p>
                                </div>
                              </div>
                            </button>

                            {/* Actions Menu */}
                            <div className="absolute right-2 top-2.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpenChatId(
                                    isMenuOpen ? null : chat.id
                                  );
                                }}
                                className="p-1.5 hover:bg-muted rounded transition-colors"
                              >
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-8 w-40 bg-card border border-border rounded-lg shadow-lg py-1 z-10">
                                  <button
                                    onClick={() => handleStartEdit(chat)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center gap-2"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Rename
                                  </button>
                                  <button
                                    onClick={() => handleDeleteChat(chat.id)}
                                    disabled={isDeleting}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center gap-2 text-red-600 disabled:opacity-50"
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Start a conversation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ask questions about your documents and get AI-powered
                      answers with context from your uploaded files.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isUser = message.role.toLowerCase() === "user";

                    return (
                      <div
                        key={message.id}
                        className={`flex w-full gap-3 ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isUser && (
                          <div className="flex-shrink-0 self-start pt-1">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                              <span className="text-white text-sm font-bold">M</span>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col max-w-[65%]">
                          <div
                            className={`group relative ${
                              isUser
                                ? "bg-primary text-primary-foreground rounded-[18px] rounded-br-md"
                                : "bg-muted/50 text-foreground rounded-[18px] rounded-bl-md"
                            } px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-200`}
                          >
                            <p className="text-[14.5px] leading-[1.5] whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                            <p
                              className={`text-[10px] mt-1 text-right ${
                                isUser
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground"
                              }`}
                              title={formatDateFull(message.created_at)}
                            >
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        </div>
                        {isUser && user && (
                          <div className="flex-shrink-0 self-start pt-1">
                            {user.profile_picture ? (
                              <img
                                src={user.profile_picture}
                                alt={user.full_name}
                                className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-primary/10"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shadow-sm ring-2 ring-primary/10">
                                {getInitials(user.full_name, user.email)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {isSending && (
                    <div className="flex justify-start gap-3">
                      <div className="flex-shrink-0 self-start pt-1">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                          <span className="text-white text-sm font-bold">M</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 max-w-[65%]">
                        <div className="bg-muted/50 rounded-[18px] rounded-bl-md px-5 py-3.5 shadow-sm">
                          <div className="flex items-center gap-2.5">
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            <div className="flex gap-1.5">
                              <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about your documents..."
                    className="w-full px-4 py-3 pr-12 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm min-h-[52px] max-h-32"
                    rows={1}
                    disabled={isSending}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                    {inputMessage.length}/5000
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isSending}
                  size="lg"
                  className="gap-2"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <FileText className="h-3 w-3" />
                Answers are generated from your uploaded documents
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
