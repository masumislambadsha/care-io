import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "./supabase";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Fetch user from Supabase
        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("Invalid credentials");
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }

      // Handle Google OAuth
      if (account?.provider === "google") {
        const { data: existingUser } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", token.email)
          .single();

        if (!existingUser) {
          // Create new user
          const { data: newUser, error: insertError } = await supabaseAdmin
            .from("users")
            .insert({
              email: token.email,
              name: token.name,
              image: token.picture || null,
              email_verified: new Date().toISOString(),
              role: "CLIENT",
              status: "ACTIVE",
            })
            .select()
            .single();

          if (insertError || !newUser) {
            console.error("Google OAuth user creation failed:", insertError);
            return token;
          }

          token.id = newUser.id;
          token.role = newUser.role;
        } else {
          token.id = existingUser.id;
          token.role = existingUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
