import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

enum Permissions {
  WRITE_TEXT,
  EDIT_USERS,
}

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

  @ApiProperty({
    enum: Permissions,
    default: [Permissions.WRITE_TEXT],
    type: String,
  })
  @Prop({
    enum: Permissions,
    default: [Permissions.WRITE_TEXT],
    type: [String],
  })
  claims: string[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
