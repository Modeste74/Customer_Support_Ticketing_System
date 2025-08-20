import mongoose, { Document, Types } from "mongoose";


interface IMessage {
  sender: Types.ObjectId;
  message: string;
  timestamp: Date;
}

export interface ITicket extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'closed';
  messages: IMessage[];
  createdAt: Date;
}

const ticketSchema = new mongoose.Schema<ITicket>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in progress', 'closed'], default: 'open' },
  messages: [
    {
	  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	  message: { type: String, required: true },
	  timestamp: { type: Date, default: Date.now },
	},
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITicket>('Ticket', ticketSchema);
