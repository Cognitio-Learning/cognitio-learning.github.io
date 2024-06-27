import { NextRequest, NextResponse } from "next/server";
import { NewsletterOptions } from "@/types/types";
import { Resend } from 'resend'
import WelcomeEmail from "../../../../emails/welcome";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_KEY)

export async function POST(req: NextRequest) {
    const data: NewsletterOptions = await req.json()

    const email = data.email;
    const contact = await resend.contacts.create({
        email: email,
        audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID!
    }).catch(e => {
        console.error(e)
        return NextResponse.json({ message: "Failed" }, { status: 500 })
    })

    let { error } = await resend.emails.send({
        subject: "Welcome to the Cognitio Newsletter!",
        from: "Cognitio <main@newsletter.cognitiolearning.com>",
        to: email,
        react: WelcomeEmail({
            email
        })
    })
    if (error) NextResponse.json({ message: "Failed" }, { status: 500 })

    return NextResponse.json({ message: "Success" }, { status: 200 })
}

