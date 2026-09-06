console.log("dashboard js is loaded")
let searchInput = document.getElementById("searchInput")
let transactionFilter = document.getElementById("transactionFilter")
let allTransactions = []
let transactionList = document.getElementById("transactionList")
let sortTransactions = document.getElementById("sortTransactions")
console.log(sortTransactions)
function displayTransactions(transactions) {

	transactionList.innerHTML = ""

	for (let transaction of transactions) {

		let transactionElement = document.createElement("div")
		let category = transaction.category.toLowerCase()
		let icon = "💰"
		if (category == 'food') {
			icon = "🍔"
		}
		if (category == 'shopping' || category == 'cloths') {
			icon = "🛍️"
		}
		if (category == 'travel') {
			icon = "🚗"
		}
		if (category == 'salary') {
			icon = "💵"
		}
		transactionElement.className = "transaction"

		let amountClass = ""
		let amountSign = ""

		if (transaction.transaction_type == "income") {
			amountClass = "income"
			amountSign = "+"
		}

		if (transaction.transaction_type == "expense") {
			amountClass = "expense"
			amountSign = "-"
		}

		transactionElement.innerHTML = `
            <div class="transaction-left">

                <div class="transaction-icon">
                    ${icon}
                </div>

                <div>
                    <div class="transaction-name">
                        ${transaction.category}
                    </div>
					<div class="transaction-description">
    ${transaction.description || ""}
</div>

                    <div class="transaction-date">
                        ${transaction.date}
                    </div>
                </div>

            </div>

            <div class="transaction-amount ${amountClass}">
                ${amountSign} ₹${transaction.amount}
            </div>

            <div class="transaction-actions">
    <button class="edit-btn" data-id="${transaction.id}">
        Edit
    </button>

    <button class="delete-btn" data-id="${transaction.id}">
        Delete
    </button>
</div>
        `

		transactionList.appendChild(transactionElement)
	}
}
transactionList.addEventListener("click", function (event) {

	if (event.target.classList.contains("edit-btn")) {

		let id = event.target.dataset.id

		window.location.href = `/add_transaction/?id=${id}`
	}


	if (event.target.classList.contains("delete-btn")) {

		let id = event.target.dataset.id

		console.log("DELETE BUTTON CLICKED")

		let confirmDelete = confirm("Are you sure you want to delete this transaction?")

		if (!confirmDelete) {
			return
		}

		let transaction = allTransactions.find(function (transaction) {
			return transaction.id == id
		})

		let token = localStorage.getItem("accessToken")

		fetch('http://127.0.0.1:8000/transactions/', {
			method: 'DELETE',
			headers: {
				'Authorization': "Bearer " + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: id
			})
		})
			.then(response => {

				if (response.ok) {

					allTransactions = allTransactions.filter(function (transaction) {
						return transaction.id != id
					})

					filterTransactions()
					calculateTotals()
				}

				return response.json()
			})
			.then(data => {
				console.log(data)
			})

	}

})

function calculateTotals() {
   console.log("calculateTotals called")
	let totalIncome = 0
	let totalExpense = 0

	let monthlyIncome = 0
	let monthlyExpense = 0 

	for (let transaction of allTransactions) {

		if (transaction.transaction_type === "income") {
			totalIncome = totalIncome + Number(transaction.amount)

			let transactionDate = new Date(transaction.date)
			let currentDate = new Date()

			if(
				transactionDate.getMonth() == currentDate.getMonth() &&
				transactionDate.getFullYear() == currentDate.getFullYear()
			){
				monthlyIncome = monthlyIncome + Number(transaction.amount)
			}
		}

		if (transaction.transaction_type === "expense") {
    totalExpense = totalExpense + Number(transaction.amount)

    let transactionDate = new Date(transaction.date)
    let currentDate = new Date()

    if (
        transactionDate.getMonth() == currentDate.getMonth() &&
        transactionDate.getFullYear() == currentDate.getFullYear()
    ) {
        monthlyExpense = monthlyExpense + Number(transaction.amount)
    }
}
	}

	let totalBalance = totalIncome - totalExpense

	document.getElementById("totalIncome").textContent = "₹" + totalIncome
	document.getElementById("totalExpense").textContent = "₹" + totalExpense
	document.getElementById("totalBalance").textContent = "₹" + totalBalance

	document.getElementById("monthlyIncome").textContent = "₹" + monthlyIncome
document.getElementById("monthlyExpense").textContent = "₹" + monthlyExpense
let savings = monthlyIncome - monthlyExpense

let savingsElement = document.getElementById("monthlySavings")

savingsElement.textContent = "₹" + savings

if (savings > 0) {
    savingsElement.style.color = "#4ADE80"
} else if (savings < 0) {
    savingsElement.style.color = "#F87171"
} else {
    savingsElement.style.color = "#F8FAFC"
}
}





function filterTransactions() {

	let searchText = searchInput.value.toLowerCase()
	let selectedType = transactionFilter.value
	let selectedSort = sortTransactions.value

	let filteredTransactions = allTransactions.filter(function (transaction) {

		let matchesSearch =
			transaction.category.toLowerCase().includes(searchText) ||
			(transaction.description || "").toLowerCase().includes(searchText) ||
			Number(transaction.amount).toString().includes(searchText)

		let matchesType =
			selectedType == "all" ||
			transaction.transaction_type == selectedType

		return matchesSearch && matchesType
	})


	if (selectedSort == "newest") {

		filteredTransactions.sort(function (a, b) {
			return new Date(b.date) - new Date(a.date)
		})

	}


	if (selectedSort == "oldest") {

		filteredTransactions.sort(function (a, b) {
			return new Date(a.date) - new Date(b.date)
		})

	}
	if (selectedSort == "highest") {

		filteredTransactions.sort(function (a, b) {
			return Number(b.amount) - Number(a.amount)
		})

	}

	if (selectedSort == "lowest") {

		filteredTransactions.sort(function (a, b) {
			return Number(a.amount) - Number(b.amount)
		})

	}


	displayTransactions(filteredTransactions)
}
searchInput.addEventListener("input", function () {
	filterTransactions()
})

transactionFilter.addEventListener("change", function () {
	filterTransactions()
})
sortTransactions.addEventListener("change", function () {
	filterTransactions()
})


let token = localStorage.getItem("accessToken")

console.log(token)

fetch('http://127.0.0.1:8000/transactions/', {
	method: "GET",
	headers: {
		"Authorization": "Bearer " + token
	}
})
	.then((response) => {
		if (response.status === 401) {
        localStorage.removeItem("accessToken")
        window.location.href = "/login_page/"
        return
    }
		return response.json()
	})
	.then((data) => {
		
		allTransactions = data
		displayTransactions(data)
		console.log("API DATA:", data)
		calculateTotals()


		
	



		






	})






// let transaction = {
//     amount: 500,
//     transaction_type: "expense",
//     category: "Salary",
//     description: "Part-time salary"
// }

// fetch('http://127.0.0.1:8000/transactions/' ,{
// 	method : "POST",
// 	headers :
// 	{
// 		"Authorization" : "Bearer " + token ,
// 		"Content-Type" : "application/json"
// 	},
// 	body:JSON.stringify(transaction)
// } )
// .then((response)=>{
// 	return response.json()
// })
// .then((data)=>{
// 	console.log(data)
// })