import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from './components/ui/card';
import { Send, Loader2 } from 'lucide-react';
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


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const response = await fetch('https://chatbot-backend-production-783e.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
      setQuestion('');
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">

      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate('/')}
          className="text-green-600 hover:text-green-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Kembali
        </button>
      </div>

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

// App Component dengan Routing
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