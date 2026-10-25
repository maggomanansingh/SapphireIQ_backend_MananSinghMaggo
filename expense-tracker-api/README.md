# Expense Tracker API — Endpoints

Base URL: `http://localhost:5000/api`

## 1. Health Check

**GET** `/health`

Checks whether the API is running.

**Request body:** None

## 2. Create an Expense

**POST** `/expenses`

Creates a new expense.

**JSON body:**
```json
{
  "amount": 250,
  "category": "Food",
  "date": "2026-10-25"
}
```

- `amount` — required number greater than `0`
- `category` — required string
- `date` — date string; optional if the model's default date is used

## 3. Get All Expenses

**GET** `/expenses`

Returns all expenses. No request body is needed.

**Optional query parameters:**
- `category` — filter by category (case-insensitive)
- `startDate` — include expenses on or after this date
- `endDate` — include expenses through this date

**Examples:**
```http
GET /expenses?category=Food
GET /expenses?startDate=2026-10-01&endDate=2026-10-31
GET /expenses?category=Food&startDate=2026-10-01&endDate=2026-10-31
```

## 4. Get an Expense by ID

**GET** `/expenses/:id`

Replace `:id` with the expense's MongoDB ID.

**Example:**
```http
GET /expenses/671a2bc34d5e6f7890123456
```

**Request body:** None

## 5. Update an Expense

**PATCH** `/expenses/:id`

Replace `:id` with the expense's MongoDB ID. Send only the fields you want to update.

**Example JSON body:**
```json
{
  "amount": 300,
  "category": "Groceries",
  "date": "2026-10-24"
}
```

At least one supported field should be provided. `amount` must be a number greater than `0`; `category` must be a non-empty string; `date` must be a valid date.

## 6. Delete an Expense

**DELETE** `/expenses/:id`

Replace `:id` with the expense's MongoDB ID.

**Request body:** None

## 7. Monthly Expense Summary

**GET** `/expenses/summary/monthly`

Returns expense totals grouped by year and month, including the number of expenses.

**Request body:** None

## 8. Category Expense Summary

**GET** `/expenses/summary/category`

Returns expense totals grouped by category, including the number of expenses.

**Request body:** None

## 9. Check Monthly Budget

**POST** `/expenses/budget-check`

Checks total spending for a selected month against a budget supplied in the request. The budget is not saved.

**JSON body:**
```json
{
  "monthlyBudget": 5000,
  "year": 2026,
  "month": 10
}
```

- `monthlyBudget` — required number greater than `0`
- `year` — optional integer; defaults to the current year
- `month` — optional integer from `1` to `12`; defaults to the current month

## Quick Reference

| Method | Endpoint | Body required? |
|---|---|---|
| GET | `/health` | No |
| POST | `/expenses` | Yes |
| GET | `/expenses` | No |
| GET | `/expenses/:id` | No |
| PATCH | `/expenses/:id` | Yes |
| DELETE | `/expenses/:id` | No |
| GET | `/expenses/summary/monthly` | No |
| GET | `/expenses/summary/category` | No |
| POST | `/expenses/budget-check` | Yes |
