import { NextAuthOptions } from "next-auth";
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from "./db";
import User from "@/models/User.model";
import bcrypt from 'bcrypt'

export const authOptions:NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email : {label: "Email",type: "text"},
                password : {label: "Password",type: "text"},
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials.password){
                    throw new Error("Missing email or password")
                }

                try {
                    await connectDB()
                    const user = await User.findOne({email: credentials?.email})

                    if(!user) {
                        throw new Error("No User found!")
                    }
                    const isvalidPassword = await bcrypt.compare(credentials?.password,user.password)
                    if(!isvalidPassword) {
                        throw new Error("invalid password");
                    }

                    return {
                        id:user._id.toString(),
                        email: user.email,
                        username: user.username,
                        fullname: user.fullname
                    }
                } catch (error) {
                    throw error;
                    console.log("Auth Error",error);
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_id!,
            clientSecret: process.env.GITHUB_SECRET!
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session, token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
        signOut: "/logout"
    },
    session: {
        strategy: "jwt",
        maxAge: 24*60*60
    },
    secret: process.env.NEXTAUTH_SECRET!
}
