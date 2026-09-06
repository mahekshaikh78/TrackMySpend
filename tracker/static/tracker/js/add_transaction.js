
let token = localStorage.getItem("accessToken")

if (!token) {
    window.location.href = "/login_page/"
} 
let oldTransaction = null

let params = new URLSearchParams(window.location.search)
let id = params.get("id")
if (id) {
    document.getElementById("submitButton").textContent = "Update Transaction"
}

if (id) {

    fetch('http://127.0.0.1:8000/transactions/', {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {

         oldTransaction = data.find(function(transaction) {
            return transaction.id == id
        })

        console.log(oldTransaction)
		if (!oldTransaction) {
    alert("Transaction not found")
    window.location.href = "/dashboard/"
    return
}


    document.getElementById("amount").value =  oldTransaction.amount
    document.getElementById("transactionType").value =  oldTransaction.transaction_type
    document.getElementById("category").value =  oldTransaction.category
    document.getElementById("description").value =  oldTransaction.description

    })

}


let form = document.getElementById('transactionForm')

form.addEventListener('submit' , function(event){
	event.preventDefault()

      
    if (!token) {
        alert("Please login first.")
        window.location.href = "/login_page/"
        return
    }
	let amount = Number(document.getElementById("amount").value)
	let transactionType = document.getElementById("transactionType").value
	let category = document.getElementById("category").value
	let description = document.getElementById("description").value
	if (amount <= 0) {
    alert("Amount must be greater than 0")
    return
}

if (transactionType === "") {
    alert("Please select transaction type")
    return
}

if (category.trim() === "") {
    alert("Category is required")
    return
}

	let transaction = {
		id : id ,
		amount : amount ,
		transaction_type : transactionType ,
		category : category ,
		description :description

	}
	let method = "POST"

if (id) {
    method = "PUT"
}

	

	fetch('http://127.0.0.1:8000/transactions/' , {
	method : method ,
	headers :{
		"Authorization" : "Bearer " + token ,
		"content-Type" : "application/json"
	},
	body : JSON.stringify(transaction)
})
.then((response) => {

    if (response.status === 401) {
        localStorage.removeItem("accessToken")
        alert("Session expired. Please login again.")
        window.location.href = "/login_page/"
        return
    }

    return response.json()

})

.then((data) =>{

    if (!data) {
        return
    }

    console.log(data)

    form.reset()

    if (method == "PUT"){

        alert("Transaction updated successfully")

    }

    else{

        alert("Transaction added successfully")

    }

    window.location.href = '/dashboard/'

})

})

