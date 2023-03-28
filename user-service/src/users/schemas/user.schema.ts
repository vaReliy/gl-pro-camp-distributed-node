import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserPermission } from '../interfaces/UserService';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
      delete ret._id;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    },
  },
})
export class User {
  @Prop()
  username: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop({
    enum: UserPermission,
    default: [UserPermission.WRITE_TEXT],
    type: [String],
  })
  permissions: UserPermission[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
