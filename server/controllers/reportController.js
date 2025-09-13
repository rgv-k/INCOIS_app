const Report = require('../models/Report'); //filepath for report 

// Get all reports - returns a list of all hazard reports
exports.getAllReports = async (req, res) => //export report
{
  try 
  {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  }
   catch (err) 
{
    res.status(500).json({ message: err.message });
  }
};

exports.getReportById = async (req, res) =>     
{
  try 
  {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json(report);
  } 
  catch (err) 
  {
    res.status(500).json({ message: err.message });
  }
};

exports.createReport = async (req, res) => //create new report
{
  try 
  {
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : []; //img path here
    
    const report = new Report({
      title: req.body.title,
      description: req.body.description,
      hazardType: req.body.hazardType,
      location: {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      },
      images: images,
      reportedBy: req.user ? req.user.id : null 
    });
    
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateReport = async (req, res) => //update report
{
  try 
  {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    if (req.body.title) report.title = req.body.title;
    if (req.body.description) report.description = req.body.description;
    if (req.body.hazardType) report.hazardType = req.body.hazardType;
    if (req.body.verified !== undefined) report.verified = req.body.verified;
    
    const updatedReport = await report.save();
    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteReport = async (req, res) => //delete report
{
  try 
  {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Report deleted' });
  } 
  catch (err) 
  {
    res.status(500).json({ message: err.message });
  }
};