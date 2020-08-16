import React, { useState, useEffect } from "react";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import Alert from "./components/Alert";
import { v4 as uuidv4 } from "uuid";
import FlipMove from "react-flip-move";
import "./App.css";

/* const intialExpenses = [
  {
    id: uuidv4(),
    charge: "rent",
    amount: 1600,
  },
  {
    id: uuidv4(),
    charge: "car payment",
    amount: 400,
  },
  {
    id: uuidv4(),
    charge: "credit card bill",
    amount: 1200,
  },
]; */

const intialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {
  /* ***************************** state values ******************************* */
  /* all expenses,add expense */
  const [expenses, setExpenses] = useState(intialExpenses);
  /* single expense */
  const [charge, setCharge] = useState("");
  /* single amount */
  const [amount, setAmount] = useState(0);
  /* single alert */
  const [alert, setAlert] = useState({ show: false });
  /* edit */
  const [edit, setEdit] = useState(false);
  /* edit item */
  const [id, setId] = useState(0);

  /* **************************** use effect ******************************** */
  useEffect(() => {
    console.log("we called useEffects");
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  /* **************************** functionality ******************************** */
  const handleCharge = (event) => {
    setCharge(event.target.value);
  };
  const handleAmount = (event) => {
    setAmount(event.target.value);
  };
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (charge && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, expenses } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        setId(0);
        handleAlert({
          type: "success",
          text: "Expense Updated Succesfully",
        });
      } else {
        const singleExpense = {
          id: uuidv4(),
          charge: charge,
          amount: amount,
        };
        const AddExpense = [...expenses, singleExpense];
        setExpenses(AddExpense);
        handleAlert({
          type: "success",
          text: "Expense Added Succesfully",
        });
      }
      setCharge("");
      setAmount(0);
    } else {
      handleAlert({
        type: "danger",
        text: "Data cant be null values",
      });
    }
  };
  //clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: `All items deleted` });
  };
  //handle delete item
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: `item deleted` });
  };
  //handle edit item
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense;
    setId(id);
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          edit={edit}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          handleCharge={handleCharge}
        ></ExpenseForm>
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        ></ExpenseList>
      </main>
      <h1>
        Total Spending :{" "}
        <span className="total">
          $
          {expenses.reduce((total, curr) => {
            return (total += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
