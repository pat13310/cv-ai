import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useImperativeHandle } from "react";
import { ArrowLeft, Send, User, Bot, Loader2, AlertCircle, Mic, Volume2, VolumeX, CheckCircle2, Copy, Sparkles } from "lucide-react";
import { useOpenAI } from "../../hooks/useOpenAI";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatBubble } from './ChatBubble';

export interface ChatMessage {
  id?: string;
  role: "user" | "model";
  text: string;
  createdAt?: string | number | Date;
}

interface ChatProps {
  onBack: () => void;
  voiceEnabled?: boolean;
}

const clsx = (...tokens: Array<string | false | null | undefined>) => tokens.filter(Boolean).join(" ");

const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

// ---------- HEADER ----------
const ChatHeader: React.FC<{ onBack: () => void; speechSupported: boolean; isListening: boolean; voiceEnabled: boolean; isSpeaking: boolean; onCancelSpeak: () => void; }>
  = ({ onBack, speechSupported, isListening, voiceEnabled, isSpeaking, onCancelSpeak }) => (
    <header className="flex items-center justify-between p-4 border-b border-violet-100 bg-white/70 backdrop-blur-sm">
      <button
        onClick={onBack}
        className="border rounded-lg border-transparent p-2 flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium transition-colors hover:border-violet-400"
        aria-label="Retour au Coaching"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au Coaching</span>
      </button>

      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800">Coach de Carrière IA</h2>
        <p className="text-sm text-gray-500">Votre assistant personnel pour des conseils</p>
      </div>

      <div className="flex items-center gap-2 w-36 justify-end">
        {voiceEnabled && speechSupported && (
          <span className={clsx("inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border", isListening ? "border-green-300 text-green-700 bg-green-50" : "border-gray-200 text-gray-600 bg-white")}>
            <Mic className="w-3 h-3" /> {isListening ? "Écoute…" : "Vocal"}
          </span>
        )}
        {voiceEnabled && isSpeaking && (
          <button onClick={onCancelSpeak} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100">
            <VolumeX className="w-3 h-3" /> Stop
          </button>
        )}
      </div>
    </header>
  );

// ---------- BULLE AVEC MARKDOWN ----------
type BubbleProps = { message: ChatMessage; onSpeak?: (text: string) => void; canSpeak?: boolean };

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={copyToClipboard}
      className="absolute top-2 right-2 p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
      title="Copier le code"
    >
      {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};

type CodeProps = {
  className?: string;
  children?: React.ReactNode;
};

// Composant pour rendre le Markdown
const MarkdownContent: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children }: CodeProps) {
          const inline = !(children as string)?.includes('\n');
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <span className="relative block my-2">
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="!rounded-lg !shadow-lg"
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  background: 'rgba(0,0,0,0.8)',
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
              <CopyButton text={String(children)} />
            </span>
          ) : (
            <code
              className={clsx(
                "px-1 py-0.5 rounded text-xs font-mono relative",
                isUser ? "bg-violet-700 text-violet-100" : "bg-gray-200 text-gray-800"
              )}
            >
              {children}
            </code>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-sm leading-relaxed mb-3 last:mb-0 text-gray-800 dark:text-gray-500" style={{ color: 'var(--tw-text-gray-800)' }}>{children}</p>
        ),
        ul: ({ children }) => (
          <ul className={`list-disc list-inside mb-3 space-y-2 ml-4 ${isUser ? 'text-gray-100' : 'text-gray-700 dark:text-gray-500'} [&>li]:marker:text-purple-500 [&>li]:marker:font-semibold`}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className={`list-decimal list-inside mb-3 space-y-2 ml-4 ${isUser ? 'text-gray-200' : 'text-black dark:text-gray-500'} [&>li]:marker:text-violet-600 [&>li]:marker:font-semibold`}>{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-relaxed">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-violet-400 pl-4 pr-4 py-2 my-2 bg-violet-50 rounded-r-lg italic">
            {children}
          </blockquote>
        ),
        hr: () => (
          <hr className="border-gray-300 my-4" />
        ),
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        link: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              "underline hover:no-underline transition-colors",
              isUser ? "text-violet-200 hover:text-violet-100" : "text-violet-600 hover:text-violet-800"
            )}
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-3 rounded-lg border border-gray-300">
            <table className="w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-100">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-gray-200">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-gray-50">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-semibold border-r border-gray-200 last:border-r-0">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 border-r border-gray-200 last:border-r-0">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const ChatMessageBubble = React.memo<BubbleProps>(({ message, onSpeak, canSpeak }) => {
  const isUser = message.role === "user";

  const timeLabel = useMemo(() => {
    if (!message.createdAt) return null;
    try {
      const d = new Date(message.createdAt);
      return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return null;
    }
  }, [message.createdAt]);

  return (
    <div className={clsx("flex items-start gap-3 group", isUser && "justify-end")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-sm relative">
          <Bot size={18} className="text-white" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 opacity-50 animate-pulse" />
        </div>
      )}

      <div className="flex flex-col">
        <div
          className={clsx(
            "relative max-w-xl md:max-w-2xl leading-relaxed rounded-2xl px-4 py-3 shadow-lg transition-all duration-200 group-hover:shadow-xl",
            isUser
              ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-br-lg before:absolute before:-right-2 before:bottom-0 before:border-[8px] before:border-transparent before:border-b-violet-600 before:border-r-3"
              : "bg-gradient-to-br from-white to-gray-50 text-gray-800 rounded-bl-lg border border-gray-200 before:absolute before:-left-2 before:bottom-0 before:border-[8px] before:border-transparent before:border-b-white before:border-l-3"
          )}
        >
          {/* Background pattern overlay */}
          <div className={clsx(
            "absolute inset-0 rounded-2xl opacity-5",
            isUser
              ? "bg-gradient-to-br from-white to-transparent"
              : "bg-gradient-to-br from-violet-500 to-transparent"
          )} />

          {/* Content with relative positioning */}
          <div className="relative z-10">
            {!isUser && (
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-violet-500 animate-pulse" />
                <span className="text-xs font-medium text-violet-600">Coach IA</span>
              </div>
            )}

            <div className={clsx("prose", "prose-sm max-w-none", isUser ? "prose-invert" : "")}>
              <MarkdownContent content={message.text} isUser={isUser} />
            </div>

            {/* Sparkle effect for bot messages */}
            {!isUser && (
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-ping" />
            )}
          </div>
        </div>

        {/* Timestamp and speak button */}
        <div className={clsx("flex items-center gap-2 mt-1 px-2", isUser && "justify-end")}>
          {timeLabel && (
            <div className={clsx("text-[10px]", isUser ? "text-violet-300" : "text-gray-400")}>
              {timeLabel}
            </div>
          )}

          {!isUser && canSpeak && onSpeak && (
            <button
              onClick={() => onSpeak(message.text)}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors shadow-sm"
              aria-label="Lire ce message"
              title="Lire ce message"
            >
              <Volume2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center flex-shrink-0 shadow-sm relative">
          <User size={18} className="text-gray-700" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-200 to-violet-400 opacity-30" />
        </div>
      )}
    </div>
  );
});
ChatMessageBubble.displayName = "ChatMessageBubble";

// ---------- MESSAGE LIST ----------
const ChatMessages: React.FC<{
  messages: ChatMessage[];
  isLoading: boolean;
  initialGreeting?: boolean;
  sendMessage: (text: string) => void;
}> = ({ messages, isLoading, initialGreeting, sendMessage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    endRef.current?.scrollIntoView({ behavior });
  }, []);

  useLayoutEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isLoading, scrollToBottom]);

  return (
    <section ref={containerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
      {initialGreeting && (
        <ChatBubble
          message="Bonjour ! Je suis votre coach de carrière IA. Comment puis-je vous aider à améliorer votre CV ou à vous préparer pour un entretien aujourd'hui ?"
          type="assistant"
          timestamp={new Date()}
          onCopy={() => console.log('Message copié')}
          onLike={() => console.log('Message aimé')}
          onDislike={() => console.log('Message non aimé')}
          onListItemClick={(itemId: string, itemText: string) => {
            // Envoyer automatiquement la question détaillée
            const detailQuestion = `Peux-tu me donner plus de détails sur : ${itemText}`;
            sendMessage(detailQuestion);
          }}
        />
      )}

      {messages.map((msg, idx) => (
        <ChatBubble
          key={msg.id ?? `${msg.role}-${idx}`}
          message={msg.text}
          type={msg.role === "user" ? "user" : "assistant"}
          timestamp={msg.createdAt ? new Date(msg.createdAt) : new Date()}
          userName={msg.role === "user" ? "Vous" : undefined}
          onCopy={() => console.log('Message copié')}
          onLike={() => console.log('Message aimé')}
          onDislike={() => console.log('Message non aimé')}
          onListItemClick={(itemId: string, itemText: string) => {
            // Envoyer automatiquement une question de suivi
            const followUpQuestion = `Peux-tu me donner plus de détails sur : ${itemText}`;
            sendMessage(followUpQuestion);
          }}
        />
      ))}

      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0" aria-hidden>
            <Bot size={18} className="text-white" />
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white text-gray-800 rounded-bl-lg border">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
              <span className="text-sm text-gray-500">Réflexion…</span>
            </div>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </section>
  );
};

// ---------- COMPOSER ----------
const DRAFT_KEY = "chat_draft_input_v1";

export type ChatComposerHandle = {
  setDraft: (text: string) => void;
  focus: () => void;
};

const ChatComposer = React.memo(
  React.forwardRef<ChatComposerHandle, {
    onSend: (text: string) => void;
    disabled?: boolean;
  }>(({ onSend, disabled }, ref) => {
    const [input, setInput] = useState<string>(() => localStorage.getItem(DRAFT_KEY) ?? "");

    useEffect(() => {
      localStorage.setItem(DRAFT_KEY, input);
    }, [input]);

    const send = useCallback(() => {
      const val = input.trim();
      if (!val) return;
      onSend(val);
      setInput("");
      localStorage.removeItem(DRAFT_KEY);
    }, [input, onSend]);

    useImperativeHandle(ref, () => ({
      setDraft: (text: string) => setInput(text),
      focus: () => { }
    }), []);

    return (
      <footer className="p-4 border-t border-violet-100 bg-white/70 backdrop-blur-sm">
        <form
          onSubmit={(e) => { e.preventDefault(); if (!disabled) send(); }}
          className="flex items-end gap-3"
        >
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!disabled && input.trim()) {
                    send();
                  }
                }
              }}
              placeholder="Posez une question sur votre CV… (Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne)"
              className="w-full px-4 py-3 pr-24 border border-gray-200 rounded-xl hover:border-violet-400 focus:outline-2 focus:outline-violet-500 resize-none"
              rows={1}
              maxLength={4000}
              disabled={disabled}
            />
            <button
              type="submit"
              disabled={disabled || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-lg"
            >
              <Send size={18} />
              <VisuallyHidden>Envoyer</VisuallyHidden>
            </button>
          </div>
        </form>
      </footer>
    );
  })
);
ChatComposer.displayName = "ChatComposer";

// ---------- ERREUR ----------
const ErrorBanner: React.FC<{ error?: string | null }> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="p-3 text-sm text-red-700 bg-red-50 border-t border-red-100 flex items-center gap-2">
      <AlertCircle className="w-4 h-4" />
      <span>{error}</span>
    </div>
  );
};

// ---------- CHAT PRINCIPAL ----------
export const AIChat: React.FC<ChatProps> = ({ onBack, voiceEnabled = true }) => {
  const { editCVField, isLoading, error } = useOpenAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = { role: "user", text, createdAt: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await editCVField({ prompt: text });
      if (response) {
        const botMsg: ChatMessage = { role: "model", text: response, createdAt: new Date() };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (e) {
      console.error(e);
    }
  }, [editCVField]);

  return (
    <div className="flex flex-col h-full w-full bg-white/50 rounded-2xl border border-violet-200 shadow-lg overflow-hidden">
      <ChatHeader
        onBack={onBack}
        speechSupported={false}
        isListening={false}
        voiceEnabled={!!voiceEnabled}
        isSpeaking={false}
        onCancelSpeak={() => { }}
      />

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        initialGreeting={true}
        sendMessage={sendMessage}
      />

      {error && <ErrorBanner error={error} />}

      <ChatComposer
        onSend={sendMessage}
        disabled={isLoading}
      />
    </div>
  );
};
