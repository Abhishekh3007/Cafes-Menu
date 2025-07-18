import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  name: string;
  phone: string;
  email?: string;
  date: Date;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

const ReservationSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);
