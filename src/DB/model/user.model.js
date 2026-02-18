import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  
} from "../../common/enums/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,

    otp: Number,
otpExpires: Date,
isVerified: {
  type: Boolean,
  default: false,
},

    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },

    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },
    profilePicture: String,
    coverProfilePicture: [String],
    confirmEmail: Date,
    changeCredentialsTime: Date,
  },
  {
    collection: "Sarah_Users",
    timestamps: true,
    strict: true,
    strictQuery: true,
    optimisticConcurrency: true,
    autoIndex: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
  },
);

userSchema.virtual("username").set(function(value){
    const [firstName,lastName] = value?.split(' ')||[];
    this.set({firstName,lastName})
}).get(function(){
    return this.firstName+" "+this.lastName;
})


export const UserModel = mongoose.models.User || mongoose.model("User",userSchema)