import { formSchema } from "../../python/page";
import { z } from "zod";
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { NextRequest, NextResponse } from "next/server";

const sheetId = '1iceZCqPn1GETXZB5AfLvTeIeLnYkMQ-TjRWyiSNtRTg';

export async function POST(req: NextRequest) {
    const data: z.infer<typeof formSchema> = await req.json()
    try {
        addRowToSpreadsheet(sheetId, data)
        return NextResponse.json({ message: "Success" }, {status: 200})
    } catch (e) {
        return NextResponse.json({ message: "Error" }, {status: 500})
    }

}


async function addRowToSpreadsheet(sheetId: string, rowData: z.infer<typeof formSchema>) {
    const SCOPES = [
        'https://www.googleapis.com/auth/spreadsheets',
    ]

    const jwt = new JWT({
        email: process.env.client_email,
        key: process.env.private_key,
        scopes: SCOPES
    })


    const doc = new GoogleSpreadsheet(sheetId, jwt);
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    const newRow = Object.values(rowData);
    await sheet.addRow(newRow);

    console.log('New row added successfully');
}

