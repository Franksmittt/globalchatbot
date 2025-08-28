// src/app/api/messages/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This is the POST handler for the dashboard to send messages.
export async function POST(request: Request) {
  try {
    const { text, sender, chatId } = await request.json();

    if (!text || !sender || !chatId) {
      return NextResponse.json({ error: 'Missing message data' }, { status: 400 });
    }

    // Save the new message to the database
    const newMessage = await prisma.message.create({
      data: {
        text,
        sender,
        chatId,
      },
    });

    // Also update the last message and timestamp on the chat record
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessageText: text,
        lastMessageTime: new Date(),
        status: 'staff', // When a staff member replies, the status changes to staff
      },
    });

    // In a real application, you would also use the WhatsApp Business API here
    // to send this message back to the customer.

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}