const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    chatId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Chat', 
      required: true 
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['sent', 'delivered', 'read'], 
      default: 'sent' 
    }
  },
  { timestamps: true }
);

// Update last message in chat after saving
messageSchema.post('save', async function(doc) {
  await mongoose.model('Chat').findByIdAndUpdate(
    doc.chatId,
    { lastMessage: doc._id }
  );
});

module.exports = mongoose.model('Message', messageSchema);