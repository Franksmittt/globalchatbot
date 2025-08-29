// src/app/api/chats/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import model from '@/lib/gemini'; // Import the Gemini model

// Placeholder for your vehicle-to-battery database.
// In a real app, this would be a database or a large JSON file.
const vehicleDatabase = {
  'corsa light 1300': '628',
  'polo vivo 1.4': '628',
  'ford focus': '652',
  'vw golf 5': '646',
  'nissan navara': '652',
  'toyota hilux': '652',
  'isuzu kb 250': '646',
  'vw polo': '628',
  'ford ranger': '652',
  'toyota corolla': '628',
  'bmw 3 series': '652',
  'mercedes c-class': '652',
  'audi a4': '652',
  'honda civic': '628',
  'hyundai i20': '628',
};

// This is the GET handler to fetch all chats for the dashboard.
export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      include: {
        messages: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageTime: 'desc',
      },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// This is the POST handler for the WhatsApp webhook.
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify the webhook payload and extract message data.
    if (body.object === 'whatsapp_business_account' && body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const messageData = body.entry[0].changes[0].value.messages[0];
      const from = messageData.from; // Customer's WhatsApp number
      const text = messageData.text.body;

      // Check if a chat already exists for this number.
      let chat = await prisma.chat.findFirst({
        where: { id: from },
      });

      if (!chat) {
        // If not, create a new chat record.
        chat = await prisma.chat.create({
          data: {
            id: from,
            customerName: from,
            lastMessageText: text,
            lastMessageTime: new Date(),
          },
        });
      }

      // Add the new message to the database.
      await prisma.message.create({
        data: {
          text: text,
          sender: 'user',
          chatId: chat.id,
        },
      });

      // --- AI and Handoff Logic ---

      let responseText: string;
      const lowerCaseText = text.toLowerCase();

      // Check for keywords and a simple vehicle lookup.
      const isPriceQuote = lowerCaseText.includes('price') || lowerCaseText.includes('quote') || lowerCaseText.includes('how much');
      const isCallout = lowerCaseText.includes('call-out') || lowerCaseText.includes('call out') || lowerCaseText.includes('breakdown');
      const isAddress = lowerCaseText.includes('address') || lowerCaseText.includes('location') || lowerCaseText.includes('where are you');
      const isHumanRequest = lowerCaseText.includes('speak to agent') || lowerCaseText.includes('human');
      
      let batterySize = null;
      for (const [vehicle, size] of Object.entries(vehicleDatabase)) {
        if (lowerCaseText.includes(vehicle)) {
          batterySize = size;
          break;
        }
      }

      if (isHumanRequest || isCallout) {
        responseText = "Please hold while I connect you to a staff member.";
        // Handoff to a human agent (update chat status in database).
        await prisma.chat.update({
          where: { id: chat.id },
          data: {
            status: 'staff',
          },
        });
      } else if (isPriceQuote && batterySize) {
        // Provide a quote using the found battery size.
        responseText = `Based on your vehicle, we recommend a ${batterySize} battery. Options range from budget to premium with warranties up to 25 months. Would you like to view our full product list or get a quote?`;
      } else if (isAddress) {
        // Provide branch addresses.
        responseText = "Our branches are located in Alberton (011 869 2427) and Vanderbijlpark (016 023 0161). We offer free battery testing and fitment.";
      } else {
        // Fallback to Gemini for more complex or general questions.
        const prompt = `You are a helpful assistant for Global Batteries, a car battery store in South Africa. The user has asked a question. Provide a helpful response. If the user is asking for a battery quote, a call-out, or an address, provide that information. If the user's vehicle is in our database, recommend the correct battery size. Here is our vehicle-to-battery database: ${JSON.stringify(vehicleDatabase)}. User message: "${text}"`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
      }

      // Add the chatbot's response to the database.
      await prisma.message.create({
        data: {
          text: responseText,
          sender: 'bot',
          chatId: chat.id,
        },
      });
      
      // NOTE: You would use the WhatsApp Business API here to send this
      // response back to the customer. This part is not implemented yet.

    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}