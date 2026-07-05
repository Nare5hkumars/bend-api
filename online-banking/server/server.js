const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1-555-0100',
    address: '123 Main St, New York, NY 10001',
    avatar: '',
    joinedDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+1-555-0200',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    avatar: '',
    joinedDate: '2024-03-20',
  },
];

const accounts = [
  { id: 1, userId: 1, type: 'Checking', number: '****4521', balance: 12480.50, currency: 'USD' },
  { id: 2, userId: 1, type: 'Savings', number: '****7890', balance: 35000.00, currency: 'USD' },
  { id: 3, userId: 1, type: 'Credit Card', number: '****3412', balance: -1250.75, currency: 'USD' },
  { id: 4, userId: 2, type: 'Checking', number: '****1122', balance: 8750.25, currency: 'USD' },
  { id: 5, userId: 2, type: 'Savings', number: '****3344', balance: 22000.00, currency: 'USD' },
];

const transactions = [
  { id: 1, userId: 1, accountId: 1, type: 'credit', category: 'Deposit', amount: 2500.00, description: 'Salary deposit', date: '2025-06-01', status: 'completed', counterparty: 'Employer Inc.' },
  { id: 2, userId: 1, accountId: 1, type: 'debit', category: 'Shopping', amount: 125.50, description: 'Amazon purchase', date: '2025-06-02', status: 'completed', counterparty: 'Amazon' },
  { id: 3, userId: 1, accountId: 1, type: 'debit', category: 'Transfer', amount: 500.00, description: 'Transfer to savings', date: '2025-06-03', status: 'completed', counterparty: 'Savings Account' },
  { id: 4, userId: 1, accountId: 2, type: 'credit', category: 'Transfer', amount: 500.00, description: 'Transfer from checking', date: '2025-06-03', status: 'completed', counterparty: 'Checking Account' },
  { id: 5, userId: 1, accountId: 1, type: 'debit', category: 'Food', amount: 45.80, description: 'Restaurant dinner', date: '2025-06-04', status: 'completed', counterparty: 'Italian Place' },
  { id: 6, userId: 1, accountId: 1, type: 'debit', category: 'Utilities', amount: 150.00, description: 'Electric bill', date: '2025-06-05', status: 'completed', counterparty: 'Power Co' },
  { id: 7, userId: 1, accountId: 1, type: 'debit', category: 'Subscription', amount: 15.99, description: 'Netflix subscription', date: '2025-06-06', status: 'completed', counterparty: 'Netflix' },
  { id: 8, userId: 1, accountId: 3, type: 'debit', category: 'Shopping', amount: 89.99, description: 'New shoes', date: '2025-06-07', status: 'pending', counterparty: 'Nike Store' },
  { id: 9, userId: 1, accountId: 1, type: 'credit', category: 'Refund', amount: 25.00, description: 'Product refund', date: '2025-06-08', status: 'completed', counterparty: 'Store' },
  { id: 10, userId: 1, accountId: 1, type: 'debit', category: 'Transport', amount: 35.00, description: 'Uber ride', date: '2025-06-09', status: 'completed', counterparty: 'Uber' },
  { id: 11, userId: 1, accountId: 1, type: 'debit', category: 'Health', amount: 200.00, description: 'Gym membership', date: '2025-06-10', status: 'completed', counterparty: 'FitLife Gym' },
  { id: 12, userId: 1, accountId: 1, type: 'debit', category: 'Entertainment', amount: 12.00, description: 'Movie tickets', date: '2025-06-11', status: 'failed', counterparty: 'Cineplex' },
  { id: 13, userId: 1, accountId: 2, type: 'credit', category: 'Interest', amount: 35.42, description: 'Interest earned', date: '2025-06-12', status: 'completed', counterparty: 'Bank' },
  { id: 14, userId: 1, accountId: 1, type: 'debit', category: 'Shopping', amount: 299.99, description: 'New headphones', date: '2025-06-13', status: 'completed', counterparty: 'Best Buy' },
  { id: 15, userId: 1, accountId: 1, type: 'credit', category: 'Deposit', amount: 2500.00, description: 'Salary deposit', date: '2025-07-01', status: 'completed', counterparty: 'Employer Inc.' },
  { id: 16, userId: 2, accountId: 4, type: 'credit', category: 'Deposit', amount: 3200.00, description: 'Salary deposit', date: '2025-06-01', status: 'completed', counterparty: 'Company Ltd.' },
  { id: 17, userId: 2, accountId: 4, type: 'debit', category: 'Shopping', amount: 75.00, description: 'Online shopping', date: '2025-06-05', status: 'completed', counterparty: 'Mall Online' },
];

const beneficiaries = [
  { id: 1, userId: 1, name: 'Alice Johnson', accountNumber: '****5678', bankName: 'Chase Bank', email: 'alice@email.com', phone: '+1-555-0300', isFavorite: true },
  { id: 2, userId: 1, name: 'Bob Williams', accountNumber: '****9012', bankName: 'Bank of America', email: 'bob@email.com', phone: '+1-555-0400', isFavorite: false },
  { id: 3, userId: 1, name: 'Carol Davis', accountNumber: '****3456', bankName: 'Wells Fargo', email: 'carol@email.com', phone: '+1-555-0500', isFavorite: true },
  { id: 4, userId: 2, name: 'David Brown', accountNumber: '****7890', bankName: 'Citibank', email: 'david@email.com', phone: '+1-555-0600', isFavorite: false },
];

const cards = [
  { id: 1, userId: 1, type: 'debit', network: 'Visa', number: '4532********1234', holderName: 'John Doe', expiryDate: '08/28', cvv: '***', isActive: true, isFrozen: false, color: '#1a73e8', spendingLimit: 5000 },
  { id: 2, userId: 1, type: 'credit', network: 'Mastercard', number: '5512********5678', holderName: 'John Doe', expiryDate: '12/27', cvv: '***', isActive: true, isFrozen: false, color: '#e84393', spendingLimit: 10000, outstandingBalance: 1250.75, creditLimit: 10000 },
  { id: 3, userId: 1, type: 'debit', network: 'Visa', number: '4916********9012', holderName: 'John Doe', expiryDate: '03/29', cvv: '***', isActive: false, isFrozen: true, color: '#00b894', spendingLimit: 3000 },
  { id: 4, userId: 2, type: 'debit', network: 'Visa', number: '4532********3456', holderName: 'Jane Smith', expiryDate: '06/28', cvv: '***', isActive: true, isFrozen: false, color: '#6c5ce7', spendingLimit: 4000 },
];

const notifications = [
  { id: 1, userId: 1, title: 'Large Transaction Alert', message: 'A transaction of $500.00 was made to Savings Account.', type: 'transaction', date: '2025-06-03T10:30:00Z', isRead: false },
  { id: 2, userId: 1, title: 'Salary Credited', message: 'Your salary of $2,500.00 has been credited to your account.', type: 'credit', date: '2025-06-01T09:00:00Z', isRead: false },
  { id: 3, userId: 1, title: 'Card Transaction', message: 'Your card ****1234 was used for a purchase of $45.80 at Italian Place.', type: 'transaction', date: '2025-06-04T20:15:00Z', isRead: true },
  { id: 4, userId: 1, title: 'Low Balance Alert', message: 'Your checking account balance is below $1,000.00.', type: 'alert', date: '2025-06-10T08:00:00Z', isRead: true },
  { id: 5, userId: 1, title: 'Payment Due', message: 'Your credit card payment of $50.00 is due on 06/15/2025.', type: 'alert', date: '2025-06-12T12:00:00Z', isRead: false },
  { id: 6, userId: 1, title: 'Profile Updated', message: 'Your profile information was updated successfully.', type: 'account', date: '2025-06-02T14:30:00Z', isRead: true },
  { id: 7, userId: 2, title: 'New Beneficiary Added', message: 'David Brown was added as a beneficiary.', type: 'account', date: '2025-06-10T11:00:00Z', isRead: false },
];

const monthlySpending = [
  { month: 'Jan', income: 5200, expenses: 3800 },
  { month: 'Feb', income: 5100, expenses: 4200 },
  { month: 'Mar', income: 5300, expenses: 3900 },
  { month: 'Apr', income: 5500, expenses: 4100 },
  { month: 'May', income: 5400, expenses: 4300 },
  { month: 'Jun', income: 5600, expenses: 3700 },
  { month: 'Jul', income: 5200, expenses: 3500 },
];

const categoryBreakdown = [
  { name: 'Shopping', amount: 515.48, percentage: 28, color: '#FF6384' },
  { name: 'Food & Dining', amount: 320.00, percentage: 17, color: '#36A2EB' },
  { name: 'Transport', amount: 285.00, percentage: 15, color: '#FFCE56' },
  { name: 'Utilities', amount: 150.00, percentage: 8, color: '#4BC0C0' },
  { name: 'Entertainment', amount: 97.99, percentage: 5, color: '#9966FF' },
  { name: 'Health', amount: 200.00, percentage: 11, color: '#FF9F40' },
  { name: 'Others', amount: 300.00, percentage: 16, color: '#C9CBCF' },
];

let authTokens = {};

function generateToken() {
  return 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  const userId = authTokens[token];
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }
  req.user = user;
  req.userId = userId;
  next();
}

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    phone: phone || '',
    address: '',
    avatar: '',
    joinedDate: new Date().toISOString().split('T')[0],
  };
  users.push(newUser);
  const token = generateToken();
  authTokens[token] = newUser.id;

  accounts.push({
    id: accounts.length + 1,
    userId: newUser.id,
    type: 'Checking',
    number: '****' + Math.floor(1000 + Math.random() * 9000),
    balance: 1000.00,
    currency: 'USD',
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  const token = generateToken();
  authTokens[token] = user.id;
  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.post('/api/auth/logout', authenticate, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  delete authTokens[token];
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/account', authenticate, (req, res) => {
  const userAccounts = accounts.filter(a => a.userId === req.userId);
  const totalBalance = userAccounts.reduce((sum, a) => sum + a.balance, 0);
  res.json({
    success: true,
    accounts: userAccounts,
    totalBalance,
    primaryCurrency: 'USD',
  });
});

app.get('/api/transactions', authenticate, (req, res) => {
  let userTxs = transactions.filter(t => t.userId === req.userId);
  const { search, category, type, status, sort, page = 1, limit = 20 } = req.query;

  if (search) {
    const q = search.toLowerCase();
    userTxs = userTxs.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.counterparty.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }
  if (category) {
    userTxs = userTxs.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }
  if (type) {
    userTxs = userTxs.filter(t => t.type === type);
  }
  if (status) {
    userTxs = userTxs.filter(t => t.status === status);
  }

  if (sort === 'amount_asc') userTxs.sort((a, b) => a.amount - b.amount);
  else if (sort === 'amount_desc') userTxs.sort((a, b) => b.amount - a.amount);
  else if (sort === 'date_asc') userTxs.sort((a, b) => new Date(a.date) - new Date(b.date));
  else userTxs.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(userTxs.length / limit);
  const start = (page - 1) * limit;
  const paginated = userTxs.slice(start, start + parseInt(limit));

  const categories = [...new Set(transactions.filter(t => t.userId === req.userId).map(t => t.category))];

  res.json({
    success: true,
    transactions: paginated,
    total: userTxs.length,
    page: parseInt(page),
    totalPages,
    categories,
  });
});

app.post('/api/transfer', authenticate, (req, res) => {
  const { fromAccountId, toAccountNumber, toBankName, amount, description } = req.body;
  if (!fromAccountId || !toAccountNumber || !amount) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }
  if (parsedAmount > 10000) {
    return res.status(400).json({ success: false, message: 'Maximum transfer limit is $10,000' });
  }
  const fromAccount = accounts.find(a => a.id === parseInt(fromAccountId) && a.userId === req.userId);
  if (!fromAccount) {
    return res.status(404).json({ success: false, message: 'Source account not found' });
  }
  if (fromAccount.type === 'Credit Card') {
    return res.status(400).json({ success: false, message: 'Cannot transfer from credit card' });
  }
  if (fromAccount.balance < parsedAmount) {
    return res.status(400).json({ success: false, message: 'Insufficient funds' });
  }

  fromAccount.balance -= parsedAmount;

  const newTx = {
    id: transactions.length + 1,
    userId: req.userId,
    accountId: fromAccount.id,
    type: 'debit',
    category: 'Transfer',
    amount: parsedAmount,
    description: description || `Transfer to ${toAccountNumber}`,
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    counterparty: toBankName || 'External Account',
  };
  transactions.push(newTx);

  notifications.push({
    id: notifications.length + 1,
    userId: req.userId,
    title: 'Transfer Completed',
    message: `$${parsedAmount.toFixed(2)} transferred successfully to ${toAccountNumber}.`,
    type: 'transaction',
    date: new Date().toISOString(),
    isRead: false,
  });

  res.json({
    success: true,
    message: 'Transfer completed successfully',
    transaction: newTx,
    newBalance: fromAccount.balance,
  });
});

app.get('/api/beneficiaries', authenticate, (req, res) => {
  const userBeneficiaries = beneficiaries.filter(b => b.userId === req.userId);
  res.json({ success: true, beneficiaries: userBeneficiaries });
});

app.post('/api/beneficiaries', authenticate, (req, res) => {
  const { name, accountNumber, bankName, email, phone } = req.body;
  if (!name || !accountNumber || !bankName) {
    return res.status(400).json({ success: false, message: 'Name, account number, and bank name are required' });
  }
  const newBeneficiary = {
    id: beneficiaries.length + 1,
    userId: req.userId,
    name,
    accountNumber,
    bankName,
    email: email || '',
    phone: phone || '',
    isFavorite: false,
  };
  beneficiaries.push(newBeneficiary);
  res.status(201).json({ success: true, beneficiary: newBeneficiary });
});

app.put('/api/beneficiaries/:id', authenticate, (req, res) => {
  const beneficiary = beneficiaries.find(b => b.id === parseInt(req.params.id) && b.userId === req.userId);
  if (!beneficiary) {
    return res.status(404).json({ success: false, message: 'Beneficiary not found' });
  }
  const { name, accountNumber, bankName, email, phone, isFavorite } = req.body;
  if (name) beneficiary.name = name;
  if (accountNumber) beneficiary.accountNumber = accountNumber;
  if (bankName) beneficiary.bankName = bankName;
  if (email !== undefined) beneficiary.email = email;
  if (phone !== undefined) beneficiary.phone = phone;
  if (isFavorite !== undefined) beneficiary.isFavorite = isFavorite;
  res.json({ success: true, beneficiary });
});

app.delete('/api/beneficiaries/:id', authenticate, (req, res) => {
  const idx = beneficiaries.findIndex(b => b.id === parseInt(req.params.id) && b.userId === req.userId);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Beneficiary not found' });
  }
  beneficiaries.splice(idx, 1);
  res.json({ success: true, message: 'Beneficiary removed' });
});

app.get('/api/cards', authenticate, (req, res) => {
  const userCards = cards.filter(c => c.userId === req.userId);
  res.json({ success: true, cards: userCards });
});

app.put('/api/cards/:id/freeze', authenticate, (req, res) => {
  const card = cards.find(c => c.id === parseInt(req.params.id) && c.userId === req.userId);
  if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
  card.isFrozen = !card.isFrozen;
  res.json({ success: true, card, message: card.isFrozen ? 'Card frozen' : 'Card unfrozen' });
});

app.get('/api/insights', authenticate, (req, res) => {
  res.json({
    success: true,
    monthlySpending,
    categoryBreakdown,
  });
});

app.get('/api/notifications', authenticate, (req, res) => {
  const userNotifications = notifications.filter(n => n.userId === req.userId).sort((a, b) => new Date(b.date) - new Date(a.date));
  const unreadCount = userNotifications.filter(n => !n.isRead).length;
  res.json({ success: true, notifications: userNotifications, unreadCount });
});

app.put('/api/notifications/:id/read', authenticate, (req, res) => {
  const notification = notifications.find(n => n.id === parseInt(req.params.id) && n.userId === req.userId);
  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
  notification.isRead = true;
  res.json({ success: true, notification });
});

app.put('/api/notifications/read-all', authenticate, (req, res) => {
  notifications.filter(n => n.userId === req.userId).forEach(n => n.isRead = true);
  res.json({ success: true, message: 'All notifications marked as read' });
});

app.get('/api/profile', authenticate, (req, res) => {
  const { password, ...safeUser } = req.user;
  res.json({ success: true, user: safeUser });
});

app.put('/api/profile', authenticate, (req, res) => {
  const { name, phone, address, avatar } = req.body;
  const user = req.user;
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (avatar !== undefined) user.avatar = avatar;

  notifications.push({
    id: notifications.length + 1,
    userId: req.userId,
    title: 'Profile Updated',
    message: 'Your profile information was updated successfully.',
    type: 'account',
    date: new Date().toISOString(),
    isRead: false,
  });

  const { password, ...safeUser } = user;
  res.json({ success: true, message: 'Profile updated', user: safeUser });
});

app.get('/api/dashboard', authenticate, (req, res) => {
  const userAccounts = accounts.filter(a => a.userId === req.userId);
  const totalBalance = userAccounts.reduce((sum, a) => sum + a.balance, 0);
  const recentTxs = transactions
    .filter(t => t.userId === req.userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  const unreadNotifCount = notifications.filter(n => n.userId === req.userId && !n.isRead).length;
  const monthlyNet = monthlySpending.map(m => ({ month: m.month, net: m.income - m.expenses }));

  res.json({
    success: true,
    accounts: userAccounts,
    totalBalance,
    recentTransactions: recentTxs,
    unreadNotifications: unreadNotifCount,
    monthlyNet,
    spendingByCategory: categoryBreakdown,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
