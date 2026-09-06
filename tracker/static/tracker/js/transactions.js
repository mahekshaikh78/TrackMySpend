console.log("transaction history loaded...")

let token = localStorage.getItem("accessToken")

if (!token) {
    window.location.href = "/login_page/"
}

fetch('http://127.0.0.1:8000/transactions/' , {
	method : 'GET' ,
	headers: {
        "Authorization": "Bearer " + token
    }
})
.then(response => {

    if (response.status === 401) {
        localStorage.removeItem("accessToken")
        alert("Session expired. Please login again.")
        window.location.href = "/login_page/"
        return
    }

    return response.json()
})
.then(data => {
    console.log("Transaction History Data:", data)
	 let transactionList = document.getElementById("transactionList")

    for (let transaction of data) {

        let transactionElement = document.createElement("div")

        transactionElement.className = "transaction"

        transactionElement.innerHTML = `
    <div class="transaction-left">

        <div class="transaction-icon">
            💰
        </div>

        <div>
            <div class="transaction-category">
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

    <div class="transaction-actions">

    <div class="transaction-amount ${transaction.transaction_type}">
        ${transaction.transaction_type === "income" ? "+" : "-"}₹${transaction.amount}
    </div>

    <button class="edit-btn" data-id="${transaction.id}">
        ✏️
    </button>

    <button class="delete-btn" data-id="${transaction.id}">
        🗑️
    </button>

</div>
`

        transactionList.appendChild(transactionElement)
    }
})

document.addEventListener("click"  , function(event){
        if (event.target.classList.contains("edit-btn")) {
            let id = event.target.dataset.id
                    window.location.href = `/add_transaction/?id=${id}`
        }

        if(event.target.classList.contains("delete-btn")){
            if (!confirm("Are you sure you want to delete this transaction?")) return
            let id = event.target.dataset.id
            fetch('http://127.0.0.1:8000/transactions/', {
                method : "DELETE" , 
                headers : {
                    "Authorization": "Bearer " + token , 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id: id})
          }).then(response => {

    if (response.status === 401) {
        localStorage.removeItem("accessToken")
        alert("Session expired. Please login again.")
        window.location.href = "/login_page/"
        return
    }

    return response.json()
})
.then(data => {

    if (!data) {
        return
    }

    if (data.message) {
        window.location.href = "/dashboard/"
    }

})
        }
    })