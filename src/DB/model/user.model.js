import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
<<<<<<< HEAD
  RoleEnum,
=======
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
  
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
<<<<<<< HEAD
      type: Number,
=======
      type: String,
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },

    provider: {
<<<<<<< HEAD
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },

    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.user,
    },
=======
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
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