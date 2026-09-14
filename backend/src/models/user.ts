import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (_email: string, _password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', async function (email: string, password: string) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Неправильные почта или пароль');
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new Error('Неправильные почта или пароль');
  }
  return user;
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
