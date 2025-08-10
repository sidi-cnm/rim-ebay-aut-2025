import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../../../../lib/prisma";
import { Roles } from "../../../../../../DATA/roles";
import { sendVerificationEmailLocal } from "../../../../../../lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const { email, password, contact } = await request.json();

    if (!email || !password || !contact) {
      return NextResponse.json(
        { error: "Email and password and contact are required" },
        { status: 400 },
      );
    }
    const userIndb = await prisma.user.findUnique({
      where: { email },
    });
    if (userIndb) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    const user = await prisma.user.create({
      data: {
        email,
        //contact,
        password: hashedPassword,
        roleId: String(Roles[1].id),
        roleName: Roles[1].name,
        verifyToken: token, 
        emailVerified:false,
        verifyTokenExpires: expires
      },
    });
    const tokenContact = crypto.randomUUID();
    await prisma.contact.create({
      data: {
        userId: user.id,
        contact,
        verifyCode:tokenContact,
      },
    });

    await sendVerificationEmailLocal(email, token);

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
