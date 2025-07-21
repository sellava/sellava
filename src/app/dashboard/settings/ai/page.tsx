'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Settings, 
  ArrowLeft, 
  Save, 
  Sparkles,
  Zap,
  MessageSquare,
  Image,
  Code,
  CheckCircle,
  AlertCircle,
  X,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AISettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    enableAI: false,
    autoDescription: false,
    autoTags: false,
    autoPricing: false,
    aiModel: 'gpt-3.5-turbo',
    customPrompt: '',
    maxTokens: 500,
    temperature: 0.7,
  });

  // state for chat with AI
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // check user
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    
    // check plan type (excluding test user)
    if (user.planType === 'free' && user.email !== 'test@example.com') {
      toast.error('This feature is only available for paid plan subscribers');
      router.push('/dashboard');
      return;
    }

    // load saved settings
    loadSettings();
  }, [user, authLoading, router]);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('ai_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        console.log('AI settings loaded:', parsedSettings);
      } else {
        console.log('No saved AI settings found, using defaults');
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      
      // save settings to localStorage
      localStorage.setItem('ai_settings', JSON.stringify(settings));
      
      // mock saving to Firebase (for regular users)
      if (user?.email !== 'test@example.com') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast.success('Settings saved successfully');
      console.log('AI settings saved:', settings);
    } catch (error) {
      console.error('Error saving AI settings:', error);
      toast.error('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const testAI = async () => {
    try {
      setLoading(true);
      
      console.log('Testing AI with settings:', settings);
      
      // mock AI test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('AI test completed successfully!');
      console.log('AI test completed successfully');
    } catch (error) {
      console.error('AI test error:', error);
      toast.error('Error in AI test');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    try {
      setChatLoading(true);
      
      // add user message
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: chatInput,
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      const currentInput = chatInput;
      setChatInput('');

      console.log('Sending chat message:', currentInput);

      // mock AI response
      await new Promise(resolve => setTimeout(resolve, 1500));

      // generate AI response
      const aiResponse = generateAIResponse(currentInput, settings);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, aiMessage]);
      console.log('AI response generated:', aiResponse);
    } catch (error) {
      console.error('Error sending chat message:', error);
      toast.error('Error sending message');
    } finally {
      setChatLoading(false);
    }
  };

  const generateAIResponse = (message: string, aiSettings: any): string => {
    const lowerMessage = message.toLowerCase();
    
    // AI responses based on message type
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I am your AI assistant. How can I help you today?';
    }
    
    if (lowerMessage.includes('how') && lowerMessage.includes('use')) {
      return 'You can use AI to create product descriptions, price suggestions, generate tags, and more. Just go to the product addition page and you will find AI buttons next to each field.';
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'The paid plan costs $15 monthly and includes all advanced AI features. The free plan has limited features.';
    }
    
    if (lowerMessage.includes('feature') || lowerMessage.includes('features')) {
      return 'Available features include:\n\n• Product description generation\n• Price suggestion\n• Tag generation\n• Interactive chat\n• Customizable settings\n• AI test';
    }
    
    if (lowerMessage.includes('problem') || lowerMessage.includes('error')) {
      return 'If you encounter any problems:\n\n1. Check if AI is enabled in settings\n2. Check internet connection\n3. Try refreshing the page\n4. Make sure you are in the paid plan or test mode';
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('great')) {
      return "Thank you! I'm happy to be helpful. If you have any other questions, feel free to ask.";
    }
    
    if (lowerMessage.includes('settings') || lowerMessage.includes('settings')) {
      return 'AI settings include:\n\n• Enable/disable features\n• Select AI model\n• Creativity level (Temperature)\n• Maximum words\n• Custom text\n\nYou can customize these settings according to your needs!';
    }
    
    if (lowerMessage.includes('model') || lowerMessage.includes('model')) {
      return 'Available models:\n\n• GPT-3.5 Turbo: Fast and suitable for simple tasks\n• GPT-4: Accurate and suitable for complex tasks\n• GPT-4 Turbo: Balanced between speed and accuracy\n\nChoose the appropriate model for your needs!';
    }
    
    if (lowerMessage.includes('temperature') || lowerMessage.includes('temperature')) {
      return 'Creativity level (Temperature):\n\n• 0.0 - 0.3: Precise and consistent answers\n• 0.4 - 0.7: Balanced answers (recommended)\n• 0.8 - 1.0: Creative and diverse answers\n\nUse low values for precise description and high values for creative content!';
    }
    
    if (lowerMessage.includes('description') || lowerMessage.includes('description')) {
      return 'Generating description:\n\n• Go to the product addition page\n• Write product name\n• Click the "Generate description" button\n• A marketing description will be created automatically\n\nYou can customize the settings for better results!';
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('price')) {
      return 'Price suggestion:\n\n• Go to the product addition page\n• Click the "Suggest price" button\n• A smart price will be suggested based on product type\n• Prices are realistic and compatible with the market\n\nVery useful for determining competitive prices!';
    }
    
    if (lowerMessage.includes('tags') || lowerMessage.includes('tags')) {
      return 'Generating tags:\n\n• Go to the product addition page\n• Click the "Generate" button next to the tags\n• A suitable tag will be created for search\n• Tags are precise and useful for improving SEO\n\nIt helps your product appear in search results!';
    }
    
    // general AI response
    const generalResponses = [
      'I understand your question. I can help you improve your store experience using AI.',
      'This is a great question! AI can help you save time and improve content quality.',
      'Let me help you with that. AI is designed to be easy and effective to use.',
      'I think this can be solved using AI features available in the app.',
      'This is a great field for AI to be very useful. Try the available features!'
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const clearChat = () => {
    setChatMessages([]);
    toast.success('Chat cleared');
  };

  // add automatic welcome message when opening chat
  useEffect(() => {
    if (showChat && chatMessages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'ai' as const,
        content: 'Hello! I am your AI assistant. How can I help you today? You can ask me about:\n\n• AI features usage\n• App settings\n• Available features\n• Solving problems\n• Anything else!',
        timestamp: new Date(),
      };
      setChatMessages([welcomeMessage]);
    }
  }, [showChat]);

  // show loading if in loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Dashboard
                </Button>
              </Link>
              <Brain className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AI Settings</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowChat(!showChat)}
                variant="outline" 
                className="flex items-center"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {showChat ? 'Hide Chat' : 'Chat with AI'}
              </Button>
              <Button 
                onClick={testAI}
                disabled={loading}
                variant="outline" 
                className="flex items-center"
              >
                <Zap className="h-4 w-4 mr-2" />
                AI Test
              </Button>
              <Button 
                onClick={saveSettings}
                disabled={loading}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome message */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-start">
            <Sparkles className="h-6 w-6 text-purple-600 mr-3 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-purple-900 mb-2">🚀 Welcome to AI Settings!</h2>
              <p className="text-purple-700">
                Customize AI settings to improve product creation and management experience.
              </p>
              {user?.email === 'test@example.com' && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Test mode:</strong> You can explore all AI features in test mode!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Features */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Basic Features
                </CardTitle>
                <CardDescription>
                  Enable or disable different AI features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enable AI */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Enable AI</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable all AI features
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableAI}
                    onCheckedChange={(checked) => handleSettingChange('enableAI', checked)}
                  />
                </div>

                {/* Automatic Description */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Automatic Description for Products</Label>
                    <p className="text-sm text-muted-foreground">
                      Create automatic product descriptions using AI
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoDescription}
                    onCheckedChange={(checked) => handleSettingChange('autoDescription', checked)}
                    disabled={!settings.enableAI}
                  />
                </div>

                {/* Automatic Tags */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Automatic Tags</Label>
                    <p className="text-sm text-muted-foreground">
                      Create automatic tags for products
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoTags}
                    onCheckedChange={(checked) => handleSettingChange('autoTags', checked)}
                    disabled={!settings.enableAI}
                  />
                </div>

                {/* Automatic Pricing */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Automatic Pricing</Label>
                    <p className="text-sm text-muted-foreground">
                      Suggest automatic prices for products
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoPricing}
                    onCheckedChange={(checked) => handleSettingChange('autoPricing', checked)}
                    disabled={!settings.enableAI}
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Model Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  AI Model Settings
                </CardTitle>
                <CardDescription>
                  Customize AI model settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Model */}
                <div className="space-y-2">
                  <Label htmlFor="aiModel">AI Model</Label>
                  <select
                    id="aiModel"
                    value={settings.aiModel}
                    onChange={(e) => handleSettingChange('aiModel', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={!settings.enableAI}
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</option>
                    <option value="gpt-4">GPT-4 (Accurate)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo (Balanced)</option>
                  </select>
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <Label htmlFor="temperature">Creativity Level (Temperature)</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                      className="flex-1"
                      disabled={!settings.enableAI}
                    />
                    <span className="text-sm font-medium w-12">{settings.temperature}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Low values = More precise, High values = More creative
                  </p>
                </div>

                {/* Maximum Words */}
                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Maximum Words</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min="100"
                    max="2000"
                    value={settings.maxTokens}
                    onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                    className="w-full"
                    disabled={!settings.enableAI}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Custom Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Custom Text
                </CardTitle>
                <CardDescription>
                  Add custom instructions for AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="customPrompt">Custom Text</Label>
                  <Textarea
                    id="customPrompt"
                    value={settings.customPrompt}
                    onChange={(e) => handleSettingChange('customPrompt', e.target.value)}
                    placeholder="Add custom instructions for AI..."
                    className="min-h-[120px]"
                    disabled={!settings.enableAI}
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: "Write a marketing description for the product"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Information */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Paid Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Advanced AI
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Automatic Description
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Automatic Tags
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Smart Pricing
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Tips for Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">💡 For the best results:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Use low temperature for precise description</li>
                    <li>• Use high temperature for creative content</li>
                    <li>• Add custom text to guide AI</li>
                    <li>• Test settings before final use</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="h-5 w-5 mr-2" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Products Created:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Orders Processed:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time Saved:</span>
                    <span className="font-medium">0 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat with AI Interface */}
        {showChat && (
          <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
            {/* Header the chat */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Chat with AI</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={clearChat}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={() => setShowChat(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Message area */}
            <div className="h-[380px] overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Start chatting with AI</p>
                  <p className="text-xs mt-2">Ask about features, usage, or anything else!</p>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                          : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200 shadow-sm'
                      }`}
                    >
                      {message.type === 'ai' && (
                        <div className="flex items-center mb-2">
                          <Brain className="h-3 w-3 mr-1 text-purple-500" />
                          <span className="text-xs text-purple-600 font-medium">AI Assistant</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2 text-right">
                        {message.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span className="text-sm text-purple-600 font-medium">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type your message here..."
                  className="flex-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={chatLoading}
                />
                <Button
                  onClick={sendChatMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Press Enter to send
                </p>
                {chatLoading && (
                  <div className="flex items-center text-xs text-blue-600">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                    Typing...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 