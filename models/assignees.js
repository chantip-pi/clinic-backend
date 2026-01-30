const { pool } = require('../config/database');

async function getStaffsByRecordId(recordId) {
    const { rows } = await pool.query(
      `SELECT s.staff_id,
              s.name_surname
       FROM assignees mrn
       JOIN staffs s ON s.staff_id = mrn.staff_id
       WHERE mrn.record_id = $1`,
      [recordId]
    );
  
    return rows.map((row) => ({
      staffId: row.staff_id,
      nameSurname: row.name_surname
    }));
  }
  
  async function assignStaffsToRecord(recordId, nurseIds) {
    await pool.query('DELETE FROM assignees WHERE record_id = $1', [
      recordId
    ]);
  
    if (Array.isArray(nurseIds) && nurseIds.length > 0) {
      const values = nurseIds
        .map((_, index) => `($1, $${index + 2})`)
        .join(', ');
  
      await pool.query(
        `INSERT INTO assignees (record_id, staff_id)
         VALUES ${values}`,
        [recordId, ...nurseIds]
      );
    }
  
    return getStaffsByRecordId(recordId);
  }

  module.exports = {
    getStaffsByRecordId,
    assignStaffsToRecord
  };