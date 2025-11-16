const User = require('../models/User');

exports.getUserDashboard = async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (req.user.role === 'admin') return res.redirect('/admin/dashboard');
  res.render('userDashboard', { user });
};

exports.getAdminDashboard = async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  res.render('adminDashboard', { user });
};
