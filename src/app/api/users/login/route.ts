import {connect} from "@/app/dbConfig/dbConfig"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import Customer from "@/models/userModel"


connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const {email, password} = reqBody
    console.log("req body", reqBody)

    // check if user exist 
    const user = await Customer.findOne({email})
    console.log("user ----", user)

    if(!user) {
      return NextResponse.json({error : "User does not exist"}, {
        status: 400
      })
    }

    // check if password is correct 
    const validPassword = await bcryptjs.compare(password, user.password) 

    if(!validPassword){
      return NextResponse.json({
        error: "Invalid password"
                }, 
                {status: 400})
    }

    // create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email:user.email
    }
    // create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d"
    })

    // pass the token to the cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true
    })
    response.cookies.set("token", token, {
      httpOnly: true
    })
    console.log("login successfully!")
    return response;

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    },
    {status: 500})
    
  }
}