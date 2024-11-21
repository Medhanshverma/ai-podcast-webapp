import React, { useState } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader, Copy } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useToast } from "@/hooks/use-toast";

const useGenerateChat = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const getChatResponse = useAction(api.openai.generateChatResponse);

  const generateChat = async (input: string, setChatResponse: (response: string) => void) => {
    if (!input) {
      toast({
        title: "Please provide a prompt.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await getChatResponse({ input });
      setChatResponse(response || "No response generated.");
      toast({
        title: "Chat response generated successfully!",
      });
    } catch (error) {
      console.error("Error generating chat:", error);
      toast({
        title: "Error generating chat response",
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateChat,
  };
};

const GenerateChat = () => {
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const { isGenerating, generateChat } = useGenerateChat();
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chatResponse)
      .then(() => {
        toast({ title: "Copied to clipboard!" });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast({
          title: "Failed to copy text",
          variant: 'destructive',
        });
      });
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Enter the Chat Prompt for text generation
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-orange-1 text-white-1 bg-gray-800"
          placeholder="Provide a prompt for generating text"
          rows={5}
          value={chatPrompt}
          onChange={(e) => setChatPrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={() => generateChat(chatPrompt, setChatResponse)}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            'Generate Chat'
          )}
        </Button>
      </div>
      {chatResponse && (
        <div className="mt-5 p-4 bg-gray-800 text-white-1 rounded">
          <h3 className="font-bold mb-2">Response:</h3>
          <p className="mb-4">{chatResponse}</p>
          <Button
            type="button"
            className="flex items-center gap-2 bg-orange-1 text-white p-2 rounded"
            onClick={copyToClipboard}
          >
            <Copy size={16} /> Copy to Clipboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default GenerateChat;
