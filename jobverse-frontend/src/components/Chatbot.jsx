import { useState, useRef, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Merhaba! 👋 Ben Jobverse AI asistanıyım. İş arama, CV hazırlama, mülakat teknikleri veya kariyer planlaması hakkında sorularınızı yanıtlayabilirim. Size nasıl yardımcı olabilirim?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuery = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userQuery }),
      });

      const data = await response.json();

      // Rate limit kontrolü
      const isRateLimited = data.data?.isRateLimited;

      const botMessage = {
        id: messages.length + 2,
        text: data.success ? data.data.response : 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
        sender: 'bot',
        timestamp: new Date(),
        isRateLimited: isRateLimited,
        originalQuery: isRateLimited ? userQuery : null,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Rate limit sonrası tekrar deneme
  const handleRetry = async (originalQuery) => {
    setInputValue(originalQuery);
    // Otomatik gönder
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: originalQuery }),
      });

      const data = await response.json();

      const botMessage = {
        id: messages.length + 1,
        text: data.success ? data.data.response : 'Üzgünüm, şu anda yanıt veremiyorum.',
        sender: 'bot',
        timestamp: new Date(),
        isRateLimited: data.data?.isRateLimited,
        originalQuery: data.data?.isRateLimited ? originalQuery : null,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Retry error:', error);
    } finally {
      setIsLoading(false);
      setInputValue('');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const quickQuestions = [
    'CV nasıl hazırlanır?',
    'Mülakat ipuçları',
    'Maaş pazarlığı',
  ];

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Chatbot Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#0f172a] to-slate-700 dark:from-sky-600 dark:to-sky-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110 ${isOpen ? 'rotate-180' : ''
          }`}
        aria-label="AI Asistan"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chatbot Penceresi */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f172a] to-slate-700 dark:from-sky-600 dark:to-sky-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Jobverse AI</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Çevrimiçi
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#0f172a] to-slate-700 dark:from-sky-600 dark:to-sky-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  {/* Rate limit durumunda tekrar dene butonu */}
                  {message.isRateLimited && message.originalQuery && (
                    <button
                      onClick={() => handleRetry(message.originalQuery)}
                      disabled={isLoading}
                      className="mt-2 text-xs px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors disabled:opacity-50"
                    >
                      🔄 Tekrar Dene
                    </button>
                  )}
                  <p
                    className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
                      }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Yazıyor animasyonu */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Hızlı Sorular */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Hızlı sorular:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Bir soru sorun..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-sky-500 focus:border-[#0f172a] dark:focus:border-sky-500 text-sm transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0f172a] to-slate-700 dark:from-sky-600 dark:to-sky-700 text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
