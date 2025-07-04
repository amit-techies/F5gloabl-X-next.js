'use server';

import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from '@/auth';
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
// sign in the user with credentials
export async function signInWithCredntials(prevState:unknown,
     formData: FormData) {
    try{
     const user = signInFormSchema.parse({
        email: formData.get('email'),
        password: formData.get('password')
     });
     await signIn('credentials', user);
     return {success: true, message: 'Signed in succesfully'};
    }catch(error){
     if (isRedirectError(error)){
        throw error;
     }

     return{success: false, message: 'Invalid email or password'};
    }
}

// sign user out
export async function signOutUser(){
    await signOut();
}

// sign up user

export async function signUpUser(prevState:unknown, formData: FormData) {
   try{
   const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmpassword: formData.get('confirmpassword'),
   });

   const plainpassword = user.password;

   user.password = hashSync(user.password, 10);
   await prisma.user.create({
      data:{
         name: user.name,
         email: user.email,
         password: user.password,
      },
   });

await signIn('credentials',{
   email: user.email,
    password: plainpassword,
});
return {success: true, message: 'User registered succesfully'}
   }catch(error){
 if (isRedirectError(error)){
        throw error;
     }

     return{success: false, message: formatError(error)};
   }
}


// Get user by ID
export async function getUserById(userId: string){
   const user = await prisma.user.findFirst({
      where:{id: userId}
   });
   if(!user) throw new Error('user not found');
   return user;
}