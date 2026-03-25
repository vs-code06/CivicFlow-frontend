import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react';
import { sendChatMessageStream } from '../../api/chat';
import { cn } from '../../lib/utils';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello! I am your CivicFlow Assistant. How can I help you today?', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleReset = () => {
        setMessages([
            { id: Date.now().toString(), text: 'Hello! I am your CivicFlow Assistant. How can I help you today?', sender: 'bot' }
        ]);
        setInputValue('');
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        let botMsgId = "";

        try {
            await sendChatMessageStream(userMsg.text, (chunk: string) => {
                setIsLoading(false); // Hide the global spinner once we get data
                
                if (!botMsgId) {
                    botMsgId = (Date.now() + 1).toString();
                    const initialBotMsg: Message = { id: botMsgId, text: chunk, sender: 'bot' };
                    setMessages(prev => [...prev, initialBotMsg]);
                } else {
                    setMessages(prev => 
                        prev.map(msg => 
                            msg.id === botMsgId 
                                ? { ...msg, text: msg.text + chunk }
                                : msg
                        )
                    );
                }
            });
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to the server.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed z-[100] flex flex-col overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]
                                   bottom-0 right-0 w-full h-[85vh] rounded-t-3xl    /* Mobile */
                                   sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[60vh] sm:max-h-[550px] sm:rounded-3xl /* Desktop */"
                    >
                        {/* CivicFlow Brand Header */}
                        <div className="bg-civic-dark p-5 flex items-center justify-between text-white shrink-0 relative overflow-hidden">
                            {/* Decorative green glow */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-civic-green-500/20 rounded-full blur-2xl"></div>
                            
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-civic-green-500 flex items-center justify-center border border-civic-green-600 shadow-inner">
                                    <Bot size={22} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-base tracking-tight flex items-center gap-1.5">
                                        CivicFlow AI 
                                        <Sparkles size={14} className="text-civic-green-100" />
                                    </span>
                                    <span className="text-xs text-civic-green-100/70 font-medium">Official Assistant</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 relative z-10">
                                <button 
                                    onClick={handleReset}
                                    title="New Chat"
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                                >
                                    <RotateCcw size={16} />
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    title="Close"
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-950/50 dark:to-gray-900/50">
                            {messages.map((msg) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id} 
                                    className={cn(
                                        "flex gap-3 max-w-[88%]",
                                        msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    {/* Avatar */}
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1",
                                        msg.sender === 'user' 
                                            ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300" 
                                            : "bg-civic-green-500 text-white"
                                    )}>
                                        {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>

                                    {/* Bubble */}
                                    <div className={cn(
                                        "p-4 text-[15px] leading-relaxed shadow-sm",
                                        msg.sender === 'user' 
                                            ? "bg-civic-dark text-white rounded-2xl rounded-tr-sm" 
                                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm whitespace-pre-wrap"
                                    )}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Loading Indicator */}
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 max-w-[85%]"
                                >
                                    <div className="w-8 h-8 rounded-full bg-civic-green-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                                        <Bot size={14} />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[52px]">
                                        <div className="w-2 h-2 bg-civic-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-civic-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-civic-green-500 rounded-full animate-bounce"></div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} className="h-2" />
                        </div>

                        {/* Glassmorphic Input Area */}
                        <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 shrink-0">
                            <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Message CivicFlow AI..."
                                    className="flex-1 bg-transparent text-gray-800 dark:text-white px-4 py-2.5 text-[15px] focus:outline-none placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isLoading}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                                        inputValue.trim() && !isLoading
                                            ? "bg-civic-green-500 text-white shadow-md hover:shadow-lg hover:scale-105"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <Send size={18} className="translate-x-[1px] translate-y-[1px]" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-[110] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group overflow-hidden bg-civic-green-500"
                    style={{
                        boxShadow: '0 8px 32px rgba(46, 204, 113, 0.4)'
                    }}
                >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    <div className="relative z-10 text-white">
                        <Bot size={28} />
                    </div>
                </motion.button>
            )}
        </>
    );
}
