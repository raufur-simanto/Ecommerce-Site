import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            phone: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, phone } = await request.json()

    // Update user name
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name?.trim() || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            phone: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Update or create user profile with phone
    if (phone !== undefined) {
      await prisma.userProfile.upsert({
        where: { userId: updatedUser.id },
        update: {
          phone: phone?.trim() || null,
          updatedAt: new Date()
        },
        create: {
          userId: updatedUser.id,
          phone: phone?.trim() || null
        }
      })
    }

    // Fetch the updated user with profile
    const userWithProfile = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            phone: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json({ user: userWithProfile })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
