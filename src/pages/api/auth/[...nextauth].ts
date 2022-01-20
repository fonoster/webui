import logger from '@fonoster/logger'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import fetch from 'node-fetch'

import { createToken, createUser, getUser } from '@/mods/shared/helpers/api'

/**
 * @todo Refactor this file's logic
 */

async function getEmail(account) {
  // https://developer.github.com/v3/users/emails/#list-email-addresses-for-the-authenticated-user
  const res = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${account.access_token}`,
    },
  })

  const emails = (await res.json()) as any

  if (emails?.length === 0) return

  logger.verbose(`webui signIn [emails -> ${JSON.stringify(emails)}]`)

  // Sort by primary email - the user may have several emails, but only one of them will be primary
  const sortedEmails = Array.isArray(emails)
    ? emails?.sort((a, b) => b.primary - a.primary)
    : []

  return sortedEmails[0].email as string
}

const isAllowedToSignIn = async (username?: string) => {
  const { users } = (await (
    await fetch(process.env.WAITING_LIST_URL as string)
  ).json()) as Record<string, string[]>

  const isAllowed = users.some(user => user === username)

  return isAllowed || '/waiting-list'
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  debug: false,
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async signIn({ profile, account }) {
      logger.verbose(`webui signIn [profile -> ${JSON.stringify(profile)}]`)
      logger.verbose(`webui signIn [account -> ${JSON.stringify(account)}]`)

      const _email = await getEmail(account)
      let user = await getUser(_email)

      if (!user) {
        user = await createUser({
          email: _email,
          name: profile.name,
          // Setting this to a secured value but we won't
          // support username/password for now
          secret: account.access_token,
        })
      }

      return isAllowedToSignIn(profile.login as string)
    },
    async session({ session, token }) {
      const _email = await getEmail(token.account)
      const user = await getUser(_email)

      logger.verbose(`webui session [session -> ${JSON.stringify(session)}]`)
      logger.verbose(`webui session [token -> ${JSON.stringify(token)}]`)

      session.endpoint = process.env.ENDPOINT as string

      const data = {
        ...session?.user,
        accessKeyId: user?.accessKeyId,
        accessKeySecret: await createToken(user?.accessKeyId),
      }

      session.user = data as any

      return session
    },
    async jwt({ token, user, account }) {
      logger.verbose(`webui jwt [session -> ${JSON.stringify(token)}]`)
      logger.verbose(`webui jwt [token -> ${JSON.stringify(user)}]`)
      logger.verbose(`webui jwt [account -> ${JSON.stringify(account)}]`)

      user && (token.user = user)
      account && (token.account = account)

      return token
    },
  },
})
