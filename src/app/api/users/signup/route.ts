import {connect} from "@/app/dbConfig/dbConfig"
import Customer from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer"


connect()

export async function POST (request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { username, email, password } = reqBody


    // check if the user already exist
    const user = await Customer.findOne({email})

    if(user){
      return NextResponse.json({
        error: "User already exist"
      }, 
      {status: 400}
      )
    }

    // hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password.toString(), salt)

    const newUser = new Customer({
      username,
      email, 
      password: hashedPassword
    })

   

    const savedUser = await newUser.save()
    // send verification email
    await sendEmail({email, emailType : "VERIFY", userId: savedUser._id})


    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser
    })

  } catch (error: any) {
    console.error("Error during user signup:", error);
    return NextResponse.json({
      error: error.message
    },
    {status: 500}
    )
  }
}
