import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Loader2,
  ChefHat,
  Zap,
  Scale,
  Copy,
  Check,
  AlertCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getFirestoreChatMessages,
  saveFirestoreChatMessage,
  clearFirestoreChatMessages,
} from '../services/firebase.js';

const CHAT_ROLES = [
  {
    id: 'culinary_advisor',
    name: 'Chef Kwame',
    taskType: 'general',
    model: 'gemini-3.5-flash',
    badge: 'General Culinary',
    description: 'Expert advice on world & African cuisines, techniques, flavors & pairings',
    icon: ChefHat,
    placeholder: 'Ask Chef Kwame about recipes, techniques, or flavor combinations...',
    suggestedPrompts: [
      'How do I achieve that authentic smoky flavor in party Jollof rice?',
      'What are the best side dishes to serve with Banku and grilled tilapia?',
      'How can I fix a sauce that turned out too salty or sour?',
      'What herbs pair best with roasted plantains and fish?',
    ],
  },
  {
    id: 'quick_chef',
    name: 'Sous-Chef Express',
    taskType: 'fast',
    model: 'gemini-3.1-flash-lite',
    badge: 'Fast & Instant',
    description: 'Instant ingredient swaps, measurement conversions, and quick timers',
    icon: Zap,
    placeholder: 'Ask for rapid substitutions, metric conversions, or cooking times...',
    suggestedPrompts: [
      'Emergency substitute for buttermilk in pancakes?',
      'Convert 2.5 cups of all-purpose flour to grams.',
      'How long should I boil plantains for Fufu?',
      'What can I replace groundnut paste with for allergy-friendly soup?',
    ],
  },
  {
    id: 'meal_planner',
    name: 'Master Gastronomist',
    taskType: 'complex',
    model: 'gemini-3.1-pro-preview',
    badge: 'Complex Planning',
    description: 'Multi-course menus, strict dietary restrictions, macros & batch prep',
    icon: Scale,
    placeholder: 'Request complete meal prep schedules, macro balancing, or multi-course dinner plans...',
    suggestedPrompts: [
      'Design a 3-course Ghanaian dinner party menu with a consolidated grocery list.',
      'Create a high-protein, gluten-free 5-day dinner meal plan with prep timelines.',
      'How to adapt a traditional West African feast for diabetic and low-sodium diets?',
      'Explain the culinary food science behind gelatinization in Banku dough.',
    ],
  },
];

const LOCAL_CHAT_STORAGE_KEY = 'recipe_finder_gemini_chat_history';

export default function CulinaryChat({
  isOpen,
  onClose,
  initialContextRecipe = null,
}) {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.uid || user?.id || null;

  const [activeRole, setActiveRole] = useState(CHAT_ROLES[0]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history from Firestore (if signed in) or localStorage
  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      if (isAuthenticated && userId) {
        try {
          const cloudMessages = await getFirestoreChatMessages(userId);
          if (isMounted && cloudMessages && cloudMessages.length > 0) {
            setMessages(cloudMessages);
            return;
          }
        } catch (err) {
          console.warn('Could not load Firestore chat history:', err);
        }
      }

      // Fallback local storage
      try {
        const local = localStorage.getItem(LOCAL_CHAT_STORAGE_KEY);
        if (local && isMounted) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch {
        // ignore
      }
    }

    if (isOpen) {
      loadHistory();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, isAuthenticated, userId]);

  // Pre-seed context if opened for a specific recipe
  useEffect(() => {
    if (initialContextRecipe && isOpen) {
      const recipeTitle = initialContextRecipe.strMeal || 'this recipe';
      const prompt = `Tell me Chef Kwame's top 3 cooking tips and secret enhancements for making ${recipeTitle}.`;
      setInputText(prompt);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [initialContextRecipe, isOpen]);

  // Autoscroll to bottom when messages update
  useEffect(() => {
    if (!isMinimized && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isMinimized]);

  // Save messages to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText !== null ? customText : inputText).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setInputText('');

    const userMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      userId: userId || 'guest',
      role: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    // Save user message to Firestore if authenticated
    if (isAuthenticated && userId) {
      saveFirestoreChatMessage(userId, userMessage).catch((err) =>
        console.warn('Firestore save user message notice:', err)
      );
    }

    try {
      // Call backend proxy endpoint with history and role system instruction
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          role: activeRole.id,
          taskType: activeRole.taskType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to get culinary response.`);
      }

      const data = await response.json();

      const aiMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId: userId || 'guest',
        role: 'model',
        text: data.text || 'I could not generate an answer right now.',
        model: data.model || activeRole.model,
        roleName: activeRole.name,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save AI message to Firestore if authenticated
      if (isAuthenticated && userId) {
        saveFirestoreChatMessage(userId, aiMessage).catch((err) =>
          console.warn('Firestore save model message notice:', err)
        );
      }
    } catch (err) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'Unable to connect to the culinary assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Clear all conversation history?')) {
      setMessages([]);
      localStorage.removeItem(LOCAL_CHAT_STORAGE_KEY);
      if (isAuthenticated && userId) {
        try {
          await clearFirestoreChatMessages(userId);
        } catch (err) {
          console.warn('Could not clear Firestore messages:', err);
        }
      }
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  const RoleIcon = activeRole.icon;

  return (
    <aside
      id="culinary-chat-container"
      aria-label="Culinary AI Assistant"
      className={`fixed z-50 transition-all duration-200 shadow-2xl bg-white border border-[#CBD5E1] rounded-2xl flex flex-col overflow-hidden ${
        isMinimized
          ? 'bottom-5 right-5 w-80 h-14'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[480px] h-[580px] max-h-[85vh]'
      }`}
    >
      {/* Header Bar */}
      <div className="bg-[#003B73] text-white px-4 py-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <RoleIcon size={18} className="text-[#FFC107]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm truncate">{activeRole.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-medium tracking-wide">
                {activeRole.badge}
              </span>
            </div>
            <p className="text-[11px] text-white/70 truncate hidden sm:block">
              {activeRole.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {!isMinimized && messages.length > 0 && (
            <button
              type="button"
              id="chat-clear-history-btn"
              onClick={handleClearHistory}
              title="Clear chat history"
              className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMinimized((prev) => !prev)}
            title={isMinimized ? 'Expand Chat' : 'Minimize'}
            className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
          </button>

          <button
            type="button"
            id="chat-close-btn"
            onClick={onClose}
            title="Close Chat"
            className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Persona / Role Selector Tabs */}
          <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] p-2 shrink-0">
            <div className="grid grid-cols-3 gap-1">
              {CHAT_ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = activeRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-[#003B73] font-semibold shadow-xs border border-[#CBD5E1]'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs">
                      <Icon size={13} className={isSelected ? 'text-[#0056B3]' : 'text-[#64748B]'} />
                      <span className="truncate">{role.name.split(' ')[0]}</span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8] font-normal leading-none mt-0.5">
                      {role.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Scrollable Thread */}
          <div
            id="culinary-chat-thread"
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAFA]"
          >
            {/* Welcome / Role Introduction Card */}
            {messages.length === 0 && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 text-center my-2 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0056B3] flex items-center justify-center mx-auto mb-2">
                  <RoleIcon size={20} />
                </div>
                <h3 className="font-semibold text-sm text-[#003B73]">
                  {activeRole.name} · {activeRole.badge}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  {activeRole.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">
                    Quick Suggestions
                  </span>
                  <div className="flex flex-col gap-1.5 text-left">
                    {activeRole.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="text-xs text-[#0056B3] hover:text-[#003B73] bg-[#F1F5F9] hover:bg-[#EAF4FF] p-2 rounded-md transition-colors text-left font-medium cursor-pointer"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rendered Messages */}
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#0056B3] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-[#1E293B] border border-[#E2E8F0] rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#F1F5F9] text-[11px] text-[#64748B]">
                        <span className="font-semibold text-[#003B73] flex items-center gap-1">
                          <Bot size={12} className="text-[#0056B3]" />
                          {msg.roleName || activeRole.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            title="Copy response"
                            className="hover:text-[#003B73] p-0.5 cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <Check size={12} className="text-green-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  </div>

                  <span className="text-[10px] text-[#94A3B8] px-1 mt-1 font-medium">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-bl-xs p-3.5 shadow-xs flex items-center gap-2 text-xs text-[#64748B]">
                  <Loader2 size={16} className="animate-spin text-[#0056B3]" />
                  <span>{activeRole.name} is preparing culinary advice...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-[#fff2f2] border border-[#ffcdd2] text-[#b71c1c] text-xs p-3 rounded-lg flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-3 bg-white border-t border-[#E2E8F0] shrink-0">
            <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 focus-within:border-[#0056B3] focus-within:ring-1 focus-within:ring-[#0056B3]">
              <textarea
                ref={inputRef}
                id="culinary-chat-input"
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={activeRole.placeholder}
                disabled={isLoading}
                className="flex-1 bg-transparent resize-none text-xs sm:text-sm text-[#1E293B] outline-hidden placeholder:text-[#94A3B8] max-h-24 py-1"
              />
              <button
                type="button"
                id="culinary-chat-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                aria-label="Send message"
                className="w-8 h-8 rounded-lg bg-[#0056B3] text-white flex items-center justify-center hover:bg-[#003B73] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mt-1.5 px-1">
              <span>Enter to send · Shift+Enter for new line</span>
              <span>
                {isAuthenticated ? 'Synced with Firestore' : 'Saved in session'}
              </span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
