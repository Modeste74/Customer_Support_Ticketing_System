import { Request, Response, RequestHandler } from "express";
import Ticket from "../models/Ticket";


export const createTicket: RequestHandler = async (req, res) => {
  const userId = (req as any).user._id;
  const { title, description } = req.body;

  // --- Input Validation ---
  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ message: 'Ticket title is required and must be a non-empty string.' });
    return;
  }
  
  if (!description || typeof description !== 'string' || description.trim() === '') {
    res.status(400).json({ message: 'Ticket description is required and must be a non-empty string.' });
    return;
  }
  // --- End input validation ---

  try {
    const ticket = await Ticket.create({
      user: userId,
      title,
      description,
      status: 'open',
      messages: [],
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error creating Ticket:", err); // Log full error on server
    res.status(500).json({ message: 'Error fetching tickets', error: (err as Error).message || 'An unknown error occurred' });
  }
};


export const getUserTickets: RequestHandler = async (req, res) => {
  const userId = (req as any).user._id;
  try {
    const tickets = await Ticket.find({ user: userId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching all Tickets:", err);
    res.status(500).json({ message: 'Error fetching tickets', error: (err as Error).message || 'An unknown error occurred' });
  }
};


export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find().populate('user', 'name email').sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all tickets', error: (err as Error).message || 'An unknown error occurred' });
  }
};


export const replyToTicket: RequestHandler = async (req, res) => {
  const userId = (req as any).user._id;
  const userRole = (req as any).user.role;

  const { message } = req.body;
  const ticketId = req.params.id;

  // --- Input Validation for Message ---
  if (!message || typeof message !== 'string' || message.trim() === '') {
    res.status(400).json({ message: 'Message content is required and must be a non-empty string.' });
    return;
  }
  // --- End Input Validation ---

  try {
    const ticket = await Ticket.findById(ticketId);
    
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
    }

    // --- Authorization Check ---
    // Allow if user is the ticket creator OR user is admin
    if (ticket!.user.toString() !== userId.toString() && userRole !== 'admin') {
      res.status(403).json({ message: 'Not authorized to reply to this ticket' });
      return;
    }
    // --- End Authorization Check ---

    ticket!.messages.push({
      sender: userId,
      message,
      timestamp: new Date(),
    });

    await ticket!.save();
    res.json(ticket);
  } catch (err) {
    console.error("Error replying to Ticket:", err);
    res.status(500).json({ message: 'Error replying to ticket', error: (err as Error).message || 'An unknown error occurred' });
  }
};


export const updateTicketStatus: RequestHandler = async (req, res) => {
  const userId = (req as any).user._id;
  const userRole = (req as any).user.role;
  const ticketId = req.params.id;
  const { status } = req.body;

  // --- Input Validation ---
  const validStatuses = ['open', 'in progress', 'closed'];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}` });
    return;
  }
  // --- End Input Validation ---

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // --- Authorization Check ---
    // Only the ticket owner OR an admin can update status
    if (ticket!.user.toString() !== userId.toString() && userRole !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this ticket status' });
      return;
    }

    // Specific rules for non-admin users (ticket owners)
    // Users can only change their own ticket's status to 'closed'.
    // They cannot change it to 'in progress' or re-open a closed ticket.
    if (userRole !== 'admin') {
      // If the user is trying to change to 'in progress' or re-open
      if (status === 'in progress' || (ticket.status === 'closed' && status === 'open')) {
        res.status(403).json({ message: 'Users can only close their own tickets.' });
        return;
      }

      // If the user is trying to close, ensure it's not already closed
      if (status === 'closed' && ticket.status === 'closed') {
        res.status(400).json({ message: 'Ticket is already closed.' });
        return;
      }
    }

    // --- End Authorization Check ---
    ticket!.status = status;
    await ticket!.save();
    res.json({ message: 'Ticket status updated successfully', ticket });
  } catch (err) {
    console.error("Error updating ticket status:", err);
    res.status(500).json({ message: 'Error updating ticket status', error: (err as Error).message || 'An unknown error occurred' });
  }
};


export const getTicketById: RequestHandler = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('messages.sender', 'name')
      .populate('user', '_id name email'); // populates the tickets creator

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    const loggedInUser = (req as any).user;

    // --- Corrected Authorization Check ---
    // Condition 1: Check if the ticket's creator ID matches the logged-in user's ID.
    // Use ticket.user._id.toString() to get the actual ID string for comparison.
    const isOwner = ticket.user._id.toString() === loggedInUser._id.toString();

    // Condition 2: Check if the logged-in user has the 'admin' role.
    // Use the 'role' property that you confirmed is present in req.user.
    const isAdmin = loggedInUser.role === 'admin';

    // --- DEBUGGING LOGS START HERE ---
    // console.log('--- Ticket Authorization Debug ---');
    // console.log('Ticket ID:', req.params.id);
    // console.log('Logged-in User (req.user):', (req as any).user);
    // console.log('Logged-in User ID (req.user._id):', (req as any).user?._id?.toString());
    // console.log('Logged-in User is Admin:', (req as any).user?.isAdmin);
    // console.log('Ticket Creator (ticket.user):', ticket.user);
    // console.log('Ticket Creator ID (ticket.user._id):', ticket.user?._id?.toString());
    // console.log('Are ticket.user._id and req.user._id the same?',
    //   ticket.user?._id?.toString() === (req as any).user?._id?.toString()
    // );
    // console.log('--- End Debug ---');
    // --- DEBUGGING LOGS END HERE ---

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'Not authorized to view this ticket' });
      return;
    }
    res.status(200).json(ticket);
  } catch (error: any) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ message: 'Invalid ticket ID format' });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};