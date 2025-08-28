// src/app/api/chats/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This is the GET handler to fetch all chats for the dashboard.
// It replaces the mock 'chats' array in Dashboard.tsx.
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
// WhatsApp sends incoming messages to this endpoint.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received WhatsApp webhook payload:', body);

    // This is a simplified check. A real webhook needs more robust validation.
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
            customerName: from, // In a real app, you might get the name from the contact list.
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

      // Implement your AI and handoff logic here (covered in the next steps)
      // For now, let's log the message.
      console.log(`New message from ${from}: ${text}`);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}