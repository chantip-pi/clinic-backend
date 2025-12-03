const {
  getStaff,
  getStaffById,
  getStaffByUsername,
  createStaff,
  updateStaff,
  deleteStaff
} = require('../models');

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong' });
};

const listStaff = async (req, res) => {
  try {
    const staff = await getStaff();
    res.json(staff);
  } catch (error) {
    handleError(res, error);
  }
};

const getStaffByIdHandler = async (req, res) => {
  try {
    const staff = await getStaffById(req.params.staffId);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    handleError(res, error);
  }
};

const getStaffByUsernameHandler = async (req, res) => {
  try {
    const staff = await getStaffByUsername(req.params.username);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    handleError(res, error);
  }
};

const addStaff = async (req, res) => {
  try {
    const staff = await createStaff(req.body);
    res.status(201).json(staff);
  } catch (error) {
    handleError(res, error);
  }
};

const editStaff = async (req, res) => {
  try {
    const staff = await updateStaff(req.params.staffId, req.body);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    handleError(res, error);
  }
};

const removeStaff = async (req, res) => {
  try {
    const deleted = await deleteStaff(req.params.staffId);
    if (!deleted) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listStaff,
  getStaffById: getStaffByIdHandler,
  getStaffByUsername: getStaffByUsernameHandler,
  addStaff,
  editStaff,
  removeStaff
};