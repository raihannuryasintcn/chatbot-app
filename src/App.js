import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Card, CardContent } from './components/ui/card';
import { Send, Loader2, Settings } from 'lucide-react';
import './index.css';

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Selamat Datang di UMB Schedule Chatbot</h1>
          <p className="text-xl mb-12">Asisten virtual untuk informasi akademik Anda</p>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-gray-800 text-2xl font-semibold mb-6">Apa yang bisa kami bantu?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Informasi Akademik</h3>
                <p className="text-gray-600">Jadwal kuliah, UTS, UAS, dan informasi akademik lainnya</p>
              </div>
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Tugas Akhir & KP</h3>
                <p className="text-gray-600">Informasi seputar skripsi, tugas akhir, dan kerja praktek</p>
              </div>
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Program Magang</h3>
                <p className="text-gray-600">Informasi program magang dan kerja sama industri</p>
              </div>
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Administrasi</h3>
                <p className="text-gray-600">Informasi pembayaran dan registrasi</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/chat')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Mulai Chat
            </button>
          </div>
          
          <div className="mt-12 text-sm opacity-75">
            <p>© 2024 UMB Schedule Chatbot. Semua hak cipta dilindungi.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatBot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [settings, setSettings] = useState({
    lang: 'id',
    mode: 'normal',
    threshold: '0.5'
  });
  const [showSettings, setShowSettings] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!question.trim()) {
      setError('Pertanyaan tidak boleh kosong!');
      return;
    }

    setLoading(true);
    
    // Tambahkan pesan user ke chat history
    setMessages(prev => [...prev, { type: 'user', content: question }]);

    try {
      // Membuat query parameters dari settings
      const queryParams = new URLSearchParams(settings);

      const response = await fetch(
        `http://localhost:8080/chat?${queryParams}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      // Tambahkan informasi tambahan ke pesan bot
      const botResponse = {
        type: 'bot',
        content: data.response,
        metadata: {
          similarity: data.similarity_score,
          processed_question: data.processed_question,
          status: data.status
        }
      };
      
      setMessages(prev => [...prev, botResponse]);
      setQuestion('');
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/')}
          className="text-green-600 hover:text-green-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Kembali
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-green-600 hover:text-green-700 flex items-center"
        >
          <Settings className="h-5 w-5 mr-1" />
          Pengaturan
        </button>
      </div>

      {showSettings && (
        <Card className="mb-4 p-4">
          <h3 className="font-semibold mb-3">Pengaturan Chatbot</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bahasa</label>
              <select
                name="lang"
                value={settings.lang}
                onChange={handleSettingsChange}
                className="w-full p-2 border rounded"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mode</label>
              <select
                name="mode"
                value={settings.mode}
                onChange={handleSettingsChange}
                className="w-full p-2 border rounded"
              >
                <option value="normal">Normal</option>
                <option value="raw">Raw</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Threshold</label>
              <input
                type="number"
                name="threshold"
                value={settings.threshold}
                onChange={handleSettingsChange}
                min="0"
                max="1"
                step="0.1"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </Card>
      )}

      <Card className="flex-1 mb-4 overflow-hidden flex flex-col">
        <div className="bg-green-600 p-4 text-white">
          <h1 className="text-2xl font-bold">UMB Schedule ChatBot</h1>
          <p className="text-sm">Tanyakan jadwal skripsi, kuliah, atau kerja praktek!</p>
        </div>
        
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                  {msg.type === 'bot' && msg.metadata && (
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Similarity: {(msg.metadata.similarity * 100).toFixed(1)}%</p>
                      {settings.mode === 'raw' && (
                        <p>Processed: {msg.metadata.processed_question}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ketik pertanyaan Anda..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatBot />} />
      </Routes>
    </Router>
  );
};

export default App;