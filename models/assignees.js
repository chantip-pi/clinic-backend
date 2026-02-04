const { pool } = require('../config/database');

async function getStaffsByRecordId(recordId) {
    try {
      const { rows } = await pool.query(
        `SELECT s.staff_id,
                s.name_surname
         FROM assignees mrn
         JOIN staffs s ON s.staff_id = mrn.staff_id
         WHERE mrn.record_id = $1`,
        [recordId]
      );
    
      // Returns null if no staff found, otherwise returns the array
      if (rows.length === 0) {
        return [];
      }
      
      return rows.map((row) => ({
        staffId: row.staff_id,
        nameSurname: row.name_surname
      }));
    } catch (error) {
      console.error(`Error fetching staffs for record ${recordId}:`, error);
      throw error;
    }
  }
  
  async function assignStaffsToRecord(recordId, staffIds) {
    await pool.query('DELETE FROM assignees WHERE record_id = $1', [
      recordId
    ]);
  
    if (Array.isArray(staffIds) && staffIds.length > 0) {
      const values = staffIds
        .map((_, index) => `($1, $${index + 2})`)
        .join(', ');
  
      await pool.query(
        `INSERT INTO assignees (record_id, staff_id)
         VALUES ${values}`,
        [recordId, ...staffIds]
      );
    }
  
    return getStaffsByRecordId(recordId);
  }

  module.exports = {
    getStaffsByRecordId,
    assignStaffsToRecord
  };