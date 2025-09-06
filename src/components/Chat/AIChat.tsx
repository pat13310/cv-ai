import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX, ArrowLeft, Settings } from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface AIChatProps {
  onBack: () => void;
  voiceEnabled: boolean;
  onSettingsClick: () => void;
  fromCoaching?: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ onBack, voiceEnabled, onSettingsClick, fromCoaching = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: fromCoaching 
        ? "Bonjour ! Je suis votre coach IA spécialisé en développement de carrière. Je suis là pour vous aider avec vos questions sur l'emploi, la recherche de poste, les entretiens, et l'évolution professionnelle. Comment puis-je vous accompagner aujourd'hui ?"
        : "Bonjour ! Je suis votre assistant IA pour optimiser votre CV. Comment puis-je vous aider aujourd'hui ? Vous pouvez me parler ou m'écrire.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && voiceEnabled) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Check for speech synthesis support
    if ('speechSynthesis' in window && voiceEnabled) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [voiceEnabled]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: 'bot' | 'user', isVoice = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isVoice
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const speakMessage = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const simulateTyping = async (content: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);
    addMessage(content, 'bot');
    
    // Speak the response if voice is enabled
    if (voiceEnabled) {
      setTimeout(() => speakMessage(content), 500);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const cvResponses = {
      greeting: [
        "Bonjour ! Je suis ravi de vous aider avec votre CV. Que souhaitez-vous améliorer ?",
        "Salut ! Comment puis-je optimiser votre CV aujourd'hui ?",
        "Hello ! Prêt à booster votre CV avec l'IA ?"
      ],
      keywords: [
        "Pour optimiser vos mots-clés, analysez les offres d'emploi de votre secteur et intégrez les termes techniques récurrents. Voulez-vous que je vous aide à identifier les mots-clés pour votre domaine ?",
        "Les mots-clés sont cruciaux pour passer les filtres ATS. Je peux analyser votre secteur et vous suggérer les termes les plus recherchés par les recruteurs."
      ],
      structure: [
        "Une bonne structure de CV commence par vos coordonnées, suivi d'un résumé professionnel, puis vos expériences en ordre chronologique inverse. Souhaitez-vous que je vous guide étape par étape ?",
        "La structure idéale dépend de votre profil. Pour un profil senior comme le vôtre, je recommande de mettre l'accent sur vos réalisations quantifiées."
      ],
      experience: [
        "Pour valoriser votre expérience, utilisez la méthode STAR : Situation, Tâche, Action, Résultat. Chaque bullet point devrait inclure des métriques concrètes.",
        "Transformez vos responsabilités en réalisations ! Au lieu de 'Gestion d'équipe', écrivez 'Management d'une équipe de 8 développeurs, augmentation de la productivité de 25%'."
      ],
      default: [
        "C'est une excellente question ! Pouvez-vous me donner plus de détails pour que je puisse vous aider de manière plus précise ?",
        "Je suis là pour vous aider à optimiser votre CV. Voulez-vous qu'on se concentre sur un aspect particulier : mots-clés, structure, ou contenu ?",
        "Intéressant ! Pour vous donner les meilleurs conseils, pouvez-vous me parler de votre secteur d'activité et du type de poste que vous visez ?"
      ]
    };
    
    const coachingResponses = {
      greeting: [
        "Bonjour ! Je suis votre coach carrière IA. Parlons de vos objectifs professionnels !",
        "Salut ! Prêt à booster votre carrière ? Comment puis-je vous aider ?",
        "Hello ! Votre coach IA est là pour vous accompagner dans votre évolution professionnelle !"
      ],
      jobSearch: [
        "Pour optimiser votre recherche d'emploi, concentrez-vous sur 3 axes : ciblage des offres, personnalisation des candidatures, et networking. Sur quel aspect souhaitez-vous que je vous aide ?",
        "La recherche d'emploi efficace nécessite une stratégie claire. Avez-vous défini votre profil cible et les entreprises qui vous intéressent ?"
      ],
      interview: [
        "Pour réussir vos entretiens, préparez des exemples concrets avec la méthode STAR (Situation, Tâche, Action, Résultat). Voulez-vous qu'on travaille sur des questions spécifiques ?",
        "L'entretien se prépare ! Avez-vous des questions particulières qui vous préoccupent ou un type d'entretien spécifique à préparer ?"
      ],
      career: [
        "L'évolution de carrière se planifie ! Quels sont vos objectifs à court et moyen terme ? Souhaitez-vous changer de poste, de secteur, ou développer de nouvelles compétences ?",
        "Pour faire évoluer votre carrière, identifions ensemble vos forces, vos axes d'amélioration et les opportunités de votre marché. Par quoi commençons-nous ?"
      ],
      salary: [
        "La négociation salariale se prépare avec des données de marché et une argumentation solide. Connaissez-vous les fourchettes de salaire pour votre poste et votre secteur ?",
        "Pour négocier efficacement, il faut connaître sa valeur sur le marché. Voulez-vous qu'on travaille sur votre argumentaire de négociation ?"
      ],
      default: [
        "C'est une excellente question de développement professionnel ! Pouvez-vous me donner plus de contexte sur votre situation actuelle ?",
        "Je suis là pour vous accompagner dans tous les aspects de votre carrière. Voulez-vous qu'on se concentre sur la recherche d'emploi, les entretiens, ou l'évolution professionnelle ?",
        "Intéressant ! Pour vous donner les meilleurs conseils carrière, parlez-moi de votre situation professionnelle actuelle et de vos objectifs."
      ]
    };

    const message = userMessage.toLowerCase();
    const responses = fromCoaching ? coachingResponses : cvResponses;
    
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (fromCoaching && (message.includes('emploi') || message.includes('job') || message.includes('recherche'))) {
      return responses.jobSearch[Math.floor(Math.random() * responses.jobSearch.length)];
    } else if (fromCoaching && (message.includes('entretien') || message.includes('interview'))) {
      return responses.interview[Math.floor(Math.random() * responses.interview.length)];
    } else if (fromCoaching && (message.includes('carrière') || message.includes('évolution') || message.includes('career'))) {
      return responses.career[Math.floor(Math.random() * responses.career.length)];
    } else if (fromCoaching && (message.includes('salaire') || message.includes('négociation') || message.includes('salary'))) {
      return responses.salary[Math.floor(Math.random() * responses.salary.length)];
    } else if (!fromCoaching && (message.includes('mot') && message.includes('clé') || message.includes('keyword'))) {
      return responses.keywords[Math.floor(Math.random() * responses.keywords.length)];
    } else if (!fromCoaching && (message.includes('structure') || message.includes('format') || message.includes('organis'))) {
      return responses.structure[Math.floor(Math.random() * responses.structure.length)];
    } else if (!fromCoaching && (message.includes('expérience') || message.includes('réalisation') || message.includes('compétence'))) {
      return responses.experience[Math.floor(Math.random() * responses.experience.length)];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, 'user');
    setInputValue('');

    // Generate AI response
    const aiResponse = generateAIResponse(userMessage);
    await simulateTyping(aiResponse);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    if (recognitionRef.current && speechSupported && voiceEnabled) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleSpeaking = () => {
    if (synthRef.current) {
      if (isSpeaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-rose-400 to-purple-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Chat IA CV</h3>
              <p className="text-xs text-white/80">Assistant intelligent</p>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold">Coach IA Carrière</h3>
              <p className="text-xs text-white/80">Spécialiste emploi</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {voiceEnabled && (
              <>
                {speechSupported && (
                  <div className="flex items-center space-x-1 text-xs">
                    <Mic className="w-3 h-3" />
                    <span>Vocal activé</span>
                  </div>
                )}
                {isSpeaking && (
                  <button
                    onClick={toggleSpeaking}
                    className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <VolumeX className="w-3 h-3" />
                  </button>
                )}
              </>
            )}
            <button
              onClick={onSettingsClick}
              className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Settings className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'bot'
                ? 'bg-gradient-to-br from-violet-500 to-pink-500'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            }`}>
              {message.type === 'bot' ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative ${
              message.type === 'bot'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white'
            }`}>
              {message.isVoice && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Mic className="w-2 h-2 text-white" />
                </div>
              )}
              
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.type === 'bot' ? 'text-gray-500' : 'text-white/70'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              {message.type === 'bot' && voiceEnabled && (
                <button
                  onClick={() => speakMessage(message.content)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors"
                >
                  <Volume2 className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200/30">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Parlez maintenant..." : "Tapez votre message ou utilisez le micro..."}
              className={`w-full px-4 py-3 pr-20 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 ${
                isListening ? 'bg-green-50 border-green-300' : ''
              }`}
              disabled={isTyping || isListening}
            />
            
            {voiceEnabled && speechSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isTyping}
                className={`absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping || isListening}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-lg hover:from-violet-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Appuyez sur Entrée pour envoyer</span>
            {voiceEnabled && speechSupported && (
              <span className="flex items-center space-x-1 text-green-600">
                <Mic className="w-3 h-3" />
                <span>Reconnaissance vocale active</span>
              </span>
            )}
          </div>
          
          {isSpeaking && (
            <div className="flex items-center space-x-1 text-violet-600">
              <Volume2 className="w-3 h-3 animate-pulse" />
              <span>IA en train de parler...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};