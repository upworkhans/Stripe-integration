import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { clearEvents, listEvents } from '@/lib/eventsStore';

export async function GET() {
  const prisma = getPrisma();
  if (prisma) {
    const events = await prisma.webhookEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
    return NextResponse.json({ items: events });
  }
  return NextResponse.json({ items: listEvents() });
}

export async function DELETE(_req: NextRequest) {
  const prisma = getPrisma();
  if (prisma) {
    await prisma.webhookEvent.deleteMany({});
    return NextResponse.json({ cleared: true });
  }
  clearEvents();
  return NextResponse.json({ cleared: true });
}

