import { Prisma, prisma } from '@wearcheck/database'

type NotificationInput = {
  userId: string
  title: string
  message: string
  actionUrl?: string
  data?: Prisma.InputJsonValue
  type?: 'SAMPLE_RECEIVED' | 'REPORT_READY' | 'CRITICAL_RESULT' | 'SYSTEM_ALERT' | 'FEEDBACK_RESPONSE' | 'MAINTENANCE_DUE'
}

export async function createInAppNotification({
  userId,
  title,
  message,
  actionUrl,
  data,
  type = 'SYSTEM_ALERT',
}: NotificationInput) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      actionUrl,
      data,
      type,
      channel: 'IN_APP',
      sent: true,
      sentAt: new Date(),
    },
  })
}

export async function notifyAdmins(input: Omit<NotificationInput, 'userId'>) {
  const admins = await prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      role: {
        in: ['SUPER_ADMIN', 'ADMIN'],
      },
    },
    select: {
      id: true,
    },
  })

  if (!admins.length) {
    return []
  }

  return Promise.all(
    admins.map((admin: { id: string }) =>
      createInAppNotification({
        ...input,
        userId: admin.id,
      })
    )
  )
}
