import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  title: String,
  category: String,
  link: String,
  description: String,
  eligibility: String,
  deadline: String,
  organization: String,
});

const Opportunity = mongoose.model("Opportunity", opportunitySchema);
export default Opportunity;
