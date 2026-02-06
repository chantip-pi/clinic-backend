const {
  getMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordsByPatientId,
  createMedicalRecord,
  updateMedicalRecord,
} = require('../models/medicalRecord');


const { getAppointmentById,updateAppointment} = require('../models/appointment');


const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong' });
};

const getMedicalRecordList = async (req, res) => {
  try {
    const medicalRecords = await getMedicalRecords();
    res.json(medicalRecords);
  } catch (error) {
    handleError(res, error);
  }
};

const getMedicalRecordByIdHandler = async (req, res) => {
  try {
    const medicalRecord = await getMedicalRecordById(req.params.medicalRecordId);
    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.json(medicalRecord);
  } catch (error) {
    handleError(res, error);
  }
};

const getMedicalRecordsByPatientIdHandler = async (req, res) => {
  try {
    const medicalRecords = await getMedicalRecordsByPatientId(req.params.patientId);
    res.json(medicalRecords);
  } catch (error) {
    handleError(res, error);
  }
};

const createMedicalRecordHandler = async (req, res) => {
  try {
    const { 
      appointmentId, 
      doctorId, 
      patientId, 
      dateTime, 
      diagnosis, 
      symptoms, 
      prescriptions, 
      remarks,
      assignees
    } = req.body;

    // Validate required fields for records without appointments
    if (!appointmentId) {
      if (!doctorId || !patientId || !dateTime) {
        return res.status(400).json({ 
          error: 'doctorId, patientId, and dateTime are required when appointmentId is not provided' 
        });
      }
    }

    // If appointmentId is provided, validate the appointment
    if (appointmentId) {
      const appointment = await getAppointmentById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      if (!['scheduled'].includes(appointment.status)) {
        return res.status(400).json({
          error: 'Appointment must be scheduled to create a medical record',
          currentStatus: appointment.status
        });
      }

      // Create the medical record with appointment data
      const medicalRecord = await createMedicalRecord({
        appointmentId,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        dateTime: dateTime,
        diagnosis,
        symptoms,
        prescriptions,
        remarks,
        assignees
      });


      // If appointment is scheduled, update it to completed (pass full appointment so other columns are not set to null)
      if (appointment.status === 'scheduled') {
        await updateAppointment(appointmentId, {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          appointmentDateTime: appointment.appointmentDateTime,
          status: 'completed',
          reason: appointment.reason
        });
      }

      return res.status(201).json(medicalRecord);
    }

    // Create medical record without appointment (walk-in)
    const medicalRecord = await createMedicalRecord({
      appointmentId: null,
      doctorId,
      patientId,
      dateTime,
      diagnosis,
      symptoms,
      prescriptions,
      remarks,
      assignees
    });

    res.status(201).json(medicalRecord);
  } catch (error) {
    handleError(res, error);
  }
};

const updateMedicalRecordHandler = async (req, res) => {
  try {
    const { diagnosis, symptoms, prescriptions, remarks, dateTime } = req.body;
    const medicalRecord = await updateMedicalRecord(req.params.medicalRecordId, {
      diagnosis,
      symptoms,
      prescriptions,
      remarks,
      dateTime
    });

    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    res.json(medicalRecord);
  } catch (error) {
    handleError(res, error);
  }
};


module.exports = {
  getMedicalRecordList,
  getMedicalRecordById: getMedicalRecordByIdHandler,
  getMedicalRecordsByPatientId: getMedicalRecordsByPatientIdHandler,
  createMedicalRecord: createMedicalRecordHandler,
  updateMedicalRecord: updateMedicalRecordHandler,
};
