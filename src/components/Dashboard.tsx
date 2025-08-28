// src/components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, CheckCircle, XCircle, Search } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

// Define the types for your data to ensure type safety.
// These types should match the models you defined in prisma/schema.prisma.
interface Chat {
  id: string;
  customerName: string;
  lastMessageText: string;
  lastMessageTime: string; // Use string for the time from the database
  status: 'bot' | 'staff' | 'resolved';
  assignedTo: string | null;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user' | 'staff';
  timestamp: string;
  chatId: string;
}

const Dashboard = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [parent] = useAutoAnimate();

  // useEffect hook to fetch all chats when the component loads.
  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch('/api/chats');
        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }
        const data = await response.json();
        setChats(data);
        // Automatically select the first chat if chats are available
        if (data.length > 0) {
          setSelectedChat(data[0]);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    }

    fetchChats();
  }, []);

  // useEffect hook to fetch messages for the selected chat.
  useEffect(() => {
    async function fetchMessages() {
      if (selectedChat) {
        try {
          // Fetch messages from the dynamic API route
          const response = await fetch(`/api/messages/${selectedChat.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch messages');
          }
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }

    fetchMessages();
  }, [selectedChat]); // This effect re-runs whenever selectedChat changes

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    // Here, you would send the message to your API
    const newMessage: Omit<Message, 'id' | 'timestamp'> = {
      text: messageInput,
      sender: 'staff',
      chatId: selectedChat.id,
    };

    // The POST request to your API to save and send the message
    try {
      const response = await fetch(`/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // After successful send, update the UI with the new message
      const sentMessage = await response.json();
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setMessageInput('');

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] space-y-4 lg:space-y-0 lg:space-x-4">
      
      {/* Sidebar: Chat List */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Conversations</h2>
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto" ref={parent}>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
              >
                <div className="relative w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl mr-4">
                  {chat.customerName.charAt(0)}
                  <span
                    className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
                      chat.status === 'staff' ? 'bg-green-500' :
                      chat.status === 'bot' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{chat.customerName}</h3>
                    <span className="text-xs text-gray-500">{new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessageText}</p>
                  {chat.assignedTo && (
                    <span className="text-xs text-blue-600 font-medium">Assigned to: {chat.assignedTo}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No chats available.</div>
          )}
        </div>
      </motion.div>

      {/* Main Chat View */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden"
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl mr-4">
                  {selectedChat.customerName.charAt(0)}
                  <span
                    className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
                      selectedChat.status === 'staff' ? 'bg-green-500' :
                      selectedChat.status === 'bot' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedChat.customerName}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.status === 'bot' ? 'Assisted by Chatbot' : 'Assigned to a staff member'}
                  </p>
                </div>
              </div>
              <div className="space-x-2">
                <button className="p-2 text-gray-500 hover:text-green-600 transition-colors" aria-label="Mark as Resolved">
                  <CheckCircle className="h-6 w-6" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600 transition-colors" aria-label="Mark as Unresolved">
                  <XCircle className="h-6 w-6" />
                </button>
                <a href={`tel:${selectedChat.id}`} className="p-2 text-gray-500 hover:text-blue-600 transition-colors" aria-label="Call Customer">
                  <Phone className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  <div className={`p-4 rounded-xl shadow-sm max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center transition-all duration-200 hover:bg-blue-700"
                  aria-label="Send Message"
                >
                  <Send className="w-6 h-6 -ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            <p>Select a chat to view the conversation.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;