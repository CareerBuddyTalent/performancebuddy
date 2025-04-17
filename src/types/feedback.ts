
export interface Feedback {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'praise' | 'suggestion' | 'criticism';
  isAnonymous: boolean;
  createdAt: Date;
}
