/**
 * expense.js
 */

var mongoose = require('mongoose');

var expenseSchema = new mongoose.Schema({
	name: { type: String, required: true }
});

module.exports = mongoose.model('Expense', expenseSchema, 'expenses');