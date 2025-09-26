import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For demo purposes, handle the test admin user
        if (credentials.email === 'admin@store.com' && credentials.password === 'admin123') {
          // Check if user exists, if not create them
          let user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: 'Admin User',
                role: 'ADMIN',
                profile: {
                  create: {
                    firstName: 'Admin',
                    lastName: 'User'
                  }
                }
              }
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        // For production, you'd implement proper password hashing and verification
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role || 'CUSTOMER'
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
