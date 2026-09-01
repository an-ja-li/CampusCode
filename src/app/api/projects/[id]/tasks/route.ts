// ============================================================
// CampusCode — Project Tasks API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { TaskStatus, TaskPriority } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: projectId } = await params;
    const body = await request.json();

    const creatorId = session?.user?.id || 'demo_user';

    const newTask = await db.task.create({
      data: {
        projectId,
        title: body.title,
        description: body.description || '',
        status: (body.status?.toUpperCase() as TaskStatus) || 'TODO',
        priority: (body.priority?.toUpperCase() as TaskPriority) || 'MEDIUM',
        labels: body.labels || [],
        assigneeId: body.assigneeId || null,
        creatorId: creatorId,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        subtasks: {
          create: (body.subtasks || []).map((st: { title: string; completed?: boolean }) => ({
            title: typeof st === 'string' ? st : st.title,
            completed: Boolean((st as { completed?: boolean }).completed),
          })),
        },
      },
      include: {
        subtasks: true,
        comments: true,
        assignee: true,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('[API Project Tasks POST Error]:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { taskId, status, priority, title, description, subtasks } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (status) data.status = status.toUpperCase();
    if (priority) data.priority = priority.toUpperCase();
    if (title) data.title = title;
    if (description !== undefined) data.description = description;

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data,
      include: {
        subtasks: true,
        assignee: true,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('[API Project Tasks PATCH Error]:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    await db.task.delete({ where: { id: taskId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Project Tasks DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
