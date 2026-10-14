// src/components/ai/ChatWidget.jsx
// KFT Assistant: floating AI chat for signed-in users (customers, vendors and admins
// each get role-appropriate help). The conversation is kept per tab and per role.
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle, FiX, FiSend, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { aiApi, aiErrorMessage } from '../../api/aiApi';
import { FoodItemCard } from '../user/AIRecommendations';

const STARTERS = {
  user: ['Suggest a healthy dinner', 'Where is my last order?', 'Low-carb options near me?'],
  vendor: ['How do I get my restaurant approved?', 'How do I add menu items?', 'How are my orders doing?'],
  admin: ["What's waiting for approval?", 'How do I approve a restaurant?', 'How do commissions work?'],
};

const MAX_TURNS_SENT = 10;

const storageKey = (role) => `kft_chat_${role}`;
const loadHistory = (role) => {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey(role)) || '[]');
  } catch {
    return [];
  }
};

// Renders **bold** and "- " bullets from the assistant's reply without injecting HTML.
const renderInline = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );

const Reply = ({ text }) => {
  const blocks = [];
  let bullets = [];
  const flush = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={`ul${blocks.length}`} className="list-disc space-y-0.5 pl-5">
          {bullets.map((b, i) => <li key={i}>{renderInline(b)}</li>)}
        </ul>
      );
      bullets = [];
    }
  };
  text.split('\n').forEach((line) => {
    const m = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
    if (m) {
      bullets.push(m[1]);
    } else {
      flush();
      if (line.trim()) blocks.push(<p key={`p${blocks.length}`}>{renderInline(line)}</p>);
    }
  });
  flush();
  return <div className="space-y-2">{blocks}</div>;
};

const ChatWidget = () => {
  const { isAuthenticated, user, activeRole } = useAuth();
  const role = activeRole === 'admin' ? 'admin' : activeRole === 'vendor' ? 'vendor' : 'user';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadHistory(role));
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Switching between role sessions shows that role's own conversation.
  useEffect(() => setMessages(loadHistory(role)), [role]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey(role), JSON.stringify(messages.slice(-30)));
    } catch {
      // History is a convenience only.
    }
  }, [messages, role]);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ block: 'end' });
      inputRef.current?.focus();
    }
  }, [open, messages, sending]);

  if (!isAuthenticated || !user) return null;

  const send = async (text = input) => {
    const message = text.trim();
    if (!message || sending) return;
    const history = messages.slice(-MAX_TURNS_SENT).map(({ role: r, content }) => ({ role: r, content }));
    setMessages((m) => [...m, { role: 'user', content: message }]);
    setInput('');
    setSending(true);
    try {
      const res = await aiApi.chat({ message, history });
      setMessages((m) => [...m, { role: 'assistant', content: res.reply, items: res.items || [], urgent: res.urgent }]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: aiErrorMessage(error, 'Sorry, I could not answer right now. Please try again.'), error: true },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          aria-label="Open KFT Assistant"
        >
          <FiMessageCircle className="h-6 w-6" />
          <span className="hidden text-sm font-medium sm:inline">Ask KFT AI</span>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-x-2 bottom-2 top-16 z-50 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:inset-x-auto sm:right-5 sm:top-auto sm:bottom-5 sm:h-[560px] sm:w-[380px] dark:border-gray-700 dark:bg-gray-900"
          role="dialog"
          aria-label="KFT Assistant"
        >
          <div className="flex items-center justify-between bg-emerald-600 px-4 py-3 text-white">
            <div>
              <p className="font-semibold">KFT Assistant</p>
              <p className="text-xs text-emerald-100">AI help with food, health & orders</p>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button type="button" onClick={() => setMessages([])} className="rounded p-2 hover:bg-emerald-700" aria-label="Clear conversation">
                  <FiTrash2 className="h-4 w-4" />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="rounded p-2 hover:bg-emerald-700" aria-label="Close assistant">
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-300">
                  Hi {user.full_name?.split(' ')[0] || 'there'}! Ask me anything about food, healthy choices, or your KFT account.
                </p>
                <div className="flex flex-wrap gap-2">
                  {STARTERS[role].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-emerald-200 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {role === 'user' && (
                  <Link to="/ai-advisor" onClick={() => setOpen(false)} className="block text-xs text-emerald-700 underline dark:text-emerald-400">
                    Open the full AI Food Advisor for meal plans →
                  </Link>
                )}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : m.error || m.urgent
                        ? 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  {m.role === 'user' ? <p className="whitespace-pre-line">{m.content}</p> : <Reply text={m.content} />}
                  {m.items?.length > 0 && role === 'user' && (
                    <div className="mt-2 space-y-2">
                      {m.items.map((item) => (
                        <FoodItemCard key={item.menu_item_id} item={item} compact />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-gray-100 px-3 py-3 dark:bg-gray-800" aria-label="Assistant is typing">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-2 border-t border-gray-200 p-3 dark:border-gray-700"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              maxLength={1000}
              placeholder="Type your message…"
              className="max-h-28 flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 disabled:opacity-50"
              aria-label="Send"
            >
              <FiSend className="h-5 w-5" />
            </button>
          </form>
          <p className="px-3 pb-2 text-[11px] text-gray-400">AI can make mistakes. Not medical advice.</p>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
