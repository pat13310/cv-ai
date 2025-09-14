import React from 'react';
import { User, Bot, Copy, ThumbsUp, ThumbsDown, RefreshCw, ChevronRight } from 'lucide-react';

export interface ListItem {
  id: string;
  text: string;
  hasDetails?: boolean;
}

export interface ChatBubbleProps {
  message: string;
  type: 'user' | 'assistant';
  timestamp?: Date;
  isTyping?: boolean;
  avatar?: string;
  userName?: string;
  listItems?: ListItem[];
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onRegenerate?: () => void;
  onListItemClick?: (itemId: string, itemText: string) => void;
  isLoading?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  type,
  timestamp,
  isTyping = false,
  avatar,
  userName,
  listItems,
  onCopy,
  onLike,
  onDislike,
  onRegenerate,
  onListItemClick,
  isLoading = false
}) => {
  const isUser = type === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    onCopy?.();
  };

  // Fonction pour rendre les listes structurées depuis listItems
  const renderStructuredLists = () => {
    if (!listItems || listItems.length === 0) {
      return null;
    }

    return listItems.map((item) => (
      <div key={item.id} className="mb-2">
        <button
          onClick={() => onListItemClick?.(item.id, item.text)}
          className={`
            w-full text-left p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]
            ${isUser
              ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
              : 'bg-violet-50 hover:bg-violet-100 text-gray-800 border border-violet-200/50 hover:shadow-md'
            }
            ${onListItemClick && item.hasDetails !== false ? 'cursor-pointer' : 'cursor-default'}
          `}
          disabled={!onListItemClick || item.hasDetails === false}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-start space-x-2">
                <span className={`text-xs mt-1 ${isUser ? 'text-white/80' : 'text-violet-600'}`}>•</span>
                <div className="flex-1">
                  <span>{item.text}</span>
                </div>
              </div>
            </div>
            {onListItemClick && item.hasDetails !== false && (
              <ChevronRight className={`w-4 h-4 opacity-60 ${isUser ? 'text-white' : 'text-violet-600'}`} />
            )}
          </div>
        </button>
      </div>
    ));
  };

  // Fonction pour détecter et parser automatiquement les listes dans le message
  const parseMessageWithLists = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentText = '';

    lines.forEach((line, index) => {
      // Détecter les listes avec • ou - ou *
      const listMatch = line.match(/^[\s]*[•\-*]\s*\*\*(.*?)\*\*\s*[:：]\s*(.*)|^[\s]*[•\-*]\s*(.*)/);

      if (listMatch) {
        // Si on a du texte accumulé, l'ajouter d'abord
        if (currentText.trim()) {
          elements.push(
            <div key={`text-${index}`} className="whitespace-pre-wrap text-sm leading-relaxed mb-2">
              {currentText.trim()}
            </div>
          );
          currentText = '';
        }

        // Ajouter l'élément de liste cliquable
        const title = listMatch[1] || listMatch[3];
        const description = listMatch[2] || '';
        const fullText = title + (description ? ` : ${description}` : '');

        elements.push(
          <div key={`list-${index}`} className="mb-2">
            <button
              onClick={() => onListItemClick?.(
                `list-${index}`,
                `Donne-moi plus de détails sur : ${title}`
              )}
              className={`
                w-full text-left p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]
                ${isUser
                  ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                  : 'bg-violet-50 hover:bg-violet-100 text-gray-800 border border-violet-200/50 hover:shadow-md'
                }
                ${onListItemClick ? 'cursor-pointer' : 'cursor-default'}
              `}
              disabled={!onListItemClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-2">
                    <span className={`text-xs mt-1 ${isUser ? 'text-white/80' : 'text-violet-600'}`}>•</span>
                    <div className="flex-1">
                      {listMatch[1] ? (
                        <>
                          <span className="font-semibold">{title}</span>
                          {description && <span className="ml-1">: {description}</span>}
                        </>
                      ) : (
                        <span>{fullText}</span>
                      )}
                    </div>
                  </div>
                </div>
                {onListItemClick && (
                  <ChevronRight className={`w-4 h-4 opacity-60 ${isUser ? 'text-white' : 'text-violet-600'}`} />
                )}
              </div>
            </button>
          </div>
        );
      } else {
        // Ajouter la ligne au texte courant
        currentText += line + '\n';
      }
    });

    // Ajouter le texte restant s'il y en a
    if (currentText.trim()) {
      elements.push(
        <div key="final-text" className="whitespace-pre-wrap text-sm leading-relaxed">
          {currentText.trim()}
        </div>
      );
    }

    return elements.length > 0 ? elements : [
      <div key="fallback" className="whitespace-pre-wrap text-sm leading-relaxed">
        {text}
      </div>
    ];
  };

  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-3 duration-300`}>
      {/* Avatar côté gauche pour l'assistant */}
      {!isUser && (
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt="Assistant"
              className="w-10 h-10 rounded-full border-2 border-violet-200 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      )}

      {/* Contenu principal */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%] md:max-w-[70%]`}>
        {/* Nom utilisateur/assistant et timestamp */}
        <div className={`flex items-center gap-2 mb-1 text-xs text-gray-500 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium">
            {isUser ? userName || 'Vous' : 'Assistant IA'}
          </span>
          {timestamp && (
            <span className="opacity-75">
              {formatTime(timestamp)}
            </span>
          )}
        </div>

        {/* Bulle de message */}
        <div className={`
          relative px-4 py-3 rounded-2xl shadow-md backdrop-blur-sm border
          ${isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-400 text-white border-blue-300/30'
            : 'bg-white/90 text-gray-800 border-gray-200/50'
          }
          ${isLoading ? 'animate-pulse' : ''}
          hover:shadow-lg transition-all duration-200
        `}>


          {/* Animation de frappe */}
          {isTyping && (
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="ml-2 text-sm text-violet-600">L'assistant écrit...</span>
            </div>
          )}

          {/* Contenu du message */}
          {!isTyping && (
            <div className="relative z-10">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin " />
                  <span className="text-sm">Génération en cours...</span>
                </div>
              ) : (
                <div>
                  {/* Utiliser listItems si fournie, sinon parser le message */}
                  {listItems && listItems.length > 0 ? (
                    <>
                      {message && (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed mb-3">
                          {message}
                        </div>
                      )}
                      {renderStructuredLists()}
                    </>
                  ) : (
                    parseMessageWithLists(message)
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions (uniquement pour l'assistant) */}
        {!isUser && !isTyping && !isLoading && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onCopy && (
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
                title="Copier le message"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            {onLike && (
              <button
                onClick={onLike}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600 transition-all duration-200 hover:scale-105"
                title="Message utile"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
            )}

            {onDislike && (
              <button
                onClick={onDislike}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-200 hover:scale-105"
                title="Message non utile"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            )}

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                title="Régénérer la réponse"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Avatar côté droit pour l'utilisateur */}
      {isUser && (
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={userName || 'Utilisateur'}
              className="w-10 h-10 rounded-full border-2 border-violet-200 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Composant de groupe de bulles pour afficher une conversation
export interface ChatBubbleGroupProps {
  messages: Array<{
    id: string;
    message: string;
    type: 'user' | 'assistant';
    timestamp: Date;
    avatar?: string;
    userName?: string;
  }>;
  isTyping?: boolean;
  onMessageCopy?: (messageId: string) => void;
  onMessageLike?: (messageId: string) => void;
  onMessageDislike?: (messageId: string) => void;
  onMessageRegenerate?: (messageId: string) => void;
}

export const ChatBubbleGroup: React.FC<ChatBubbleGroupProps> = ({
  messages,
  isTyping = false,
  onMessageCopy,
  onMessageLike,
  onMessageDislike,
  onMessageRegenerate
}) => {
  return (
    <div className="space-y-4 px-4 py-6">
      {messages.map((msg) => (
        <ChatBubble
          key={msg.id}
          message={msg.message}
          type={msg.type}
          timestamp={msg.timestamp}
          avatar={msg.avatar}
          userName={msg.userName}
          onCopy={() => onMessageCopy?.(msg.id)}
          onLike={() => onMessageLike?.(msg.id)}
          onDislike={() => onMessageDislike?.(msg.id)}
          onRegenerate={() => onMessageRegenerate?.(msg.id)}
        />
      ))}

      {/* Bulle d'animation de frappe */}
      {isTyping && (
        <ChatBubble
          message=""
          type="assistant"
          isTyping={true}
          timestamp={new Date()}
        />
      )}
    </div>
  );
};
