import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')
    const limitCount = parseInt(searchParams.get('limit') || '50')

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 })
    }

    const messagesRef = collection(db, 'chatMessages')
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date()
    })).reverse()

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId, senderId, senderName, senderType, message, attachments } = body

    if (!chatId || !senderId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const messageData = {
      chatId,
      senderId,
      senderName: senderName || 'Anonymous',
      senderType: senderType || 'user',
      message: message.trim(),
      timestamp: serverTimestamp(),
      isRead: false,
      attachments: attachments || []
    }

    const docRef = await addDoc(collection(db, 'chatMessages'), messageData)

    return NextResponse.json({ 
      id: docRef.id,
      ...messageData,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
